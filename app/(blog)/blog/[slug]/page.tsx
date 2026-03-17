import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Calendar, ArrowRight } from "lucide-react"
import { blogPosts, getBlogPost, getTrade } from "@/lib/data"
import { tradeIcons } from "@/lib/trade-icons"
import { Breadcrumb } from "@/components/Breadcrumb"

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
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) notFound()

  const relatedTrades = post.related_trades
    .map((slug) => getTrade(slug))
    .filter((t) => t !== undefined)

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Organization", name: post.author },
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

      <article>
        <div className="mb-6">
          <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="size-3" />
            {new Date(post.date).toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            <span>·</span>
            <span>{post.author}</span>
          </div>
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            {post.title}
          </h1>
        </div>

        <div
          className="prose-sm prose-headings:font-heading prose-headings:font-bold prose-h2:mt-8 prose-h2:mb-3 prose-h2:text-xl prose-h3:mt-6 prose-h3:mb-2 prose-h3:text-base prose-p:leading-relaxed prose-p:text-muted-foreground prose-li:text-muted-foreground prose-ul:space-y-1"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      {relatedTrades.length > 0 && (
        <section className="mt-12 border-t pt-8">
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
                  className="group flex items-center gap-3 rounded-lg border border-border/60 bg-card px-4 py-3 transition-all hover:border-primary/30 hover:shadow-sm"
                >
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="size-4 text-primary" />
                  </div>
                  <span className="text-sm font-semibold">
                    Prix {trade.title}
                  </span>
                  <ArrowRight className="ml-auto size-3.5 text-muted-foreground/40 group-hover:text-primary" />
                </Link>
              )
            })}
          </div>
        </section>
      )}
    </>
  )
}
