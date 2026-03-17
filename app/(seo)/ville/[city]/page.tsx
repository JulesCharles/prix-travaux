import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, MapPin } from "lucide-react"
import { trades, cities, getCity, getNeighboringCities } from "@/lib/data"
import { tradeIcons } from "@/lib/trade-icons"
import { Breadcrumb } from "@/components/Breadcrumb"

interface PageProps {
  params: Promise<{ city: string }>
}

export async function generateStaticParams() {
  return cities.map((c) => ({ city: c.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city: citySlug } = await params
  const city = getCity(citySlug)
  if (!city) return { title: "Page introuvable" }

  const year = new Date().getFullYear()
  return {
    title: `Prix Travaux à ${city.name} (${city.zip}) — Tarifs ${year}`,
    description: `Découvrez les prix de tous les travaux à ${city.name} (${city.zip}) en ${year} : toiture, isolation, plomberie, peinture. Devis gratuits d'artisans qualifiés.`,
    alternates: { canonical: `/ville/${city.slug}` },
  }
}

export default async function CityHubPage({ params }: PageProps) {
  const { city: citySlug } = await params
  const city = getCity(citySlug)
  if (!city) notFound()

  const neighbors = getNeighboringCities(city)
  const year = new Date().getFullYear()

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Accueil", href: "/" },
          { label: "Eure-et-Loir", href: "/eure-et-loir" },
          { label: city.name },
        ]}
      />

      <section className="mb-10">
        <div className="mb-1 flex items-center gap-2 text-sm font-medium text-primary">
          <MapPin className="size-4" />
          {city.zip} · {city.population.toLocaleString("fr-FR")} habitants
        </div>
        <h1 className="mb-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Prix Travaux à {city.name}
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
          Comparez les tarifs des artisans à {city.name} ({city.zip}) en {year}.
          Sélectionnez un corps de métier pour obtenir une estimation détaillée
          et recevoir jusqu'à 3 devis gratuits.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-5 font-heading text-xl font-bold">
          Tous les métiers à {city.name}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {trades.map((trade) => {
            const Icon = tradeIcons[trade.slug] ?? ArrowRight
            return (
              <Link
                key={trade.slug}
                href={`/prix/${trade.slug}/${city.slug}`}
                className="group flex items-center gap-4 rounded-xl border border-border/60 bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="size-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-foreground">
                    {trade.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {trade.min_price} – {trade.max_price} € / {trade.unit}
                  </span>
                </div>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            )
          })}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 font-heading text-xl font-bold">
          À propos de {city.name}
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {city.region_description}
        </p>
      </section>

      {neighbors.length > 0 && (
        <section>
          <h2 className="mb-4 font-heading text-xl font-bold">
            Communes voisines de {city.name}
          </h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {neighbors.map((neighbor) => (
              <Link
                key={neighbor.slug}
                href={`/ville/${neighbor.slug}`}
                className="group flex items-center gap-2 rounded-lg border border-border/60 bg-card px-4 py-3 text-sm transition-all hover:border-primary/30 hover:shadow-sm"
              >
                <MapPin className="size-3.5 text-primary/60 group-hover:text-primary" />
                <span className="font-medium">{neighbor.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({neighbor.zip})
                </span>
                <ArrowRight className="ml-auto size-3 text-muted-foreground/40 group-hover:text-primary" />
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
