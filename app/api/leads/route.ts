import { NextResponse } from "next/server"
import { leadSchema } from "@/lib/validation"
import { isRateLimited } from "@/lib/rate-limit"
import { prisma } from "@/lib/db"

// --- Partner API keys (all optional — waterfall skips if missing) ---
const EFFY_API_URL = process.env.EFFY_API_URL
const EFFY_API_KEY = process.env.EFFY_API_KEY
const HELLIO_API_URL = process.env.HELLIO_API_URL
const HELLIO_API_KEY = process.env.HELLIO_API_KEY
const VITEUNDEVIS_API_KEY = process.env.VITEUNDEVIS_API_KEY
const CASANEO_API_URL = process.env.CASANEO_API_URL
const CASANEO_API_KEY = process.env.CASANEO_API_KEY
const DEVIS123_API_URL = process.env.DEVIS123_API_URL
const DEVIS123_API_KEY = process.env.DEVIS123_API_KEY
const GORACASH_API_URL = process.env.GORACASH_API_URL
const GORACASH_API_KEY = process.env.GORACASH_API_KEY
const TRAVAUX_API_URL = process.env.TRAVAUX_API_URL
const TRAVAUX_API_KEY = process.env.TRAVAUX_API_KEY
const WEBHOOK_URL = process.env.WEBHOOK_NOTIFICATION_URL

// --- Trades that qualify as "energy" leads (higher CPL via Effy/Hellio) ---
const ENERGY_TRADES = new Set([
  "isolation",
  "chauffage",
  "climatisation",
  "vmc",
])

// --- ViteUnDevis mappings ---
const VITEUNDEVIS_CAT_IDS: Record<string, number> = {
  "toiture": 143,
  "isolation": 12,
  "plomberie": 14,
  "electricite": 13,
  "chauffage": 156,
  "salle-de-bain": 23,
  "menuiserie": 10,
  "peinture": 28,
  "carrelage": 25,
  "facade": 62,
  "charpente": 8,
  "terrassement": 9,
  "maconnerie": 7,
  "climatisation": 19,
  "assainissement": 61,
  "amenagement-combles": 75,
  "extension-maison": 5,
  "vmc": 98,
}

const VITEUNDEVIS_DELAIS: Record<string, number> = {
  "urgent": 1,
  "1-3mois": 2,
  "3-6mois": 2,
  "info": 4,
}

const VITEUNDEVIS_TYPE_BIEN: Record<string, number> = {
  "maison": 2,
  "appartement": 1,
  "local": 4,
}

interface DispatchPayload {
  firstName: string
  lastName: string
  phone: string
  email: string
  address: string
  city: string
  zip: string
  trade: string
  surface: number
  message?: string
  budget?: string
  urgency?: string
  propertyType?: string
}

type DispatchResult = { success: boolean; dispatcher: string }

// ============================================================
// PARTNER FUNCTIONS
// Each returns false/skip if no API key is configured
// ============================================================

function buildPartnerMessage(lead: DispatchPayload): string {
  const parts: string[] = []
  if (lead.message) parts.push(lead.message)
  if (lead.budget) parts.push(`Budget: ${lead.budget}`)
  if (lead.urgency) parts.push(`Délai: ${lead.urgency}`)
  if (lead.propertyType) parts.push(`Bien: ${lead.propertyType}`)
  return parts.join(" | ")
}

function parseBudget(budget?: string): number {
  if (!budget) return 0
  switch (budget) {
    case "<5000": return 5000
    case "5000-15000": return 15000
    case "15000-30000": return 30000
    case "30000+": return 50000
    default: return 0
  }
}

// --- Effy (energy leads — isolation, PAC, chauffage, VMC) ---
async function sendToEffy(lead: DispatchPayload): Promise<boolean> {
  if (!EFFY_API_URL || !EFFY_API_KEY) return false

  try {
    const res = await fetch(EFFY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${EFFY_API_KEY}`,
      },
      body: JSON.stringify({
        firstname: lead.firstName,
        lastname: lead.lastName,
        phone: lead.phone,
        email: lead.email,
        address: lead.address,
        city: lead.city,
        zipcode: lead.zip,
        project_type: lead.trade,
        surface: lead.surface,
        description: buildPartnerMessage(lead),
      }),
      signal: AbortSignal.timeout(10000),
    })
    return res.ok
  } catch {
    return false
  }
}

// --- Hellio (energy leads — isolation, PAC, rénovation globale) ---
async function sendToHellio(lead: DispatchPayload): Promise<boolean> {
  if (!HELLIO_API_URL || !HELLIO_API_KEY) return false

  try {
    const res = await fetch(HELLIO_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${HELLIO_API_KEY}`,
      },
      body: JSON.stringify({
        firstname: lead.firstName,
        lastname: lead.lastName,
        phone: lead.phone,
        email: lead.email,
        address: lead.address,
        city: lead.city,
        zipcode: lead.zip,
        project_type: lead.trade,
        surface: lead.surface,
        description: buildPartnerMessage(lead),
      }),
      signal: AbortSignal.timeout(10000),
    })
    return res.ok
  } catch {
    return false
  }
}

// --- ViteUnDevis: Ping ---
async function pingViteUnDevis(lead: DispatchPayload): Promise<{ accept: boolean; recommande: boolean; cpl: number; ecpl: number }> {
  if (!VITEUNDEVIS_API_KEY) return { accept: false, recommande: false, cpl: 0, ecpl: 0 }

  const catId = VITEUNDEVIS_CAT_IDS[lead.trade]
  if (!catId) return { accept: false, recommande: false, cpl: 0, ecpl: 0 }

  try {
    const params = new URLSearchParams({
      token: VITEUNDEVIS_API_KEY,
      cat_id: String(catId),
      code_postal: lead.zip,
      pays: "fr",
      description: buildPartnerMessage(lead) || `Projet ${lead.trade} - ${lead.surface}m²`,
    })

    const res = await fetch("https://www.viteundevis.com/api/ping.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
      signal: AbortSignal.timeout(10000),
    })

    if (!res.ok) return { accept: false, recommande: false, cpl: 0, ecpl: 0 }

    const data = await res.json()
    return {
      accept: data.accept === 1,
      recommande: data.recommande === 1,
      cpl: Number(data.cpl) || 0,
      ecpl: Number(data.ecpl) || 0,
    }
  } catch {
    return { accept: false, recommande: false, cpl: 0, ecpl: 0 }
  }
}

// --- ViteUnDevis: Send lead ---
async function sendToViteUnDevis(lead: DispatchPayload): Promise<boolean> {
  if (!VITEUNDEVIS_API_KEY) return false

  const catId = VITEUNDEVIS_CAT_IDS[lead.trade]
  if (!catId) return false

  try {
    const description = buildPartnerMessage(lead) || `Projet ${lead.trade} - ${lead.surface}m²`

    const params = new URLSearchParams({
      key: VITEUNDEVIS_API_KEY,
      nom: lead.lastName,
      prenom: lead.firstName,
      email: lead.email,
      tel: lead.phone.replace(/[\s.-]/g, ""),
      adresse1: lead.address,
      cp: lead.zip,
      ville: lead.city,
      cp_projet: lead.zip,
      ville_projet: lead.city,
      pays: "fr",
      cat_id: String(catId),
      surface: String(lead.surface),
      budget: String(parseBudget(lead.budget)),
      tp: "1",
      type_bien: String(VITEUNDEVIS_TYPE_BIEN[lead.propertyType || "maison"] || 2),
      situation: "1",
      delais: String(VITEUNDEVIS_DELAIS[lead.urgency || "info"] || 4),
      description,
      site_name: "prix-travaux-28.fr",
      format_return: "json",
    })

    const res = await fetch("https://www.viteundevis.com/api/get.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": `partenaire-apivud-${VITEUNDEVIS_API_KEY}`,
      },
      body: params.toString(),
      signal: AbortSignal.timeout(15000),
    })

    if (!res.ok) return false

    const data = await res.json()
    const code = data.code_retour?.[0]?.code
    if (code === "200" || code === 200) return true

    console.error("[VITEUNDEVIS_REJECT]", data.code_retour)
    return false
  } catch (err) {
    console.error("[VITEUNDEVIS_ERROR]", err)
    return false
  }
}

// --- Casaneo ---
async function sendToCasaneo(lead: DispatchPayload): Promise<boolean> {
  if (!CASANEO_API_URL || !CASANEO_API_KEY) return false

  try {
    const res = await fetch(CASANEO_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CASANEO_API_KEY}`,
      },
      body: JSON.stringify({
        firstname: lead.firstName,
        lastname: lead.lastName,
        phone: lead.phone,
        email: lead.email,
        address: lead.address,
        city: lead.city,
        zipcode: lead.zip,
        project_type: lead.trade,
        surface: lead.surface,
        message: buildPartnerMessage(lead),
      }),
      signal: AbortSignal.timeout(10000),
    })
    return res.ok
  } catch {
    return false
  }
}

// --- 123Devis ---
async function sendTo123Devis(lead: DispatchPayload): Promise<boolean> {
  if (!DEVIS123_API_URL || !DEVIS123_API_KEY) return false

  try {
    const res = await fetch(DEVIS123_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DEVIS123_API_KEY}`,
      },
      body: JSON.stringify({
        firstname: lead.firstName,
        lastname: lead.lastName,
        phone: lead.phone,
        email: lead.email,
        address: lead.address,
        city: lead.city,
        zipcode: lead.zip,
        project_type: lead.trade,
        surface: lead.surface,
        description: buildPartnerMessage(lead),
      }),
      signal: AbortSignal.timeout(10000),
    })
    return res.ok
  } catch {
    return false
  }
}

// --- Goracash / TravauxProx ---
async function sendToGoracash(lead: DispatchPayload): Promise<boolean> {
  if (!GORACASH_API_URL || !GORACASH_API_KEY) return false

  try {
    const res = await fetch(GORACASH_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GORACASH_API_KEY}`,
      },
      body: JSON.stringify({
        firstname: lead.firstName,
        lastname: lead.lastName,
        phone: lead.phone,
        email: lead.email,
        address: lead.address,
        city: lead.city,
        zipcode: lead.zip,
        project_type: lead.trade,
        surface: lead.surface,
        description: buildPartnerMessage(lead),
      }),
      signal: AbortSignal.timeout(10000),
    })
    return res.ok
  } catch {
    return false
  }
}

// --- Travaux.com ---
async function sendToTravaux(lead: DispatchPayload): Promise<boolean> {
  if (!TRAVAUX_API_URL || !TRAVAUX_API_KEY) return false

  try {
    const res = await fetch(TRAVAUX_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": TRAVAUX_API_KEY,
      },
      body: JSON.stringify({
        contact_name: `${lead.firstName} ${lead.lastName}`,
        contact_phone: lead.phone,
        contact_email: lead.email,
        postal_code: lead.zip,
        category: lead.trade,
        area_m2: lead.surface,
        description: buildPartnerMessage(lead),
      }),
      signal: AbortSignal.timeout(10000),
    })
    return res.ok
  } catch {
    return false
  }
}

// --- Webhook fallback ---
async function sendWebhook(lead: DispatchPayload): Promise<void> {
  if (!WEBHOOK_URL) return

  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `🚨 Nouveau lead !\nPrénom: ${lead.firstName}\nNom: ${lead.lastName}\nTél: ${lead.phone}\nEmail: ${lead.email}\nAdresse: ${lead.address}\nVille: ${lead.city} (${lead.zip})\nCorps: ${lead.trade}\nSurface: ${lead.surface} m²\nBudget: ${lead.budget || "—"}\nDélai: ${lead.urgency || "—"}\nBien: ${lead.propertyType || "—"}`,
        lead,
      }),
      signal: AbortSignal.timeout(5000),
    })
  } catch {
    console.error("[WEBHOOK_FAIL] Could not send notification")
  }
}

// ============================================================
// WATERFALL DISPATCH
// Energy leads: Effy → Hellio → ViteUnDevis → Casaneo → 123Devis → Goracash → Travaux.com
// General leads: ViteUnDevis → Casaneo → 123Devis → Goracash → Travaux.com
// Each step is skipped if no API key is configured.
// ============================================================

async function dispatchLead(lead: DispatchPayload): Promise<DispatchResult> {
  const isEnergy = ENERGY_TRADES.has(lead.trade)

  // --- Energy-specific partners first ---
  if (isEnergy) {
    if (await sendToEffy(lead)) return { success: true, dispatcher: "effy" }
    if (await sendToHellio(lead)) return { success: true, dispatcher: "hellio" }
  }

  // --- ViteUnDevis with smart ping ---
  const ping = await pingViteUnDevis(lead)
  if (ping.accept || ping.recommande) {
    if (await sendToViteUnDevis(lead)) return { success: true, dispatcher: "viteundevis" }
  }

  // --- General partners cascade ---
  if (await sendToCasaneo(lead)) return { success: true, dispatcher: "casaneo" }
  if (await sendTo123Devis(lead)) return { success: true, dispatcher: "123devis" }
  if (await sendToGoracash(lead)) return { success: true, dispatcher: "goracash" }
  if (await sendToTravaux(lead)) return { success: true, dispatcher: "travaux" }

  return { success: false, dispatcher: "fallback" }
}

// ============================================================
// API ROUTE
// ============================================================

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Trop de requêtes. Veuillez réessayer dans quelques instants." },
        { status: 429 }
      )
    }

    const body = await request.json()
    const result = leadSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "Données invalides", details: result.error.issues },
        { status: 400 }
      )
    }

    const lead = result.data

    // Honeypot check — bots fill this hidden field
    if (lead.website) {
      return NextResponse.json({ success: true, dispatcher: "none" })
    }

    // Get geo data from Vercel headers
    const cityGeo = request.headers.get("x-vercel-ip-city") || undefined

    // Calculate expiry (3 years RGPD)
    const now = new Date()
    const expiresAt = new Date(now)
    expiresAt.setFullYear(expiresAt.getFullYear() + 3)

    // Save to database FIRST
    const dbLead = await prisma.lead.create({
      data: {
        firstName: lead.firstName,
        lastName: lead.lastName,
        phone: lead.phone,
        email: lead.email,
        address: lead.address,
        city: lead.city,
        zip: lead.zip,
        trade: lead.trade,
        surface: lead.surface,
        message: lead.message || null,
        budget: lead.budget || null,
        urgency: lead.urgency || null,
        propertyType: lead.propertyType || null,
        sourceUrl: lead.sourceUrl || null,
        utmSource: lead.utmSource || null,
        utmMedium: lead.utmMedium || null,
        utmCampaign: lead.utmCampaign || null,
        device: lead.device || null,
        cityGeo: cityGeo || null,
        expiresAt,
      },
    })

    // Dispatch through waterfall
    const { success, dispatcher } = await dispatchLead(lead)

    // Update lead with dispatch result
    await prisma.lead.update({
      where: { id: dbLead.id },
      data: { dispatcher, dispatcherStatus: success },
    })

    // If all partners failed, send webhook notification
    if (!success) {
      await sendWebhook(lead)
    }

    return NextResponse.json({ success: true, dispatcher })
  } catch (err) {
    console.error("[LEAD_ERROR]", err)
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    )
  }
}
