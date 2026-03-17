import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  getAllTradesCityCombinations,
  getTrade,
  getCity,
  interpolateTemplate,
  getRegionalCoefficient,
} from "@/lib/data"
import { getTradeCityMeta } from "@/lib/metadata"
import { PriceCalculator } from "@/components/PriceCalculator"
import { NearbyInterventions } from "@/components/NearbyInterventions"
import { JsonLd } from "@/components/JsonLd"
import { Breadcrumb } from "@/components/Breadcrumb"
import { RecentActivity } from "@/components/RecentActivity"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface PageProps {
  params: Promise<{ trade: string; city: string }>
}

export async function generateStaticParams() {
  return getAllTradesCityCombinations()
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { trade: tradeSlug, city: citySlug } = await params
  const trade = getTrade(tradeSlug)
  const city = getCity(citySlug)

  if (!trade || !city) return { title: "Page introuvable" }

  const { title, description } = getTradeCityMeta(trade, city)

  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    alternates: { canonical: `/prix/${trade.slug}/${city.slug}` },
  }
}

export default async function TradeCityPage({ params }: PageProps) {
  const { trade: tradeSlug, city: citySlug } = await params
  const trade = getTrade(tradeSlug)
  const city = getCity(citySlug)

  if (!trade || !city) notFound()

  const currentYear = new Date().getFullYear()
  const regionalCoeff = getRegionalCoefficient(city)
  const description = interpolateTemplate(trade.description_template, trade, city)

  return (
    <>
      <JsonLd trade={trade} city={city} />

      <Breadcrumb
        items={[
          { label: "Accueil", href: "/" },
          { label: "Prix travaux", href: "/prix" },
          { label: trade.title, href: `/prix/${trade.slug}` },
          { label: city.name },
        ]}
      />

      {/* H1 — Hero */}
      <section className="mb-10">
        <h1 className="mb-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Prix {trade.title} à {city.name} ({city.zip})
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
          Estimez le coût de votre projet de {trade.title.toLowerCase()} à{" "}
          {city.name} en {currentYear}. Comparez les devis d'artisans qualifiés
          en Eure-et-Loir.
        </p>
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          <Link
            href={`/ville/${city.slug}`}
            className="font-medium text-primary transition-colors hover:text-primary/80"
          >
            Tous les travaux à {city.name}
          </Link>
          <span className="text-border">|</span>
          <Link
            href={`/prix/${trade.slug}`}
            className="font-medium text-primary transition-colors hover:text-primary/80"
          >
            Prix {trade.title} — toutes les communes
          </Link>
        </div>
      </section>

      {/* Social proof */}
      <div className="mb-8">
        <RecentActivity
          cityName={city.name}
          tradeTitle={trade.title}
          seed={`${trade.slug}-${city.slug}`}
        />
      </div>

      {/* H2 — Estimateur */}
      <section className="mb-10" id="estimation">
        <h2 className="sr-only">Estimateur de prix</h2>
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

      {/* H2 — Guide complet */}
      <section className="mb-10">
        <h2 className="mb-4 font-heading text-xl font-bold">
          Guide complet : {trade.title} à {city.name}
        </h2>
        <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>

        {/* H3 — Prix détaillés */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              <h3 className="text-base font-bold">
                Prix détaillés — {trade.title} dans le {city.department}
              </h3>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {trade.technical_details.map((detail, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-primary" />
                  <span className="text-muted-foreground">{detail}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* H3 — Contexte régional */}
        <div className="rounded-lg bg-muted/40 p-6">
          <h3 className="mb-2 text-sm font-bold">
            Contexte régional — {city.name}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {city.region_description}
          </p>
        </div>
      </section>

      <Separator />

      {/* H2 — FAQ */}
      <section className="my-10">
        <h2 className="mb-6 font-heading text-xl font-bold">
          Questions fréquentes — {trade.title} à {city.name}
        </h2>
        <div className="space-y-6">
          {trade.faq.map((item, i) => (
            <div key={i}>
              <h3 className="mb-1.5 text-sm font-bold">
                {interpolateTemplate(item.question, trade, city)}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {interpolateTemplate(item.answer, trade, city)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* H2 — Communes voisines */}
      <NearbyInterventions trade={trade} city={city} />
    </>
  )
}
