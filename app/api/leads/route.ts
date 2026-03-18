import { NextResponse } from "next/server"
import { leadSchema } from "@/lib/validation"
import { isRateLimited } from "@/lib/rate-limit"
import { prisma } from "@/lib/db"

const CASANEO_API_URL = process.env.CASANEO_API_URL
const CASANEO_API_KEY = process.env.CASANEO_API_KEY
const TRAVAUX_API_URL = process.env.TRAVAUX_API_URL
const TRAVAUX_API_KEY = process.env.TRAVAUX_API_KEY
const WEBHOOK_URL = process.env.WEBHOOK_NOTIFICATION_URL

interface DispatchPayload {
  name: string
  phone: string
  email: string
  zip: string
  trade: string
  surface: number
  message?: string
  budget?: string
  urgency?: string
  propertyType?: string
}

/** Build enriched message with extra fields for partners */
function buildPartnerMessage(lead: DispatchPayload): string {
  const parts: string[] = []
  if (lead.message) parts.push(lead.message)
  if (lead.budget) parts.push(`Budget: ${lead.budget}`)
  if (lead.urgency) parts.push(`Délai: ${lead.urgency}`)
  if (lead.propertyType) parts.push(`Bien: ${lead.propertyType}`)
  return parts.join(" | ")
}

/** Attempt to send lead to Casaneo (Partner A) */
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
        firstname: lead.name.split(" ")[0],
        lastname: lead.name.split(" ").slice(1).join(" ") || lead.name,
        phone: lead.phone,
        email: lead.email,
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

/** Attempt to send lead to Travaux.com (Partner B) */
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
        contact_name: lead.name,
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

/** Send webhook notification */
async function sendWebhook(lead: DispatchPayload): Promise<void> {
  if (!WEBHOOK_URL) return

  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `🚨 Nouveau lead !\nNom: ${lead.name}\nTél: ${lead.phone}\nEmail: ${lead.email}\nCode postal: ${lead.zip}\nCorps: ${lead.trade}\nSurface: ${lead.surface} m²\nBudget: ${lead.budget || "—"}\nDélai: ${lead.urgency || "—"}\nBien: ${lead.propertyType || "—"}`,
        lead,
      }),
      signal: AbortSignal.timeout(5000),
    })
  } catch {
    console.error("[WEBHOOK_FAIL] Could not send notification")
  }
}

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
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
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

    // Waterfall dispatch
    const sentToCasaneo = await sendToCasaneo(lead)
    if (sentToCasaneo) {
      await prisma.lead.update({
        where: { id: dbLead.id },
        data: { dispatcher: "casaneo", dispatcherStatus: true },
      })
      return NextResponse.json({ success: true, dispatcher: "casaneo" })
    }

    const sentToTravaux = await sendToTravaux(lead)
    if (sentToTravaux) {
      await prisma.lead.update({
        where: { id: dbLead.id },
        data: { dispatcher: "travaux", dispatcherStatus: true },
      })
      return NextResponse.json({ success: true, dispatcher: "travaux" })
    }

    // All partners failed — fallback
    await prisma.lead.update({
      where: { id: dbLead.id },
      data: { dispatcher: "fallback", dispatcherStatus: false },
    })
    await sendWebhook(lead)

    return NextResponse.json({ success: true, dispatcher: "fallback" })
  } catch (err) {
    console.error("[LEAD_ERROR]", err)
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    )
  }
}
