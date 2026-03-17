import type { Metadata } from "next"
import { Mail, MapPin, Clock } from "lucide-react"
import { Breadcrumb } from "@/components/Breadcrumb"
import { ContactForm } from "@/components/ContactForm"

export const metadata: Metadata = {
  title: "Contact — Prix Travaux 28",
  description:
    "Contactez l'équipe Prix Travaux 28 pour toute question sur les prix des travaux en Eure-et-Loir.",
  alternates: { canonical: "/contact" },
}

export default function ContactPage() {
  return (
    <>
      <Breadcrumb
        items={[
          { label: "Accueil", href: "/" },
          { label: "Contact" },
        ]}
      />

      <div className="grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <h1 className="mb-4 font-heading text-3xl font-bold tracking-tight">
            Contactez-nous
          </h1>
          <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
            Une question sur les prix des travaux en Eure-et-Loir ? Un
            partenariat artisan ? Notre équipe vous répond sous 24h.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex size-9 items-center justify-center rounded-full bg-primary/10">
                <Mail className="size-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Email</p>
                <p className="text-sm text-muted-foreground">
                  contact@prix-travaux-28.fr
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex size-9 items-center justify-center rounded-full bg-primary/10">
                <MapPin className="size-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Zone couverte</p>
                <p className="text-sm text-muted-foreground">
                  Eure-et-Loir (28) — 33 communes
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex size-9 items-center justify-center rounded-full bg-primary/10">
                <Clock className="size-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Délai de réponse</p>
                <p className="text-sm text-muted-foreground">
                  Sous 24h ouvrées
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <ContactForm />
        </div>
      </div>
    </>
  )
}
