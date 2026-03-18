import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Calendar, ArrowRight, User, Clock, BookOpen } from "lucide-react"
import { blogPosts, getBlogPost, getTrade } from "@/lib/data"
import { tradeIcons } from "@/lib/trade-icons"
import { Breadcrumb } from "@/components/Breadcrumb"
import { Separator } from "@/components/ui/separator"

const tagLabels: Record<string, string> = {
  toiture: "Toiture",
  isolation: "Isolation",
  chauffage: "Chauffage",
  plomberie: "Plomberie",
  electricite: "Électricité",
  menuiserie: "Menuiserie",
  facade: "Façade",
  peinture: "Peinture",
  "salle-de-bain": "Salle de bain",
  carrelage: "Carrelage",
  maconnerie: "Maçonnerie",
  charpente: "Charpente",
  "eure-et-loir": "Eure-et-Loir",
  renovation: "Rénovation",
  aides: "Aides",
  energie: "Énergie",
  budget: "Budget",
  artisan: "Artisan",
  rge: "RGE",
  qualite: "Qualité",
  reglementation: "Réglementation",
  conseils: "Conseils",
  materiaux: "Matériaux",
  financement: "Financement",
  saison: "Saison",
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return { title: "Article introuvable" }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      images: [`/images/blog/${post.slug}.jpg`],
    },
  }
}

function estimateReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, "")
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 220))
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) notFound()

  const readingTime = estimateReadingTime(post.content)

  const relatedTrades = post.related_trades
    .map((slug) => getTrade(slug))
    .filter((t) => t !== undefined)

  const otherPosts = blogPosts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3)

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Organization", name: post.author },
    image: `${process.env.NEXT_PUBLIC_BASE_URL || "https://prix-travaux-28.fr"}/images/blog/${post.slug}.jpg`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />

      <Breadcrumb
        items={[
          { label: "Accueil", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: post.title },
        ]}
      />

      <div className="relative mb-8 h-[280px] w-full overflow-hidden rounded-xl sm:h-[360px]">
        <Image
          src={`/images/blog/${post.slug}.jpg`}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover"
          priority
        />
      </div>

      <article>
        {/* ── Header ── */}
        <header className="mb-8">
          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary"
                >
                  {tagLabels[tag] ?? tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="mb-4 font-heading text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            {post.title}
          </h1>

          {/* Excerpt as lead paragraph */}
          <p className="mb-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {post.excerpt}
          </p>

          {/* Meta bar */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="size-3.5" aria-hidden="true" />
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
            <div className="flex items-center gap-1.5">
              <User className="size-3.5" aria-hidden="true" />
              {post.author}
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="size-3.5" aria-hidden="true" />
              {readingTime} min de lecture
            </div>
          </div>
        </header>

        <Separator className="mb-8" />

        {/* ── Article body ── */}
        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      {/* ── Author box ── */}
      <div className="mt-10 rounded-xl border-2 border-border/60 bg-card p-5">
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <BookOpen className="size-5 text-primary" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-bold">{post.author}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Observatoire indépendant des prix du bâtiment en Eure-et-Loir.
              Nos articles sont rédigés par des spécialistes de la rénovation et
              vérifiés par notre comité éditorial.
            </p>
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="mt-8 rounded-xl border-2 border-primary/20 bg-primary/5 p-6 text-center">
        <h2 className="mb-2 font-heading text-lg font-bold">
          Besoin d&apos;un devis pour vos travaux ?
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Comparez gratuitement les prix d&apos;artisans qualifiés en Eure-et-Loir.
        </p>
        <Link
          href="/prix"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg"
        >
          Voir tous les prix
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>

      {/* ── Related trades ── */}
      {relatedTrades.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 font-heading text-lg font-bold">
            Métiers liés
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {relatedTrades.map((trade) => {
              const Icon = tradeIcons[trade.slug] ?? ArrowRight
              return (
                <Link
                  key={trade.slug}
                  href={`/prix/${trade.slug}`}
                  className="group flex items-center gap-3 rounded-lg border-2 border-border/60 bg-card px-4 py-3 transition-all hover:border-primary/30 hover:shadow-sm"
                >
                  <div className="flex size-9 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="size-4 text-primary" />
                  </div>
                  <span className="text-sm font-semibold">
                    Prix {trade.title}
                  </span>
                  <ArrowRight className="ml-auto size-3.5 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* ── Other articles ── */}
      {otherPosts.length > 0 && (
        <section className="mt-10 border-t-2 border-border/60 pt-8">
          <h2 className="mb-4 font-heading text-lg font-bold">
            À lire aussi
          </h2>
          <div className="space-y-4">
            {otherPosts.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group block rounded-lg border border-border/60 bg-card p-4 transition-all hover:border-primary/30 hover:shadow-sm"
              >
                <div className="mb-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="size-3" aria-hidden="true" />
                  <time dateTime={p.date}>
                    {new Date(p.date).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
                <h3 className="text-sm font-bold text-foreground group-hover:text-primary">
                  {p.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
