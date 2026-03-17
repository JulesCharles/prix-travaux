import { NextResponse } from "next/server"
import { leadSchema } from "@/lib/validation"

const CASANEO_API_URL = process.env.CASANEO_API_URL
const CASANEO_API_KEY = process.env.CASANEO_API_KEY
const TRAVAUX_API_URL = process.env.TRAVAUX_API_URL
const TRAVAUX_API_KEY = process.env.TRAVAUX_API_KEY
const WEBHOOK_URL = process.env.WEBHOOK_NOTIFICATION_URL

interface LeadPayload {
  name: string
  phone: string
  email: string
  zip: string
  trade: string
  surface: number
  message?: string
}

/** Attempt to send lead to Casaneo (Partner A) */
async function sendToCasaneo(lead: LeadPayload): Promise<boolean> {
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
        message: lead.message || "",
      }),
      signal: AbortSignal.timeout(10000),
    })
    return res.ok
  } catch {
    return false
  }
}

/** Attempt to send lead to Travaux.com (Partner B) */
async function sendToTravaux(lead: LeadPayload): Promise<boolean> {
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
        description: lead.message || "",
      }),
      signal: AbortSignal.timeout(10000),
    })
    return res.ok
  } catch {
    return false
  }
}

/** Fallback: store lead locally and send notification */
async function fallbackStore(lead: LeadPayload): Promise<void> {
  // Log to server console for now — replace with Supabase/SQLite in production
  console.log("[LEAD_FALLBACK]", JSON.stringify(lead, null, 2))

  // Send webhook notification if configured
  if (WEBHOOK_URL) {
    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `🚨 Nouveau lead non dispatché !\nNom: ${lead.name}\nTél: ${lead.phone}\nEmail: ${lead.email}\nCode postal: ${lead.zip}\nCorps: ${lead.trade}\nSurface: ${lead.surface} m²`,
          lead,
        }),
        signal: AbortSignal.timeout(5000),
      })
    } catch {
      console.error("[WEBHOOK_FAIL] Could not send notification")
    }
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = leadSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "Données invalides", details: result.error.issues },
        { status: 400 }
      )
    }

    const lead = result.data

    // Waterfall dispatch
    const sentToCasaneo = await sendToCasaneo(lead)
    if (sentToCasaneo) {
      return NextResponse.json({ success: true, dispatcher: "casaneo" })
    }

    const sentToTravaux = await sendToTravaux(lead)
    if (sentToTravaux) {
      return NextResponse.json({ success: true, dispatcher: "travaux" })
    }

    // All partners failed — fallback
    await fallbackStore(lead)
    return NextResponse.json({ success: true, dispatcher: "fallback" })
  } catch {
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    )
  }
}
