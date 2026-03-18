import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ExternalLink, ArrowRight } from "lucide-react"
import {
  getAllTradesCityCombinations,
  getTrade,
  getCity,
  interpolateTemplate,
  getRegionalCoefficient,
  getTierContent,
  getZoneContent,
  getExtendedFaq,
  getRelatedTrades,
} from "@/lib/data"
import { tradeIcons } from "@/lib/trade-icons"
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
  const timeline = interpolateTemplate(trade.timeline_template, trade, city)
  const tierContent = getTierContent(trade, city)
  const zoneContent = getZoneContent(trade, city)
  const financingGuide = interpolateTemplate(trade.financing_guide, trade, city)
  const seasonalAdvice = interpolateTemplate(trade.seasonal_advice, trade, city)
  const extendedFaq = getExtendedFaq(trade, city)
  const relatedTrades = getRelatedTrades(trade)

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
          {city.name} en {currentYear}. Comparez les devis d&apos;artisans qualifiés
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

      {/* H2 — Déroulement des travaux */}
      <section className="my-10">
        <h2 className="mb-4 font-heading text-xl font-bold">
          Déroulement des travaux de {trade.title.toLowerCase()} à {city.name}
        </h2>
        <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
          {timeline}
        </p>
        <ol className="space-y-3">
          {trade.process_steps.map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {i + 1}
              </span>
              <span className="text-muted-foreground">{interpolateTemplate(step, trade, city)}</span>
            </li>
          ))}
        </ol>
      </section>

      <Separator />

      {/* H2 — Comparatif des matériaux */}
      <section className="my-10">
        <h2 className="mb-4 font-heading text-xl font-bold">
          Comparatif des matériaux — {trade.title} à {city.name}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left">
                <th className="pb-3 pr-4 font-bold">Matériau</th>
                <th className="pb-3 pr-4 font-bold">Prix</th>
                <th className="hidden pb-3 pr-4 font-bold sm:table-cell">Avantages</th>
                <th className="hidden pb-3 pr-4 font-bold sm:table-cell">Inconvénients</th>
                <th className="hidden pb-3 font-bold md:table-cell">Idéal pour</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {trade.materials_comparison.map((mat, i) => (
                <tr key={i}>
                  <td className="py-3 pr-4 font-medium">{mat.name}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{mat.price_range}</td>
                  <td className="hidden py-3 pr-4 text-muted-foreground sm:table-cell">{mat.pros}</td>
                  <td className="hidden py-3 pr-4 text-muted-foreground sm:table-cell">{mat.cons}</td>
                  <td className="hidden py-3 text-muted-foreground md:table-cell">{mat.best_for}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile detail cards */}
        <div className="mt-4 space-y-3 sm:hidden">
          {trade.materials_comparison.map((mat, i) => (
            <div key={i} className="rounded-lg border border-border/60 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium">{mat.name}</span>
                <span className="text-xs text-muted-foreground">{mat.price_range}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                <strong className="text-foreground">+</strong> {mat.pros}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                <strong className="text-foreground">−</strong> {mat.cons}
              </p>
              <p className="mt-1 text-xs text-primary">
                Idéal : {mat.best_for}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* H2 — Spécificités locales */}
      <section className="my-10">
        <h2 className="mb-4 font-heading text-xl font-bold">
          {trade.title} à {city.name} : spécificités locales
        </h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-border/60 p-5">
            <h3 className="mb-2 text-sm font-bold">
              Caractéristiques de {city.name} ({city.population.toLocaleString("fr-FR")} habitants)
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {tierContent}
            </p>
          </div>
          <div className="rounded-lg border border-border/60 p-5">
            <h3 className="mb-2 text-sm font-bold">
              Particularités architecturales et climatiques
            </h3>
            <p className="mb-2 text-sm leading-relaxed text-muted-foreground">
              {zoneContent}
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              <strong className="text-foreground">Style architectural :</strong>{" "}
              {city.architectural_style}.{" "}
              <strong className="text-foreground">Climat :</strong>{" "}
              {city.climate_note}.
            </p>
          </div>
          {city.local_highlight && (
            <div className="rounded-lg bg-primary/5 p-5">
              <p className="text-sm leading-relaxed text-muted-foreground">
                <strong className="text-foreground">Le saviez-vous ?</strong>{" "}
                {city.local_highlight}
              </p>
            </div>
          )}
        </div>
      </section>

      <Separator />

      {/* H2 — Aides et financement */}
      <section className="my-10">
        <h2 className="mb-4 font-heading text-xl font-bold">
          Aides et financement — {trade.title} à {city.name}
        </h2>
        <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
          {financingGuide}
        </p>

        {/* H3 — Meilleure période */}
        <div className="mb-6 rounded-lg bg-muted/40 p-5">
          <h3 className="mb-2 text-sm font-bold">
            Meilleure période pour vos travaux
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {seasonalAdvice}
          </p>
        </div>

        {/* Liens officiels */}
        {trade.official_links.length > 0 && (
          <div className="rounded-lg border border-border/60 p-5">
            <h3 className="mb-3 text-sm font-bold">Liens utiles</h3>
            <ul className="space-y-2">
              {trade.official_links.map((link, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <ExternalLink className="mt-0.5 size-3.5 shrink-0 text-primary" />
                  <div>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-primary transition-colors hover:text-primary/80"
                    >
                      {link.label}
                    </a>
                    <span className="ml-1 text-muted-foreground">
                      — {link.description}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <Separator />

      {/* H2 — FAQ (base + extended) */}
      <section className="my-10">
        <h2 className="mb-6 font-heading text-xl font-bold">
          Questions fréquentes — {trade.title} à {city.name}
        </h2>
        <div className="space-y-6">
          {trade.faq.map((item, i) => (
            <div key={`base-${i}`}>
              <h3 className="mb-1.5 text-sm font-bold">
                {interpolateTemplate(item.question, trade, city)}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {interpolateTemplate(item.answer, trade, city)}
              </p>
            </div>
          ))}
          {extendedFaq.map((item, i) => (
            <div key={`ext-${i}`}>
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

      {/* H2 — Services complémentaires (cross-trade links) */}
      {relatedTrades.length > 0 && (
        <>
          <section className="my-10">
            <h2 className="mb-4 font-heading text-xl font-bold">
              Services complémentaires à {city.name}
            </h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Ces corps de métier interviennent souvent en complément de la {trade.title.toLowerCase()}.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {relatedTrades.map((rt) => {
                const Icon = tradeIcons[rt.slug] ?? ArrowRight
                return (
                  <Link
                    key={rt.slug}
                    href={`/prix/${rt.slug}/${city.slug}`}
                    className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card p-3.5 transition-all hover:border-primary/30 hover:shadow-sm"
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="size-4 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold">
                        {rt.title} à {city.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {rt.min_price}–{rt.max_price} €/{rt.unit}
                      </span>
                    </div>
                    <ArrowRight className="size-3.5 text-muted-foreground/40 group-hover:text-primary" />
                  </Link>
                )
              })}
            </div>
          </section>
          <Separator />
        </>
      )}

      {/* H2 — Communes voisines */}
      <NearbyInterventions trade={trade} city={city} />
    </>
  )
}
