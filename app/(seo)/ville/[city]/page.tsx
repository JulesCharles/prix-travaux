import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, MapPin, Home, TrendingUp, Landmark, Thermometer } from "lucide-react"
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
    description: `Découvrez les prix de tous les travaux à ${city.name} (${city.zip}) en ${year} : toiture, isolation, plomberie, peinture. Devis gratuits d'artisans qualifiés. Guide complet avec spécificités locales.`,
    alternates: { canonical: `/ville/${city.slug}` },
  }
}

const zoneLabels: Record<string, string> = {
  perche: "Perche",
  beauce: "Beauce",
  drouais: "Drouais",
  dunois: "Dunois",
}

const zoneDescriptions: Record<string, string> = {
  perche:
    "Le Perche se distingue par un patrimoine bâti remarquable : longères en pierre, manoirs, maisons à colombages. La rénovation y est souvent plus coûteuse en raison de la complexité des techniques traditionnelles, mais les résultats sont valorisants pour le patrimoine. Le climat, plus humide et frais que la Beauce, impose une attention particulière à l'isolation et à la ventilation.",
  beauce:
    "La Beauce, grande plaine céréalière, abrite principalement des constructions plus récentes : pavillons, corps de ferme modernisés, lotissements. Les travaux de rénovation y suivent des techniques standardisées et des tarifs généralement plus accessibles. L'exposition au vent nécessite cependant une couverture robuste et une isolation performante.",
  drouais:
    "Le Drouais bénéficie de la proximité de l'Île-de-France, ce qui se traduit par un marché immobilier dynamique et une offre d'artisans plus dense. La concurrence favorise des tarifs compétitifs, mais la demande soutenue peut allonger les délais. Le bâti mêle constructions anciennes du centre-ville et pavillons périurbains.",
  dunois:
    "Le Dunois, autour de Châteaudun, présente un marché plus rural avec un patrimoine bâti ancien (pierre de Beauce, tuffeau). Les artisans y sont moins nombreux, ce qui peut entraîner des délais plus longs et des frais de déplacement plus élevés. En contrepartie, les prix de l'immobilier restent très accessibles.",
}

const tierLabels: Record<string, string> = {
  urban: "Zone urbaine",
  periurban: "Zone périurbaine",
  bourg: "Bourg",
  rural: "Zone rurale",
}

const tierDescriptions: Record<string, string> = {
  urban:
    "En zone urbaine, la densité d'artisans disponibles est élevée, ce qui favorise la concurrence et des tarifs compétitifs. Les délais d'intervention sont généralement courts. Attention cependant aux contraintes d'accès (stationnement, échafaudage en centre-ville) qui peuvent engendrer des surcoûts.",
  periurban:
    "En zone périurbaine, vous bénéficiez d'un bon compromis entre disponibilité des artisans et conditions d'intervention favorables (accès facile, espace de stockage). Les tarifs sont proches des moyennes départementales.",
  bourg:
    "Dans les bourgs, le choix d'artisans est correct mais plus limité qu'en zone urbaine. Prévoyez un léger surcoût de déplacement (environ 5 %) et des délais d'intervention légèrement plus longs. L'avantage : les chantiers sont souvent plus simples d'accès.",
  rural:
    "En zone rurale, les frais de déplacement représentent un poste plus important (surcoût de 8 à 12 %). Nous recommandons de regrouper plusieurs travaux pour optimiser les déplacements de l'artisan. Les délais peuvent être plus longs, anticipez votre projet.",
}

export default async function CityHubPage({ params }: PageProps) {
  const { city: citySlug } = await params
  const city = getCity(citySlug)
  if (!city) notFound()

  const neighbors = getNeighboringCities(city)
  const year = new Date().getFullYear()
  const avgTradePrice = Math.round(
    trades.reduce((sum, t) => sum + (t.min_price + t.max_price) / 2, 0) / trades.length
  )

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
          <MapPin className="size-4" aria-hidden="true" />
          {city.zip} · {city.population.toLocaleString("fr-FR")} habitants
        </div>
        <h1 className="mb-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Prix Travaux à {city.name}
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
          Comparez les tarifs des artisans à {city.name} ({city.zip}) en {year}.
          Sélectionnez un corps de métier pour obtenir une estimation détaillée
          et recevoir jusqu&apos;à 3 devis gratuits.
        </p>
      </section>

      {/* ── Présentation de la commune ── */}
      <section className="mb-10">
        <h2 className="mb-4 font-heading text-xl font-bold">
          {city.name} : contexte local
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: MapPin,
              label: "Zone",
              value: `${zoneLabels[city.geographic_zone] ?? city.geographic_zone}`,
            },
            {
              icon: Home,
              label: "Typologie",
              value: tierLabels[city.population_tier] ?? city.population_tier,
            },
            {
              icon: Landmark,
              label: "Architecture",
              value: city.architectural_style,
            },
            {
              icon: Thermometer,
              label: "Climat",
              value: city.climate_note,
            },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-border/60 bg-card p-4">
              <item.icon className="mb-2 size-4 text-primary" aria-hidden="true" />
              <p className="text-xs font-semibold text-muted-foreground">{item.label}</p>
              <p className="text-sm font-bold">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Zone géographique ── */}
      <section className="mb-10">
        <h2 className="mb-3 font-heading text-xl font-bold">
          Le {zoneLabels[city.geographic_zone] ?? city.geographic_zone} : spécificités régionales
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {zoneDescriptions[city.geographic_zone] ?? city.region_description}
        </p>
      </section>

      {/* ── Marché local ── */}
      <section className="mb-10">
        <h2 className="mb-3 font-heading text-xl font-bold">
          Marché des travaux à {city.name}
        </h2>
        <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            {city.region_description}
          </p>
          <p>
            {tierDescriptions[city.population_tier] ?? ""}
          </p>
          <p>
            {city.local_highlight && (
              <>
                <strong className="text-foreground">À noter :</strong> {city.local_highlight}
              </>
            )}
          </p>
        </div>
      </section>

      {/* ── Trades grid ── */}
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
                  <Icon className="size-5 text-primary" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-foreground">
                    {trade.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {trade.min_price} – {trade.max_price} € / {trade.unit}
                  </span>
                </div>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden="true" />
              </Link>
            )
          })}
        </div>
      </section>

      {/* ── Liens utiles ── */}
      <section className="mb-10">
        <h2 className="mb-4 font-heading text-xl font-bold">
          Ressources pour {city.name}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href={`/guide/${city.slug}`}
            className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md"
          >
            <TrendingUp className="size-5 text-primary" aria-hidden="true" />
            <div>
              <span className="block text-sm font-semibold">Guide rénovation {city.name}</span>
              <span className="text-xs text-muted-foreground">Budget, architecture, conseils</span>
            </div>
            <ArrowRight className="ml-auto size-4 text-muted-foreground/40 group-hover:text-primary" aria-hidden="true" />
          </Link>
          <Link
            href={`/aides/${city.slug}`}
            className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md"
          >
            <TrendingUp className="size-5 text-primary" aria-hidden="true" />
            <div>
              <span className="block text-sm font-semibold">Aides financières à {city.name}</span>
              <span className="text-xs text-muted-foreground">MaPrimeRénov&apos;, éco-PTZ, CEE</span>
            </div>
            <ArrowRight className="ml-auto size-4 text-muted-foreground/40 group-hover:text-primary" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="mb-10">
        <h2 className="mb-5 font-heading text-xl font-bold">
          Questions fréquentes — Travaux à {city.name}
        </h2>
        <div className="space-y-5">
          {[
            {
              q: `Quel est le prix moyen des travaux à ${city.name} ?`,
              a: `Le tarif moyen des travaux à ${city.name} est d'environ ${avgTradePrice} € par unité, toutes catégories confondues. Les prix varient selon le corps de métier : la toiture et l'isolation sont les postes les plus coûteux, tandis que la peinture et le carrelage restent plus accessibles. Consultez chaque fiche métier pour un tarif précis.`,
            },
            {
              q: `Comment trouver un bon artisan à ${city.name} ?`,
              a: `Nous recommandons de comparer au moins 3 devis avant de vous engager. Vérifiez que l'artisan possède une assurance décennale valide et, pour les travaux d'efficacité énergétique, une certification RGE. À ${city.name} (${zoneLabels[city.geographic_zone]}), le choix d'artisans qualifiés est ${city.population_tier === "urban" || city.population_tier === "periurban" ? "large" : "plus limité, pensez à anticiper"}.`,
            },
            {
              q: `Quelles aides sont disponibles pour rénover à ${city.name} ?`,
              a: `Les propriétaires de ${city.name} peuvent bénéficier de MaPrimeRénov', de l'éco-PTZ, des CEE et de la TVA réduite à 5,5 %. Le montant total des aides peut couvrir jusqu'à 90 % du coût des travaux de rénovation énergétique. Consultez notre page dédiée aux aides à ${city.name} pour le détail.`,
            },
          ].map((item) => (
            <div key={item.q}>
              <h3 className="mb-1.5 text-sm font-semibold">{item.q}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Neighbors ── */}
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
                <MapPin className="size-3.5 text-primary/60 group-hover:text-primary" aria-hidden="true" />
                <span className="font-medium">{neighbor.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({neighbor.zip})
                </span>
                <ArrowRight className="ml-auto size-3 text-muted-foreground/40 group-hover:text-primary" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
