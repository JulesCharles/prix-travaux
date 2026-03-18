import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Calendar, BookOpen, TrendingUp, Shield } from "lucide-react"
import { blogPosts } from "@/lib/data"
import { Breadcrumb } from "@/components/Breadcrumb"

export const metadata: Metadata = {
  title: "Guides & Conseils Rénovation en Eure-et-Loir (28)",
  description:
    "Conseils d'experts, guides pratiques et actualités sur les travaux de rénovation en Eure-et-Loir. Toiture, isolation, aides financières, artisans RGE : tout pour réussir votre projet.",
  alternates: { canonical: "/blog" },
}

export default function BlogIndexPage() {
  const sortedPosts = [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Accueil", href: "/" },
          { label: "Blog" },
        ]}
      />

      <section className="mb-10">
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
          <BookOpen className="size-4" aria-hidden="true" />
          Ressources et conseils
        </div>
        <h1 className="mb-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Guides &amp; Conseils Rénovation en Eure-et-Loir
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
          Retrouvez nos guides pratiques, analyses de prix et conseils d&apos;experts
          pour réussir vos travaux de rénovation dans le département de l&apos;Eure-et-Loir (28).
          Chaque article est rédigé par notre équipe éditoriale et vérifié par des
          professionnels du bâtiment.
        </p>
      </section>

      {/* ── Thématiques ── */}
      <section className="mb-10">
        <h2 className="mb-4 font-heading text-lg font-bold">
          Nos thématiques
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            {
              icon: TrendingUp,
              title: "Prix & budgets",
              desc: "Analyses détaillées des tarifs par métier et par commune. Estimations réalistes pour planifier votre budget.",
            },
            {
              icon: Shield,
              title: "Aides & financement",
              desc: "MaPrimeRénov', éco-PTZ, CEE, TVA réduite : toutes les aides disponibles pour réduire le coût de vos travaux.",
            },
            {
              icon: BookOpen,
              title: "Guides pratiques",
              desc: "Conseils pour choisir vos matériaux, trouver un artisan RGE, planifier vos travaux et éviter les pièges.",
            },
          ].map((cat) => (
            <div key={cat.title} className="rounded-xl border border-border/60 bg-card p-5">
              <cat.icon className="mb-3 size-5 text-primary" aria-hidden="true" />
              <h3 className="mb-1 text-sm font-bold">{cat.title}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">{cat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Articles ── */}
      <section className="mb-10">
        <h2 className="mb-5 font-heading text-lg font-bold">
          Tous nos articles
        </h2>
        <div className="space-y-6">
          {sortedPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block rounded-xl border border-border/60 bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="size-3" aria-hidden="true" />
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
              <h3 className="mb-2 font-heading text-lg font-bold text-foreground group-hover:text-primary">
                {post.title}
              </h3>
              <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                {post.excerpt}
              </p>
              <span className="flex items-center gap-1 text-sm font-semibold text-primary">
                Lire l&apos;article
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── SEO Content ── */}
      <section className="mt-10">
        <h2 className="mb-4 font-heading text-xl font-bold">
          Pourquoi lire nos guides avant de lancer vos travaux ?
        </h2>
        <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Rénover un bien immobilier en Eure-et-Loir représente un investissement important
            qui mérite une préparation rigoureuse. Que vous soyez propriétaire d&apos;une longère
            du Perche, d&apos;un pavillon à Chartres ou d&apos;une maison de ville à Dreux, chaque
            projet comporte des spécificités locales qu&apos;il est essentiel de connaître avant
            de solliciter des artisans.
          </p>
          <p>
            Nos articles couvrent l&apos;ensemble des problématiques que rencontrent les
            propriétaires euréliens : <strong className="text-foreground">choix des matériaux</strong> adaptés
            au climat continental du département, <strong className="text-foreground">sélection d&apos;artisans
            RGE</strong> pour bénéficier des aides financières, <strong className="text-foreground">planification
            saisonnière</strong> des travaux (les couvreurs sont particulièrement sollicités entre
            mars et octobre), et <strong className="text-foreground">estimation budgétaire réaliste</strong> basée
            sur les tarifs réels pratiqués dans le 28.
          </p>
          <p>
            Chaque guide est rédigé en collaboration avec des professionnels du bâtiment
            intervenant en Eure-et-Loir. Les informations sur les prix, les délais et les
            aides financières sont vérifiées et actualisées régulièrement pour refléter
            la réalité du marché local.
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="mt-10">
        <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-6 text-center">
          <h2 className="mb-2 font-heading text-lg font-bold">
            Prêt à estimer le coût de vos travaux ?
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Utilisez notre comparateur de prix pour obtenir une estimation gratuite
            et personnalisée.
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
