import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, MapPin, Home, Euro, Calendar, Shield } from "lucide-react"
import { cities, trades, getCity, getNeighboringCities } from "@/lib/data"
import { tradeIcons } from "@/lib/trade-icons"
import { Breadcrumb } from "@/components/Breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

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
    title: `Budget rénovation à ${city.name} (${city.zip}) — Coûts & conseils ${year}`,
    description: `Quel budget prévoir pour rénover à ${city.name} en ${year} ? Fourchettes de prix au m², spécificités ${city.architectural_style}, aides cumulables et artisans qualifiés dans votre commune.`,
    alternates: { canonical: `/guide/${city.slug}` },
  }
}

const tierBudgets: Record<string, { light: string; medium: string; heavy: string }> = {
  urban: { light: "300–600 €/m²", medium: "600–1 200 €/m²", heavy: "1 200–2 500 €/m²" },
  periurban: { light: "280–550 €/m²", medium: "550–1 100 €/m²", heavy: "1 100–2 200 €/m²" },
  bourg: { light: "320–620 €/m²", medium: "620–1 250 €/m²", heavy: "1 250–2 600 €/m²" },
  rural: { light: "350–680 €/m²", medium: "680–1 400 €/m²", heavy: "1 400–2 800 €/m²" },
}

const zoneArchitectureGuides: Record<string, string> = {
  perche:
    "Les maisons du Perche, construites en pierre de roussard et à colombages, nécessitent des matériaux respirants et des techniques adaptées au bâti ancien. Évitez le ciment et le polystyrène au profit de la chaux et de la fibre de bois. Les couvertures en ardoise naturelle ou tuile plate de pays sont privilégiées pour respecter le patrimoine local. En zone protégée, l'avis de l'Architecte des Bâtiments de France est obligatoire.",
  beauce:
    "Les constructions beauceronnes, marquées par l'architecture de plaine et les fermes céréalières, présentent de grandes surfaces à rénover. Les toitures en tuile plate résistent bien aux vents dominants. L'isolation par l'extérieur est particulièrement efficace sur les façades exposées aux vents d'ouest. Les extensions en parpaing ou ossature bois s'intègrent facilement au bâti existant.",
  drouais:
    "Le Drouais combine influences normandes et franciliennes dans son architecture. On y trouve aussi bien de l'ardoise que de la tuile, selon l'époque de construction. La proximité de l'Île-de-France tire les prix légèrement vers le haut mais offre un choix plus large d'artisans qualifiés. Les maisons de ville nécessitent souvent une attention particulière à l'isolation phonique.",
  dunois:
    "Le Dunois se caractérise par un patrimoine rural riche avec d'anciennes granges et dépendances à reconvertir. Les surfaces importantes de ces bâtiments offrent un fort potentiel mais nécessitent un budget conséquent. La tuile mécanique grand moule est le matériau de couverture le plus courant. Les étés chauds et secs imposent une bonne ventilation naturelle.",
}

export default async function GuideCityPage({ params }: PageProps) {
  const { city: citySlug } = await params
  const city = getCity(citySlug)
  if (!city) notFound()

  const neighbors = getNeighboringCities(city)
  const year = new Date().getFullYear()
  const budgets = tierBudgets[city.population_tier] ?? tierBudgets.periurban
  const archGuide = zoneArchitectureGuides[city.geographic_zone] ?? ""

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Accueil", href: "/" },
          { label: "Guides rénovation", href: "/guide" },
          { label: city.name },
        ]}
      />

      <section className="mb-10">
        <div className="mb-1 flex items-center gap-2 text-sm font-medium text-primary">
          <MapPin className="size-4" />
          {city.zip} · {city.population.toLocaleString("fr-FR")} habitants
        </div>
        <h1 className="mb-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Budget & conseils rénovation à {city.name}
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
          Quel budget prévoir pour rénover votre maison à {city.name} ({city.zip})
          en {year} ? Fourchettes de coûts au m², spécificités architecturales locales,
          aides cumulables et artisans qualifiés dans votre commune.
        </p>
      </section>

      {/* Budget overview */}
      <section className="mb-10">
        <h2 className="mb-5 font-heading text-xl font-bold">
          <Euro className="mb-0.5 inline size-5" /> Budget rénovation à {city.name}
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Rénovation légère", desc: "Peinture, sols, rafraîchissement", price: budgets.light },
            { label: "Rénovation moyenne", desc: "Isolation, électricité, plomberie", price: budgets.medium },
            { label: "Rénovation lourde", desc: "Structure, toiture, extension", price: budgets.heavy },
          ].map((item) => (
            <Card key={item.label}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold">{item.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-bold text-primary">{item.price}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Ces fourchettes sont indicatives et basées sur les tarifs constatés en{" "}
          {city.population_tier === "rural" || city.population_tier === "bourg"
            ? "zone rurale"
            : "zone urbaine"}{" "}
          du département 28. Le coût réel dépend de l&apos;état du bien, de la surface et
          des matériaux choisis. Demandez plusieurs devis pour affiner votre budget.
        </p>
      </section>

      <Separator />

      {/* Architecture */}
      <section className="my-10">
        <h2 className="mb-4 font-heading text-xl font-bold">
          <Home className="mb-0.5 inline size-5" /> Spécificités architecturales
        </h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-border/60 p-5">
            <h3 className="mb-2 text-sm font-bold">
              Architecture locale à {city.name}
            </h3>
            <p className="mb-2 text-sm leading-relaxed text-muted-foreground">
              <strong className="text-foreground">Style :</strong> {city.architectural_style}.{" "}
              <strong className="text-foreground">Climat :</strong> {city.climate_note}.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {city.region_description}
            </p>
          </div>
          {archGuide && (
            <div className="rounded-lg bg-muted/40 p-5">
              <h3 className="mb-2 text-sm font-bold">
                Conseils de rénovation pour la zone {city.geographic_zone}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {archGuide}
              </p>
            </div>
          )}
        </div>
      </section>

      <Separator />

      {/* All trades */}
      <section className="my-10">
        <h2 className="mb-5 font-heading text-xl font-bold">
          <Calendar className="mb-0.5 inline size-5" /> Tous les corps de métier
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Consultez les tarifs détaillés pour chaque type de travaux à {city.name}.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {trades.map((trade) => {
            const Icon = tradeIcons[trade.slug] ?? ArrowRight
            return (
              <Link
                key={trade.slug}
                href={`/prix/${trade.slug}/${city.slug}`}
                className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card p-3.5 transition-all hover:border-primary/30 hover:shadow-sm"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="size-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">{trade.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {trade.min_price}–{trade.max_price} €/{trade.unit}
                  </span>
                </div>
                <ArrowRight className="size-3.5 text-muted-foreground/40 group-hover:text-primary" />
              </Link>
            )
          })}
        </div>
      </section>

      <Separator />

      {/* Aides */}
      <section className="my-10">
        <h2 className="mb-4 font-heading text-xl font-bold">
          <Shield className="mb-0.5 inline size-5" /> Aides financières à {city.name}
        </h2>
        <div className="space-y-3">
          {[
            { name: "MaPrimeRénov'", desc: "Aide nationale pour la rénovation énergétique. Montant selon revenus du ménage et type de travaux." },
            { name: "Éco-PTZ", desc: "Prêt à taux zéro jusqu'à 50 000 € pour un bouquet de travaux de rénovation énergétique." },
            { name: "CEE (Primes énergie)", desc: "Certificats d'économie d'énergie versés par les fournisseurs d'énergie pour l'isolation et le chauffage." },
            { name: "ANAH", desc: "Aides de l'Agence Nationale de l'Habitat pour les propriétaires modestes et très modestes." },
            { name: "Aides région Centre-Val de Loire", desc: "Compléments régionaux pour la rénovation énergétique et la réhabilitation du patrimoine." },
          ].map((aide) => (
            <div key={aide.name} className="rounded-lg border border-border/60 p-4">
              <p className="text-sm font-bold text-foreground">{aide.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{aide.desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          <Link href={`/aides/${city.slug}`} className="font-semibold text-primary hover:text-primary/80">
            Voir toutes les aides disponibles à {city.name} →
          </Link>
        </p>
      </section>

      {/* Neighboring guides */}
      {neighbors.length > 0 && (
        <>
          <Separator />
          <section className="my-10">
            <h2 className="mb-4 font-heading text-xl font-bold">
              Guides rénovation communes voisines
            </h2>
            <div className="flex flex-wrap gap-2">
              {neighbors.map((n) => (
                <Link
                  key={n.slug}
                  href={`/guide/${n.slug}`}
                  className="group inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-card px-3 py-2 text-sm transition-all hover:border-primary/30"
                >
                  <MapPin className="size-3 text-primary/60 group-hover:text-primary" />
                  {n.name}
                </Link>
              ))}
            </div>
          </section>
        </>
      )}
    </>
  )
}
