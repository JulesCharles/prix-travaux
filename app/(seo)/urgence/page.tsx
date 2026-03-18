import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, AlertTriangle, MapPin, Phone, Clock, Shield, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getEmergencyTrades, getTopCities } from "@/lib/data"
import { tradeIcons } from "@/lib/trade-icons"
import { Breadcrumb } from "@/components/Breadcrumb"

export const metadata: Metadata = {
  title: "Dépannage urgent en Eure-et-Loir (28) — Artisans disponibles",
  description:
    "Besoin d'un dépannage urgent en Eure-et-Loir ? Plombier, électricien, chauffagiste, couvreur : trouvez un artisan disponible rapidement dans votre commune. Intervention rapide et devis gratuit.",
  alternates: { canonical: "/urgence" },
}

export default function UrgenceIndexPage() {
  const emergencyTrades = getEmergencyTrades()
  const topCities = getTopCities(15)

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Accueil", href: "/" },
          { label: "Dépannage urgent" },
        ]}
      />

      <section className="mb-10">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-red-600">
          <AlertTriangle className="size-4" aria-hidden="true" />
          Intervention rapide
        </div>
        <h1 className="mb-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Dépannage urgent en Eure-et-Loir
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
          Fuite d&apos;eau, panne de chauffage, coupure électrique, fuite de toiture ?
          Trouvez un artisan disponible rapidement dans votre commune pour une
          intervention d&apos;urgence.
        </p>
        <div className="mt-5">
          <Link href={`/urgence/${emergencyTrades[0]?.slug}/${topCities[0]?.slug}`}>
            <Button size="lg" variant="destructive" className="gap-2 shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]">
              <Phone className="size-4" aria-hidden="true" />
              Demander un dépannage urgent
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </Link>
          <p className="mt-2 text-xs text-muted-foreground">
            Réponse sous 24h — Devis gratuit et sans engagement
          </p>
        </div>
      </section>

      {/* ── Ce qui constitue une urgence ── */}
      <section className="mb-10">
        <h2 className="mb-5 font-heading text-xl font-bold">
          Qu&apos;est-ce qu&apos;un dépannage urgent ?
        </h2>
        <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Un dépannage urgent concerne toute situation nécessitant une
            intervention rapide pour <strong className="text-foreground">protéger
            votre logement, votre sécurité ou votre confort</strong>. En
            Eure-et-Loir, les urgences les plus fréquentes sont liées à la
            plomberie (fuites, canalisations gelées en hiver), au chauffage
            (panne de chaudière durant les mois froids) et à la toiture
            (dégâts après tempête).
          </p>
          <p>
            Les interventions d&apos;urgence sont généralement facturées avec un
            <strong className="text-foreground"> supplément de 30 à 50 %</strong> par rapport
            aux tarifs standard, en raison de la disponibilité immédiate et des
            conditions d&apos;intervention parfois complexes (nuit, week-end, jours fériés).
          </p>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            {
              icon: Clock,
              title: "Intervention rapide",
              desc: "Nos artisans partenaires s'engagent sur des délais courts, avec une première réponse sous 24 heures.",
            },
            {
              icon: Shield,
              title: "Artisans assurés",
              desc: "Tous les professionnels disposent d'une assurance décennale et responsabilité civile en cours de validité.",
            },
            {
              icon: CheckCircle,
              title: "Devis transparent",
              desc: "Même en urgence, vous recevez un devis détaillé avant le début de l'intervention. Pas de surprise.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-border/60 bg-card p-4">
              <item.icon className="mb-2 size-5 text-primary" aria-hidden="true" />
              <h3 className="mb-1 text-sm font-bold">{item.title}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Emergency trades ── */}
      <section className="mb-10">
        <h2 className="mb-5 font-heading text-xl font-bold">
          Types de dépannage
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {emergencyTrades.map((trade) => {
            const Icon = tradeIcons[trade.slug] ?? ArrowRight
            return (
              <div key={trade.slug} className="rounded-xl border border-border/60 bg-card p-5">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-red-50">
                    <Icon className="size-5 text-red-600" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{trade.title} — Urgence</p>
                    <p className="text-xs text-muted-foreground">
                      Tarif intervention : {trade.min_price}–{trade.max_price} €/{trade.unit}
                    </p>
                  </div>
                </div>
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {topCities.slice(0, 6).map((city) => (
                    <Link
                      key={city.slug}
                      href={`/urgence/${trade.slug}/${city.slug}`}
                      className="inline-flex items-center gap-1 rounded-md bg-muted/50 px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                    >
                      <MapPin className="size-2.5" aria-hidden="true" />
                      {city.name}
                    </Link>
                  ))}
                  <Link
                    href={`/prix/${trade.slug}`}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-primary"
                  >
                    Toutes les communes →
                  </Link>
                </div>
                <Link href={`/urgence/${trade.slug}/${topCities[0].slug}`}>
                  <Button size="sm" variant="destructive" className="w-full gap-2">
                    <Phone className="size-3.5" aria-hidden="true" />
                    Demander un dépannage {trade.title.toLowerCase()}
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </Button>
                </Link>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── City grid ── */}
      <section className="mb-10">
        <h2 className="mb-5 font-heading text-xl font-bold">
          Dépannage par commune
        </h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {topCities.map((city) => (
            <div
              key={city.slug}
              className="rounded-lg border border-border/60 bg-card p-3"
            >
              <p className="mb-2 text-sm font-semibold">
                <MapPin className="mb-0.5 mr-1 inline size-3.5 text-primary" aria-hidden="true" />
                {city.name} ({city.zip})
              </p>
              <div className="flex flex-wrap gap-1">
                {emergencyTrades.map((trade) => (
                  <Link
                    key={trade.slug}
                    href={`/urgence/${trade.slug}/${city.slug}`}
                    className="rounded bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  >
                    {trade.title}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Conseils prévention ── */}
      <section className="mb-10">
        <h2 className="mb-4 font-heading text-xl font-bold">
          Prévenir les urgences : nos conseils
        </h2>
        <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            La meilleure urgence est celle qui n&apos;arrive pas. En Eure-et-Loir, les
            conditions climatiques — gel hivernal, orages estivaux, vents de plaine —
            exposent les logements à des risques spécifiques qu&apos;un entretien régulier
            permet de prévenir.
          </p>
          <ul className="ml-4 list-disc space-y-2">
            <li>
              <strong className="text-foreground">Toiture :</strong> faites inspecter votre couverture
              chaque automne, surtout dans le Perche où les ardoises peuvent se déloger
              avec les tempêtes hivernales.
            </li>
            <li>
              <strong className="text-foreground">Plomberie :</strong> protégez vos canalisations
              extérieures du gel (calorifugeage) et faites entretenir votre chauffe-eau
              annuellement.
            </li>
            <li>
              <strong className="text-foreground">Chauffage :</strong> un entretien annuel de votre
              chaudière est obligatoire et réduit considérablement les risques de panne
              en plein hiver.
            </li>
            <li>
              <strong className="text-foreground">Électricité :</strong> faites vérifier votre
              installation si elle a plus de 15 ans, particulièrement dans les maisons
              anciennes du département.
            </li>
          </ul>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="mt-10">
        <h2 className="mb-5 font-heading text-xl font-bold">
          Questions fréquentes
        </h2>
        <div className="space-y-5">
          {[
            {
              q: "Quel est le délai d'intervention pour un dépannage urgent ?",
              a: "En zone urbaine (Chartres, Dreux), nos artisans partenaires interviennent généralement sous 2 à 6 heures. En zone rurale (Perche, Dunois), le délai peut atteindre 6 à 12 heures selon la disponibilité. Une première réponse vous est apportée sous 24 heures dans tous les cas.",
            },
            {
              q: "Combien coûte un dépannage d'urgence en Eure-et-Loir ?",
              a: "Le tarif dépend du type d'intervention et de l'urgence. Comptez en moyenne un supplément de 30 à 50 % par rapport aux tarifs standards. Un dépannage plomberie urgent démarre autour de 100 à 150 € (déplacement + première heure), un dépannage chauffage entre 120 et 200 €.",
            },
            {
              q: "Les interventions d'urgence sont-elles garanties ?",
              a: "Oui, tous nos artisans partenaires sont assurés (responsabilité civile et décennale). L'intervention d'urgence fait l'objet d'une facture détaillée. Si des travaux complémentaires sont nécessaires, un devis séparé vous est présenté avant toute intervention supplémentaire.",
            },
          ].map((item) => (
            <div key={item.q}>
              <h3 className="mb-1.5 text-sm font-semibold">{item.q}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
