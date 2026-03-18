import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, MapPin, BookOpen, Home, Wrench, Banknote } from "lucide-react"
import { getTopCities } from "@/lib/data"
import { Breadcrumb } from "@/components/Breadcrumb"

export const metadata: Metadata = {
  title: "Guides rénovation par ville — Eure-et-Loir (28)",
  description:
    "Guides complets de rénovation pour chaque ville d'Eure-et-Loir : budget, artisans, spécificités architecturales, aides locales. Chartres, Dreux, Nogent-le-Rotrou et plus.",
  alternates: { canonical: "/guide" },
}

export default function GuideIndexPage() {
  const allCities = getTopCities(33)

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Accueil", href: "/" },
          { label: "Guides rénovation" },
        ]}
      />

      <section className="mb-10">
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
          <BookOpen className="size-4" aria-hidden="true" />
          Guides par ville
        </div>
        <h1 className="mb-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Guides rénovation en Eure-et-Loir
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
          Découvrez nos guides complets de rénovation adaptés à chaque commune
          d&apos;Eure-et-Loir. Spécificités architecturales, artisans locaux, budget
          moyen et aides disponibles pour votre projet.
        </p>
      </section>

      {/* ── Ce que contient chaque guide ── */}
      <section className="mb-10">
        <h2 className="mb-5 font-heading text-xl font-bold">
          Ce que contient chaque guide
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Home,
              title: "Architecture locale",
              desc: "Spécificités du bâti de votre commune : matériaux traditionnels, contraintes PLU, style architectural dominant.",
            },
            {
              icon: Banknote,
              title: "Budget estimatif",
              desc: "Fourchettes de prix pour la rénovation légère, moyenne et lourde, adaptées au marché local.",
            },
            {
              icon: Wrench,
              title: "Métiers à solliciter",
              desc: "Liste des corps de métier nécessaires selon votre projet avec tarifs moyens constatés.",
            },
            {
              icon: BookOpen,
              title: "Aides financières",
              desc: "MaPrimeRénov', éco-PTZ, CEE et aides régionales accessibles dans votre commune.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-border/60 bg-card p-5">
              <item.icon className="mb-3 size-5 text-primary" aria-hidden="true" />
              <h3 className="mb-1.5 text-sm font-bold">{item.title}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SEO Content ── */}
      <section className="mb-10">
        <h2 className="mb-4 font-heading text-xl font-bold">
          Pourquoi un guide par commune ?
        </h2>
        <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            En Eure-et-Loir, les conditions de rénovation varient considérablement d&apos;une
            commune à l&apos;autre. Le Perche, avec ses longères en pierre et ses manoirs à
            colombages, impose des techniques de restauration patrimoniale que ne requiert
            pas un pavillon des années 1970 dans l&apos;agglomération chartraine. De même, le
            climat continental du département — hivers froids, étés chauds — oriente les
            choix d&apos;isolation et de chauffage différemment selon l&apos;altitude et l&apos;exposition.
          </p>
          <p>
            Nos guides intègrent ces particularités locales : <strong className="text-foreground">style
            architectural dominant</strong> de chaque commune, <strong className="text-foreground">contraintes
            urbanistiques</strong> (périmètre ABF, zones protégées), <strong className="text-foreground">caractéristiques
            climatiques</strong> et <strong className="text-foreground">dynamique du marché
            immobilier</strong>. Vous disposez ainsi d&apos;une vision complète avant de lancer
            votre projet de rénovation.
          </p>
          <p>
            Les budgets présentés sont basés sur les tarifs réellement constatés en
            Eure-et-Loir et distinguent trois niveaux d&apos;intervention : la <strong className="text-foreground">rénovation
            légère</strong> (rafraîchissement, peinture, petits travaux), la <strong className="text-foreground">rénovation
            moyenne</strong> (remplacement de menuiseries, réfection de salle de bain, isolation
            partielle) et la <strong className="text-foreground">rénovation lourde</strong> (réfection
            complète de toiture, isolation globale, mise aux normes électriques).
          </p>
        </div>
      </section>

      {/* ── City grid ── */}
      <section className="mb-10">
        <h2 className="mb-5 font-heading text-xl font-bold">
          Choisissez votre commune
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {allCities.map((city) => (
            <Link
              key={city.slug}
              href={`/guide/${city.slug}`}
              className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <MapPin className="size-4 text-primary" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-foreground">
                  Guide rénovation {city.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {city.zip} · {city.population.toLocaleString("fr-FR")} hab.
                </span>
              </div>
              <ArrowRight className="size-4 shrink-0 text-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden="true" />
            </Link>
          ))}
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
              q: "Comment savoir par où commencer ma rénovation ?",
              a: "Consultez le guide de votre commune pour identifier les priorités selon le type de bâti local. En règle générale, l'isolation et la toiture sont les postes à traiter en premier, suivis du chauffage, puis de l'aménagement intérieur. Nos guides détaillent l'ordre recommandé pour chaque zone géographique.",
            },
            {
              q: "Quel budget prévoir pour une rénovation complète en Eure-et-Loir ?",
              a: "Le budget moyen varie de 500 à 1 500 €/m² selon l'ampleur des travaux et le type de bien. Une rénovation légère (peinture, sols) démarre autour de 200 €/m², tandis qu'une rénovation lourde avec isolation et mise aux normes peut atteindre 1 200 à 1 800 €/m² dans le Perche. Chaque guide communal détaille les fourchettes adaptées.",
            },
            {
              q: "Faut-il un architecte pour rénover en Eure-et-Loir ?",
              a: "Le recours à un architecte est obligatoire pour les travaux modifiant l'aspect extérieur d'un bâtiment situé dans le périmètre d'un monument historique (ABF), ou pour toute extension créant une surface de plancher supérieure à 150 m². Dans les zones protégées du Perche, nous recommandons systématiquement une consultation préalable.",
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
