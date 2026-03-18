import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, CheckCircle, TrendingUp, Shield, BadgeCheck } from "lucide-react"
import { trades } from "@/lib/data"
import { tradeIcons } from "@/lib/trade-icons"
import { Breadcrumb } from "@/components/Breadcrumb"

export const metadata: Metadata = {
  title: "Comparateur de Prix Travaux en Eure-et-Loir (28) — Tarifs 2026",
  description:
    "Comparez les prix de tous les corps de métier en Eure-et-Loir : toiture, isolation, plomberie, électricité, peinture, carrelage. Tarifs vérifiés et devis gratuits d'artisans qualifiés.",
  alternates: { canonical: "/prix" },
}

export default function PrixHubPage() {
  const year = new Date().getFullYear()

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
        département de l&apos;Eure-et-Loir (28). Sélectionnez un métier pour consulter
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
                  <Icon className="size-5 text-primary" aria-hidden="true" />
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
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* ── SEO Content ── */}
      <section className="mt-14">
        <h2 className="mb-4 font-heading text-xl font-bold">
          Pourquoi comparer les prix des travaux en Eure-et-Loir ?
        </h2>
        <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Le département de l&apos;Eure-et-Loir (28) présente un parc immobilier
            diversifié, des maisons de la Beauce aux longères du Perche en passant
            par les pavillons des agglomérations de Chartres et Dreux. Les tarifs
            des artisans varient sensiblement selon le bassin de vie, la nature
            des travaux et la complexité du chantier.
          </p>
          <p>
            Notre comparateur vous permet d&apos;estimer gratuitement le coût de vos
            travaux en fonction de votre commune et du corps de métier concerné.
            Tous les prix affichés sont basés sur les tarifs constatés en
            Eure-et-Loir et mis à jour régulièrement.
          </p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 font-heading text-xl font-bold">
          Des prix adaptés à chaque zone géographique
        </h2>
        <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            L&apos;Eure-et-Loir se divise en quatre bassins de vie qui présentent chacun
            des spécificités influençant le coût des travaux. Le <strong className="text-foreground">Perche</strong>,
            au sud-ouest du département, se caractérise par un patrimoine bâti ancien (longères
            en pierre, manoirs, maisons à colombages) qui nécessite des techniques de rénovation
            spécifiques et souvent plus coûteuses. La <strong className="text-foreground">Beauce</strong>,
            vaste plaine céréalière au nord-est, abrite principalement des constructions récentes
            (pavillons, corps de ferme modernisés) dont la rénovation suit des tarifs plus standards.
          </p>
          <p>
            Le <strong className="text-foreground">Drouais</strong>, proche de l&apos;Île-de-France,
            bénéficie d&apos;un marché dynamique avec davantage d&apos;artisans disponibles, ce qui
            peut favoriser la concurrence sur les prix. Enfin, le <strong className="text-foreground">Dunois</strong>,
            autour de Châteaudun, présente un marché plus rural avec des déplacements parfois plus
            longs qui se répercutent sur les devis.
          </p>
          <p>
            Notre comparateur intègre un <strong className="text-foreground">coefficient régional</strong> qui
            ajuste automatiquement les estimations selon la densité de population de votre commune.
            Les zones rurales (moins de 1 000 habitants) affichent en moyenne un surcoût de 8 à 12 %
            par rapport aux zones urbaines comme Chartres ou Dreux, principalement en raison des
            frais de déplacement.
          </p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-5 font-heading text-xl font-bold">
          Comment utiliser notre comparateur
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: CheckCircle,
              title: "1. Choisissez un métier",
              desc: "Sélectionnez le corps de métier correspondant à votre projet : toiture, isolation, plomberie, électricité, peinture ou autre.",
            },
            {
              icon: TrendingUp,
              title: "2. Sélectionnez votre commune",
              desc: "Les prix sont ajustés selon votre localisation en Eure-et-Loir. Chaque commune dispose de tarifs spécifiques.",
            },
            {
              icon: Shield,
              title: "3. Consultez les tarifs",
              desc: "Obtenez une estimation détaillée avec fourchette de prix, délais moyens, matériaux recommandés et aides financières disponibles.",
            },
            {
              icon: BadgeCheck,
              title: "4. Demandez vos devis",
              desc: "Recevez jusqu'à 3 devis gratuits d'artisans qualifiés de votre secteur. Comparez et choisissez sereinement.",
            },
          ].map((step) => (
            <div key={step.title} className="rounded-xl border border-border/60 bg-card p-5">
              <step.icon className="mb-3 size-6 text-primary" aria-hidden="true" />
              <h3 className="mb-1.5 text-sm font-bold">{step.title}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 font-heading text-xl font-bold">
          Tarifs moyens constatés en {year}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left">
                <th className="pb-3 pr-4 font-bold">Corps de métier</th>
                <th className="pb-3 pr-4 font-bold">Prix minimum</th>
                <th className="pb-3 pr-4 font-bold">Prix maximum</th>
                <th className="pb-3 font-bold">Unité</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {trades.map((trade) => (
                <tr key={trade.slug}>
                  <td className="py-3 pr-4">
                    <Link href={`/prix/${trade.slug}`} className="font-medium text-primary hover:underline">
                      {trade.title}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">{trade.min_price} €</td>
                  <td className="py-3 pr-4 text-muted-foreground">{trade.max_price} €</td>
                  <td className="py-3 text-muted-foreground">{trade.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          * Prix TTC constatés en Eure-et-Loir (28) — Tarifs indicatifs, hors fournitures spécifiques.
          Mis à jour en {year}.
        </p>
      </section>

      {/* ── FAQ ── */}
      <section className="mt-10">
        <h2 className="mb-5 font-heading text-xl font-bold">
          Questions fréquentes sur les prix des travaux
        </h2>
        <div className="space-y-5">
          {[
            {
              q: "Les prix affichés incluent-ils la main-d'œuvre et les fournitures ?",
              a: "Nos tarifs correspondent aux prix moyens constatés en Eure-et-Loir, main-d'œuvre incluse. Les fournitures spécifiques (matériaux haut de gamme, pièces sur mesure) peuvent entraîner un surcoût. Chaque fiche détaillée précise ce qui est inclus dans la fourchette de prix.",
            },
            {
              q: "Pourquoi les prix varient-ils d'une commune à l'autre ?",
              a: "Plusieurs facteurs expliquent ces variations : la densité d'artisans disponibles dans le secteur, les frais de déplacement (plus élevés en zone rurale), le type de bâti local (les longères du Perche sont plus complexes à rénover que les pavillons de la Beauce) et la tension du marché immobilier local.",
            },
            {
              q: "À quelle fréquence les prix sont-ils mis à jour ?",
              a: "Nos tarifs sont actualisés chaque trimestre sur la base des devis réellement constatés en Eure-et-Loir. Nous collectons les données auprès d'artisans partenaires et de bases publiques (FFB, CAPEB) pour garantir la fiabilité des estimations.",
            },
            {
              q: "Comment obtenir un devis précis pour mon projet ?",
              a: "Sélectionnez votre corps de métier et votre commune pour accéder à une estimation détaillée. Vous pouvez ensuite utiliser notre calculateur de prix et demander jusqu'à 3 devis gratuits d'artisans qualifiés de votre secteur.",
            },
            {
              q: "Les artisans référencés sont-ils certifiés ?",
              a: "Nous travaillons exclusivement avec des artisans disposant d'une assurance décennale en cours de validité. Pour les travaux de rénovation énergétique (isolation, chauffage), nous privilégions les professionnels certifiés RGE (Reconnu Garant de l'Environnement), condition indispensable pour bénéficier des aides financières.",
            },
          ].map((item) => (
            <div key={item.q}>
              <h3 className="mb-1.5 text-sm font-semibold">{item.q}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <Link
          href="/eure-et-loir"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
        >
          Voir toutes les communes couvertes en Eure-et-Loir
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </section>
    </>
  )
}
