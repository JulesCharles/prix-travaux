import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MapPin, ArrowRight, ExternalLink, Banknote, CheckCircle } from "lucide-react"
import { cities, trades, getCity, getNeighboringCities } from "@/lib/data"
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
    title: `Aides travaux à ${city.name} (${city.zip}) — Subventions ${year}`,
    description: `Toutes les aides financières pour vos travaux à ${city.name} en ${year} : MaPrimeRénov', éco-PTZ, CEE, ANAH, aides région Centre-Val de Loire. Montants, conditions et démarches.`,
    alternates: { canonical: `/aides/${city.slug}` },
  }
}

interface AideInfo {
  name: string
  amount: string
  eligibility: string
  works: string
  url: string
}

const nationalAides: AideInfo[] = [
  {
    name: "MaPrimeRénov'",
    amount: "De 300 € à 25 000 € selon revenus et travaux",
    eligibility: "Propriétaires occupants et bailleurs, logement de plus de 15 ans",
    works: "Isolation, chauffage, ventilation, audit énergétique, rénovation globale",
    url: "https://www.maprimerenov.gouv.fr",
  },
  {
    name: "MaPrimeRénov' Parcours Accompagné",
    amount: "Jusqu'à 63 000 € (prise en charge 30 à 80 % des travaux)",
    eligibility: "Ménages modestes et très modestes, gain énergétique ≥ 2 classes DPE",
    works: "Bouquet de travaux avec audit énergétique obligatoire",
    url: "https://france-renov.gouv.fr",
  },
  {
    name: "Éco-PTZ (Prêt à taux zéro)",
    amount: "Jusqu'à 50 000 € sur 20 ans à taux zéro",
    eligibility: "Propriétaires occupants ou bailleurs, pas de condition de revenus",
    works: "Isolation toiture, murs, fenêtres, chauffage, eau chaude",
    url: "https://www.service-public.fr/particuliers/vosdroits/F19905",
  },
  {
    name: "CEE (Certificats d'Économie d'Énergie)",
    amount: "De 5 à 20 €/m² selon le type d'isolation",
    eligibility: "Tous les ménages, via les fournisseurs d'énergie",
    works: "Isolation combles, murs, planchers, remplacement chaudière, PAC",
    url: "https://www.ecologie.gouv.fr/cee",
  },
  {
    name: "ANAH — Habiter Mieux",
    amount: "Jusqu'à 50 % du montant des travaux (plafond variable)",
    eligibility: "Propriétaires aux revenus modestes, logement de plus de 15 ans",
    works: "Rénovation énergétique globale, adaptation au handicap",
    url: "https://www.anah.gouv.fr",
  },
  {
    name: "TVA réduite à 5,5 %",
    amount: "Économie de 14,5 points de TVA sur les travaux éligibles",
    eligibility: "Logements de plus de 2 ans, sur facture artisan",
    works: "Travaux d'amélioration énergétique (isolation, chauffage, ventilation)",
    url: "https://www.service-public.fr/particuliers/vosdroits/F10871",
  },
]

const regionalAides: AideInfo[] = [
  {
    name: "Région Centre-Val de Loire — Rénovation énergétique",
    amount: "Variable selon programmes en cours (500 à 3 000 €)",
    eligibility: "Résidents de la région Centre-Val de Loire",
    works: "Rénovation énergétique, réhabilitation patrimoine, énergies renouvelables",
    url: "https://www.centre-valdeloire.fr",
  },
  {
    name: "Espace France Rénov' d'Eure-et-Loir",
    amount: "Accompagnement gratuit et personnalisé",
    eligibility: "Tous les habitants du département 28",
    works: "Conseil en rénovation énergétique, montage dossiers d'aides",
    url: "https://france-renov.gouv.fr",
  },
]

export default async function AidesCityPage({ params }: PageProps) {
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
          { label: "Aides travaux", href: "/aides" },
          { label: city.name },
        ]}
      />

      <section className="mb-10">
        <div className="mb-1 flex items-center gap-2 text-sm font-medium text-primary">
          <MapPin className="size-4" />
          {city.zip} · {city.population.toLocaleString("fr-FR")} habitants
        </div>
        <h1 className="mb-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Aides travaux à {city.name} ({city.zip})
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
          Retrouvez toutes les aides financières disponibles en {year} pour vos
          travaux de rénovation à {city.name}. Aides nationales, régionales et
          locales : montants, conditions d&apos;éligibilité et démarches.
        </p>
      </section>

      {/* National aids */}
      <section className="mb-10">
        <h2 className="mb-5 font-heading text-xl font-bold">
          <Banknote className="mb-0.5 inline size-5" /> Aides nationales
        </h2>
        <div className="space-y-4">
          {nationalAides.map((aide) => (
            <Card key={aide.name}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base font-bold">
                  <CheckCircle className="size-4 text-green-600" />
                  {aide.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid gap-2 text-sm sm:grid-cols-2">
                  <div>
                    <p className="font-semibold text-foreground">Montant</p>
                    <p className="text-muted-foreground">{aide.amount}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Éligibilité</p>
                    <p className="text-muted-foreground">{aide.eligibility}</p>
                  </div>
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-foreground">Travaux concernés</p>
                  <p className="text-muted-foreground">{aide.works}</p>
                </div>
                <a
                  href={aide.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80"
                >
                  En savoir plus <ExternalLink className="size-3" />
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* Regional aids */}
      <section className="my-10">
        <h2 className="mb-5 font-heading text-xl font-bold">
          Aides régionales et locales
        </h2>
        <div className="space-y-4">
          {regionalAides.map((aide) => (
            <Card key={aide.name}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base font-bold">
                  <CheckCircle className="size-4 text-primary" />
                  {aide.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid gap-2 text-sm sm:grid-cols-2">
                  <div>
                    <p className="font-semibold text-foreground">Montant</p>
                    <p className="text-muted-foreground">{aide.amount}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Éligibilité</p>
                    <p className="text-muted-foreground">{aide.eligibility}</p>
                  </div>
                </div>
                <a
                  href={aide.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80"
                >
                  En savoir plus <ExternalLink className="size-3" />
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-6 rounded-lg bg-muted/40 p-5">
          <h3 className="mb-2 text-sm font-bold">Cumul des aides à {city.name}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            La plupart de ces aides sont cumulables entre elles. Par exemple, vous pouvez
            combiner MaPrimeRénov&apos; avec les CEE et l&apos;éco-PTZ pour un même chantier.
            Le cumul peut couvrir jusqu&apos;à 80-90 % du coût des travaux pour les ménages
            les plus modestes. Consultez l&apos;Espace France Rénov&apos; le plus proche de{" "}
            {city.name} pour un accompagnement gratuit et personnalisé dans le montage
            de votre dossier.
          </p>
        </div>
      </section>

      <Separator />

      {/* Link to guide and trades */}
      <section className="my-10">
        <h2 className="mb-4 font-heading text-xl font-bold">
          Estimez le coût de vos travaux à {city.name}
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Obtenez une estimation précise pour dimensionner votre demande d&apos;aides.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/ville/${city.slug}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Prix travaux à {city.name} <ArrowRight className="size-3.5" />
          </Link>
          <Link
            href={`/guide/${city.slug}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-card px-4 py-2.5 text-sm font-semibold transition-all hover:border-primary/30"
          >
            Guide rénovation {city.name} <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </section>

      {/* Neighboring aides */}
      {neighbors.length > 0 && (
        <>
          <Separator />
          <section className="my-10">
            <h2 className="mb-4 font-heading text-xl font-bold">
              Aides travaux dans les communes voisines
            </h2>
            <div className="flex flex-wrap gap-2">
              {neighbors.map((n) => (
                <Link
                  key={n.slug}
                  href={`/aides/${n.slug}`}
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
