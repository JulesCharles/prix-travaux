import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { trades } from "@/lib/data"
import { tradeIcons } from "@/lib/trade-icons"
import { Breadcrumb } from "@/components/Breadcrumb"

export const metadata: Metadata = {
  title: "Comparateur de Prix Travaux en Eure-et-Loir (28)",
  description:
    "Comparez les prix de tous les corps de métier en Eure-et-Loir : toiture, isolation, plomberie, électricité, peinture, carrelage. Devis gratuits d'artisans qualifiés.",
  alternates: { canonical: "/prix" },
}

export default function PrixHubPage() {
  return (
    <>
      <Breadcrumb
        items={[
          { label: "Accueil", href: "/" },
          { label: "Prix travaux" },
        ]}
      />

      <h1 className="mb-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
        Comparateur de Prix Travaux en Eure-et-Loir
      </h1>
      <p className="mb-10 max-w-2xl text-base leading-relaxed text-muted-foreground">
        Retrouvez les tarifs moyens constatés pour chaque corps de métier dans le
        département de l'Eure-et-Loir (28). Sélectionnez un métier pour consulter
        les prix détaillés par commune.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {trades.map((trade) => {
          const Icon = tradeIcons[trade.slug] ?? ArrowRight
          return (
            <Link
              key={trade.slug}
              href={`/prix/${trade.slug}`}
              className="group relative overflow-hidden rounded-xl border border-border/60 bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className="pointer-events-none absolute -right-6 -top-6 size-20 rounded-full bg-primary/5 transition-transform group-hover:scale-150" />
              <div className="relative">
                <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="size-5 text-primary" />
                </div>
                <h2 className="font-heading text-lg font-bold">{trade.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  De{" "}
                  <span className="font-semibold text-foreground">
                    {trade.min_price} €
                  </span>{" "}
                  à{" "}
                  <span className="font-semibold text-foreground">
                    {trade.max_price} €
                  </span>{" "}
                  / {trade.unit}
                </p>
                <div className="mt-3 flex items-center gap-1 text-sm font-semibold text-primary">
                  Voir les prix par commune
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      <section className="mt-14">
        <h2 className="mb-4 font-heading text-xl font-bold">
          Pourquoi comparer les prix des travaux en Eure-et-Loir ?
        </h2>
        <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Le département de l'Eure-et-Loir (28) présente un parc immobilier
            diversifié, des maisons de la Beauce aux longères du Perche en passant
            par les pavillons des agglomérations de Chartres et Dreux. Les tarifs
            des artisans varient sensiblement selon le bassin de vie, la nature
            des travaux et la complexité du chantier.
          </p>
          <p>
            Notre comparateur vous permet d'estimer gratuitement le coût de vos
            travaux en fonction de votre commune et du corps de métier concerné.
            Tous les prix affichés sont basés sur les tarifs constatés en
            Eure-et-Loir et mis à jour régulièrement.
          </p>
        </div>
      </section>

      <section className="mt-10">
        <Link
          href="/eure-et-loir"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
        >
          Voir toutes les communes couvertes en Eure-et-Loir
          <ArrowRight className="size-3.5" />
        </Link>
      </section>
    </>
  )
}
