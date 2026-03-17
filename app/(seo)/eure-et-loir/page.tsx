import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, MapPin, Wrench } from "lucide-react"
import { trades, getCitiesSorted, getTopCities } from "@/lib/data"
import { tradeIcons } from "@/lib/trade-icons"
import { Breadcrumb } from "@/components/Breadcrumb"

export const metadata: Metadata = {
  title: "Prix Travaux en Eure-et-Loir (28) — Guide Complet",
  description:
    "Guide complet des prix de travaux en Eure-et-Loir (28). Toiture, isolation, plomberie, peinture dans les 33 communes principales. Devis gratuits d'artisans qualifiés.",
  alternates: { canonical: "/eure-et-loir" },
}

export default function DepartmentPage() {
  const allCities = getCitiesSorted()
  const topCities = getTopCities(12)
  const year = new Date().getFullYear()

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Accueil", href: "/" },
          { label: "Eure-et-Loir" },
        ]}
      />

      <section className="mb-10">
        <h1 className="mb-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Prix Travaux en Eure-et-Loir (28)
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
          Guide complet des tarifs de travaux dans le département de l'Eure-et-Loir
          en {year}. De Chartres à Nogent-le-Rotrou, de Dreux à Châteaudun :
          retrouvez les prix constatés pour chaque corps de métier et chaque commune.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold text-foreground">
          <span className="flex items-center gap-1.5">
            <Wrench className="size-4 text-primary" />
            {trades.length} corps de métier
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="size-4 text-primary" />
            {allCities.length} communes couvertes
          </span>
        </div>
      </section>

      {/* Trades grid */}
      <section className="mb-12">
        <h2 className="mb-5 font-heading text-xl font-bold">
          Corps de métier
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {trades.map((trade) => {
            const Icon = tradeIcons[trade.slug] ?? Wrench
            return (
              <Link
                key={trade.slug}
                href={`/prix/${trade.slug}`}
                className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="size-4.5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">{trade.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {trade.min_price}–{trade.max_price} € / {trade.unit}
                  </span>
                </div>
                <ArrowRight className="size-3.5 text-muted-foreground/40 group-hover:text-primary" />
              </Link>
            )
          })}
        </div>
      </section>

      {/* Top cities */}
      <section className="mb-12">
        <h2 className="mb-5 font-heading text-xl font-bold">
          Principales communes
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {topCities.map((city) => (
            <Link
              key={city.slug}
              href={`/ville/${city.slug}`}
              className="group flex items-center gap-3 rounded-lg border border-border/60 bg-card px-4 py-3.5 transition-all hover:border-primary/30 hover:shadow-sm"
            >
              <MapPin className="size-4 shrink-0 text-primary/60 group-hover:text-primary" />
              <div className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">
                  {city.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {city.zip} · {city.population.toLocaleString("fr-FR")} hab.
                </span>
              </div>
              <ArrowRight className="size-3.5 text-muted-foreground/40 group-hover:text-primary" />
            </Link>
          ))}
        </div>
      </section>

      {/* All cities */}
      <section className="mb-10">
        <h2 className="mb-5 font-heading text-xl font-bold">
          Toutes les communes
        </h2>
        <div className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2 lg:grid-cols-3">
          {allCities.map((city) => (
            <Link
              key={city.slug}
              href={`/ville/${city.slug}`}
              className="py-1 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              {city.name}{" "}
              <span className="text-xs">({city.zip})</span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-heading text-xl font-bold">
          L'Eure-et-Loir : un patrimoine bâti à entretenir
        </h2>
        <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Le département de l'Eure-et-Loir (28) s'étend sur quatre bassins
            de vie distincts : l'agglomération chartraine au cœur de la Beauce,
            le Drouais au nord-ouest, le Dunois autour de Châteaudun et le
            Perche au sud-ouest. Chaque secteur présente des spécificités
            architecturales qui influencent les coûts de rénovation.
          </p>
          <p>
            Les maisons beauceronnes, souvent construites en pierre calcaire
            avec de vastes toitures en tuiles plates, requièrent un entretien
            régulier des couvertures et des façades. Dans le Perche, les
            longères en pierre et colombages nécessitent des artisans maîtrisant
            les techniques traditionnelles de restauration. Autour de Dreux,
            le parc immobilier plus récent appelle des interventions
            d'isolation et de mise aux normes électriques.
          </p>
          <p>
            Les aides financières disponibles en Eure-et-Loir — MaPrimeRénov',
            éco-PTZ, aides régionales Centre-Val de Loire — permettent de
            réduire significativement le reste à charge pour les travaux de
            rénovation énergétique.
          </p>
        </div>
      </section>
    </>
  )
}
