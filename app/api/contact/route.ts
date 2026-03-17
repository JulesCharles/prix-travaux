import { NextResponse } from "next/server"
import { contactSchema } from "@/lib/validation"
import { isRateLimited } from "@/lib/rate-limit"

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
    const data = contactSchema.parse(body)

    // Honeypot check — bots fill this hidden field
    if (data.website) {
      return NextResponse.json({ success: true })
    }

    // Log for now — replace with email service (Resend, SendGrid, etc.)
    console.log("[Contact Form]", {
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Error && "issues" in error) {
      return NextResponse.json(
        { error: "Données invalides", details: (error as { issues: unknown }).issues },
        { status: 400 }
      )
    }

    console.error("[Contact Error]", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}
