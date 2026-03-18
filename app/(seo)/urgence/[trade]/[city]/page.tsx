import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { AlertTriangle, Phone, Clock, Shield, MapPin, ArrowRight } from "lucide-react"
import {
  getAllUrgenceCombinations,
  getTrade,
  getCity,
  getNeighboringCities,
  getEmergencyTrades,
  interpolateTemplate,
  getRegionalCoefficient,
} from "@/lib/data"
import { PriceCalculator } from "@/components/PriceCalculator"
import { Breadcrumb } from "@/components/Breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

interface PageProps {
  params: Promise<{ trade: string; city: string }>
}

export async function generateStaticParams() {
  return getAllUrgenceCombinations()
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { trade: tradeSlug, city: citySlug } = await params
  const trade = getTrade(tradeSlug)
  const city = getCity(citySlug)

  if (!trade || !city || !trade.is_emergency) return { title: "Page introuvable" }

  const year = new Date().getFullYear()
  return {
    title: `${trade.title} urgence à ${city.name} (${city.zip}) — Dépannage ${year}`,
    description: `Besoin d'un dépannage ${trade.title.toLowerCase()} urgent à ${city.name} ? Artisans disponibles rapidement en Eure-et-Loir. Intervention rapide, devis gratuit, tarifs à partir de ${trade.min_price} €/${trade.unit}.`,
    alternates: { canonical: `/urgence/${trade.slug}/${city.slug}` },
  }
}

const urgencyProblems: Record<string, string[]> = {
  plomberie: [
    "Fuite d'eau importante ou dégât des eaux",
    "Canalisation bouchée ou débordement",
    "Chauffe-eau en panne (plus d'eau chaude)",
    "Robinet ou vanne qui ne ferme plus",
    "WC bouchés ou fuite de chasse d'eau",
  ],
  electricite: [
    "Coupure de courant partielle ou totale",
    "Court-circuit ou disjoncteur qui saute",
    "Prise ou interrupteur qui fait des étincelles",
    "Odeur de brûlé provenant d'une installation",
    "Tableau électrique endommagé",
  ],
  chauffage: [
    "Chaudière en panne en plein hiver",
    "Radiateurs qui ne chauffent plus",
    "Fuite sur le circuit de chauffage",
    "Pompe à chaleur en dysfonctionnement",
    "Bruit anormal dans la chaudière",
  ],
  toiture: [
    "Fuite de toiture suite à intempéries",
    "Tuiles ou ardoises arrachées par le vent",
    "Infiltration d'eau dans les combles",
    "Gouttière cassée ou débordante",
    "Dégâts de grêle sur la couverture",
  ],
  assainissement: [
    "Fosse septique pleine ou débordante",
    "Refoulement des eaux usées",
    "Canalisation d'assainissement bouchée",
    "Odeurs nauséabondes persistantes",
    "Regard d'assainissement obstrué",
  ],
}

export default async function UrgenceTradeCityPage({ params }: PageProps) {
  const { trade: tradeSlug, city: citySlug } = await params
  const trade = getTrade(tradeSlug)
  const city = getCity(citySlug)

  if (!trade || !city || !trade.is_emergency) notFound()

  const neighbors = getNeighboringCities(city)
  const emergencyTrades = getEmergencyTrades()
  const otherEmergency = emergencyTrades.filter((t) => t.slug !== trade.slug)
  const problems = urgencyProblems[trade.slug] ?? []
  const regionalCoeff = getRegionalCoefficient(city)
  const year = new Date().getFullYear()

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Accueil", href: "/" },
          { label: "Dépannage urgent", href: "/urgence" },
          { label: trade.title },
          { label: city.name },
        ]}
      />

      {/* Hero */}
      <section className="mb-10">
        <div className="mb-2 flex items-center gap-2">
          <Badge variant="destructive" className="gap-1">
            <AlertTriangle className="size-3" />
            Urgence
          </Badge>
          <span className="text-sm text-muted-foreground">
            {city.zip} · {city.name}
          </span>
        </div>
        <h1 className="mb-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          {trade.title} urgence à {city.name}
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
          Besoin d&apos;un dépannage {trade.title.toLowerCase()} urgent à {city.name} ({city.zip}) ?
          Obtenez l&apos;intervention rapide d&apos;un artisan qualifié en Eure-et-Loir.
          Devis gratuit, disponibilité immédiate.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <Link
            href={`/prix/${trade.slug}/${city.slug}`}
            className="font-medium text-primary transition-colors hover:text-primary/80"
          >
            Prix {trade.title} à {city.name}
          </Link>
          <span className="text-border">|</span>
          <Link
            href={`/ville/${city.slug}`}
            className="font-medium text-primary transition-colors hover:text-primary/80"
          >
            Tous les travaux à {city.name}
          </Link>
        </div>
      </section>

      {/* Key benefits */}
      <section className="mb-10">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: Clock, label: "Intervention rapide", desc: "Artisans disponibles sous 24-48h" },
            { icon: Phone, label: "Devis gratuit", desc: "Estimation sans engagement" },
            { icon: Shield, label: "Artisans certifiés", desc: "Assurance décennale garantie" },
          ].map(({ icon: Icon, label, desc }) => (
            <Card key={label}>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-red-50">
                  <Icon className="size-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-bold">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Calculator */}
      <section className="mb-10" id="estimation">
        <h2 className="sr-only">Estimation du dépannage</h2>
        <PriceCalculator
          tradeSlug={trade.slug}
          tradeTitle={trade.title}
          minPrice={trade.min_price}
          maxPrice={trade.max_price}
          unit={trade.unit}
          cityName={city.name}
          cityZip={city.zip}
          regionalCoefficient={regionalCoeff}
        />
      </section>

      <Separator />

      {/* Common problems */}
      {problems.length > 0 && (
        <section className="my-10">
          <h2 className="mb-5 font-heading text-xl font-bold">
            Problèmes courants — {trade.title} à {city.name}
          </h2>
          <div className="space-y-2">
            {problems.map((problem, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-lg border border-border/60 p-4"
              >
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-500" />
                <p className="text-sm text-muted-foreground">{problem}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <Separator />

      {/* What to do */}
      <section className="my-10">
        <h2 className="mb-4 font-heading text-xl font-bold">
          Que faire en cas d&apos;urgence {trade.title.toLowerCase()} ?
        </h2>
        <ol className="space-y-3">
          {[
            "Sécurisez les lieux : coupez l'arrivée d'eau, le disjoncteur ou le gaz selon la situation.",
            "Protégez vos biens : déplacez les meubles et objets de valeur à l'abri.",
            `Demandez un devis gratuit via notre formulaire ci-dessus pour une intervention à ${city.name}.`,
            "Vérifiez les certifications de l'artisan : assurance décennale et qualification RGE si applicable.",
            "Conservez les justificatifs : photos des dégâts, factures, pour votre assurance habitation.",
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {i + 1}
              </span>
              <span className="text-muted-foreground">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <Separator />

      {/* Other emergency trades */}
      {otherEmergency.length > 0 && (
        <section className="my-10">
          <h2 className="mb-4 font-heading text-xl font-bold">
            Autres dépannages à {city.name}
          </h2>
          <div className="flex flex-wrap gap-2">
            {otherEmergency.map((t) => (
              <Link
                key={t.slug}
                href={`/urgence/${t.slug}/${city.slug}`}
                className="group"
              >
                <Badge
                  variant="outline"
                  className="cursor-pointer px-3.5 py-1.5 text-sm transition-colors group-hover:bg-red-50 group-hover:text-red-700 group-hover:border-red-200"
                >
                  {t.title} urgence {city.name}
                </Badge>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Neighboring urgence */}
      {neighbors.length > 0 && (
        <section className="my-10">
          <h2 className="mb-4 font-heading text-xl font-bold">
            {trade.title} urgence — communes voisines
          </h2>
          <div className="flex flex-wrap gap-2">
            {neighbors.map((n) => (
              <Link
                key={n.slug}
                href={`/urgence/${trade.slug}/${n.slug}`}
                className="group"
              >
                <Badge
                  variant="outline"
                  className="cursor-pointer px-3 py-1.5 text-sm transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
                >
                  <MapPin className="mr-1 size-3" />
                  {n.name}
                </Badge>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
