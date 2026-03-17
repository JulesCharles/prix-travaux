import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, MapPin } from "lucide-react"
import { trades, getTrade, getCitiesSorted } from "@/lib/data"
import { tradeIcons } from "@/lib/trade-icons"
import { Breadcrumb } from "@/components/Breadcrumb"

interface PageProps {
  params: Promise<{ trade: string }>
}

export async function generateStaticParams() {
  return trades.map((t) => ({ trade: t.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { trade: tradeSlug } = await params
  const trade = getTrade(tradeSlug)
  if (!trade) return { title: "Page introuvable" }

  const year = new Date().getFullYear()
  return {
    title: `Prix ${trade.title} en Eure-et-Loir (28) — Tarifs ${year}`,
    description: `Comparez les prix de ${trade.title.toLowerCase()} dans toutes les communes d'Eure-et-Loir. De ${trade.min_price} € à ${trade.max_price} €/${trade.unit}. Devis gratuits d'artisans qualifiés.`,
    alternates: { canonical: `/prix/${trade.slug}` },
  }
}

export default async function TradeHubPage({ params }: PageProps) {
  const { trade: tradeSlug } = await params
  const trade = getTrade(tradeSlug)
  if (!trade) notFound()

  const sortedCities = getCitiesSorted()
  const Icon = tradeIcons[trade.slug] ?? ArrowRight
  const year = new Date().getFullYear()
  const avgPrice = Math.round((trade.min_price + trade.max_price) / 2)

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Accueil", href: "/" },
          { label: "Prix travaux", href: "/prix" },
          { label: trade.title },
        ]}
      />

      <section className="mb-10">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
            <Icon className="size-6 text-primary" />
          </div>
          <div>
            <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Prix {trade.title} en Eure-et-Loir (28)
            </h1>
            <p className="text-sm text-muted-foreground">
              Tarifs {year} — De {trade.min_price} € à {trade.max_price} € / {trade.unit}
            </p>
          </div>
        </div>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
          Retrouvez les prix de {trade.title.toLowerCase()} dans chaque commune
          d'Eure-et-Loir. Le tarif moyen constaté est de{" "}
          <strong className="text-foreground">{avgPrice} € / {trade.unit}</strong>.
          Sélectionnez votre commune pour obtenir une estimation personnalisée et
          recevoir des devis gratuits.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-5 font-heading text-xl font-bold">
          Prix {trade.title} par commune
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sortedCities.map((city) => (
            <Link
              key={city.slug}
              href={`/prix/${trade.slug}/${city.slug}`}
              className="group flex items-center gap-3 rounded-lg border border-border/60 bg-card px-4 py-3.5 transition-all hover:border-primary/30 hover:shadow-sm"
            >
              <MapPin className="size-4 shrink-0 text-primary/60 transition-colors group-hover:text-primary" />
              <div className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-foreground">
                  {trade.title} {city.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {city.zip} · {city.population.toLocaleString("fr-FR")} hab.
                </span>
              </div>
              <span className="shrink-0 text-xs font-semibold text-primary">
                {trade.min_price}–{trade.max_price} €
              </span>
              <ArrowRight className="size-3.5 shrink-0 text-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 font-heading text-xl font-bold">
          Détail des tarifs — {trade.title}
        </h2>
        <ul className="space-y-2">
          {trade.technical_details.map((detail, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-primary" />
              <span className="text-muted-foreground">{detail}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-4 font-heading text-xl font-bold">
          Questions fréquentes — {trade.title} en Eure-et-Loir
        </h2>
        <div className="space-y-5">
          {trade.faq.map((item, i) => (
            <div key={i}>
              <h3 className="mb-1.5 text-sm font-semibold">
                {item.question.replace(/{city}/g, "Eure-et-Loir")}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.answer
                  .replace(/{city}/g, "Eure-et-Loir")
                  .replace(/{min_price}/g, String(trade.min_price))
                  .replace(/{max_price}/g, String(trade.max_price))
                  .replace(/{unit}/g, trade.unit)}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
