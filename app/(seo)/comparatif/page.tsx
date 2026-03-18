import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Scale, CheckCircle, BarChart3, Shield } from "lucide-react"
import { comparatifs } from "@/lib/data"
import { Breadcrumb } from "@/components/Breadcrumb"

export const metadata: Metadata = {
  title: "Comparatifs travaux — Quel matériau choisir en Eure-et-Loir ?",
  description:
    "Comparez les matériaux et solutions pour vos travaux en Eure-et-Loir : tuile vs ardoise, PAC vs chaudière gaz, isolation intérieure vs extérieure. Guide objectif et prix détaillés.",
  alternates: { canonical: "/comparatif" },
}

export default function ComparatifIndexPage() {
  return (
    <>
      <Breadcrumb
        items={[
          { label: "Accueil", href: "/" },
          { label: "Comparatifs" },
        ]}
      />

      <section className="mb-10">
        <h1 className="mb-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Comparatifs travaux : quel matériau choisir ?
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
          Comparez objectivement les matériaux, techniques et solutions pour vos
          travaux de rénovation en Eure-et-Loir. Prix, avantages, inconvénients
          et verdict pour chaque option.
        </p>
      </section>

      {/* ── Méthodologie ── */}
      <section className="mb-10">
        <h2 className="mb-5 font-heading text-xl font-bold">
          Notre méthodologie de comparaison
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: BarChart3,
              title: "Données locales",
              desc: "Chaque comparatif s'appuie sur les prix réellement pratiqués en Eure-et-Loir, pas sur des moyennes nationales.",
            },
            {
              icon: CheckCircle,
              title: "Critères objectifs",
              desc: "Prix, durabilité, performance, esthétique, facilité de pose : nous notons chaque option sur des critères mesurables.",
            },
            {
              icon: Shield,
              title: "Verdict argumenté",
              desc: "Notre recommandation tient compte du climat eurélien, du bâti local et du rapport qualité-prix dans le département.",
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

      {/* ── Comparatifs grid ── */}
      <section className="mb-10">
        <h2 className="mb-5 font-heading text-xl font-bold">
          Tous nos comparatifs
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {comparatifs.map((comp) => (
            <Link
              key={comp.slug}
              href={`/comparatif/${comp.slug}`}
              className="group flex items-center gap-4 rounded-xl border border-border/60 bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Scale className="size-5 text-primary" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-foreground">
                  {comp.title}
                </span>
                <span className="line-clamp-1 text-xs text-muted-foreground">
                  {comp.option_a.name} vs {comp.option_b.name}
                  {comp.option_c ? ` vs ${comp.option_c.name}` : ""}
                </span>
              </div>
              <ArrowRight className="size-4 shrink-0 text-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      {/* ── SEO Content ── */}
      <section className="mb-10">
        <h2 className="mb-4 font-heading text-xl font-bold">
          Pourquoi comparer avant de choisir ?
        </h2>
        <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Le choix des matériaux et des techniques est une décision structurante pour
            tout projet de rénovation. En Eure-et-Loir, ce choix est d&apos;autant plus
            important que le département présente des <strong className="text-foreground">conditions
            climatiques contrastées</strong> (hivers rigoureux dans le Perche, vents
            de plaine en Beauce) et des <strong className="text-foreground">typologies de bâti
            variées</strong> (pierre calcaire, brique, enduit, colombages).
          </p>
          <p>
            Un matériau performant dans un contexte peut s&apos;avérer inadapté dans un autre.
            Par exemple, l&apos;ardoise naturelle est historiquement le matériau de couverture
            du Perche, mais la tuile plate reste dominante en Beauce. Opter pour le
            mauvais matériau peut entraîner des surcoûts importants en entretien et
            poser des problèmes de compatibilité avec le PLU local.
          </p>
          <p>
            Nos comparatifs vous aident à faire un choix éclairé en confrontant chaque
            option sur des critères concrets : <strong className="text-foreground">prix au m²</strong> en
            Eure-et-Loir, <strong className="text-foreground">durée de vie</strong>,{" "}
            <strong className="text-foreground">performance thermique ou acoustique</strong>,{" "}
            <strong className="text-foreground">facilité de pose</strong> et{" "}
            <strong className="text-foreground">compatibilité avec les aides financières</strong> (certains
            matériaux doivent respecter des seuils de performance pour être éligibles
            à MaPrimeRénov&apos;).
          </p>
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
              q: "Les prix des comparatifs sont-ils spécifiques à l'Eure-et-Loir ?",
              a: "Oui, toutes les fourchettes de prix indiquées sont basées sur les tarifs constatés dans le département de l'Eure-et-Loir. Elles incluent la fourniture et la pose par un artisan qualifié. Les prix peuvent varier selon la commune et la complexité du chantier.",
            },
            {
              q: "Comment choisir entre deux matériaux équivalents en prix ?",
              a: "Quand le prix est similaire, nous recommandons de privilégier la durabilité et la compatibilité avec le bâti existant. En Eure-et-Loir, la résistance aux intempéries et la performance thermique sont les critères les plus déterminants sur le long terme.",
            },
            {
              q: "Le choix du matériau influence-t-il l'éligibilité aux aides ?",
              a: "Oui, pour MaPrimeRénov' et les CEE, les matériaux doivent respecter des seuils de performance minimaux (résistance thermique R pour l'isolation, coefficient de performance pour les PAC). Nos comparatifs précisent systématiquement les matériaux éligibles aux aides.",
            },
          ].map((item) => (
            <div key={item.q}>
              <h3 className="mb-1.5 text-sm font-semibold">{item.q}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="mt-10">
        <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-6 text-center">
          <h2 className="mb-2 font-heading text-lg font-bold">
            Besoin d&apos;un devis pour vos travaux ?
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Comparez les prix d&apos;artisans qualifiés en Eure-et-Loir et recevez
            jusqu&apos;à 3 devis gratuits.
          </p>
          <Link
            href="/prix"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg"
          >
            Voir tous les prix
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  )
}
