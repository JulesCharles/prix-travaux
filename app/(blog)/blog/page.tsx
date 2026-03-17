import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Calendar } from "lucide-react"
import { blogPosts } from "@/lib/data"
import { Breadcrumb } from "@/components/Breadcrumb"

export const metadata: Metadata = {
  title: "Blog — Conseils travaux en Eure-et-Loir",
  description:
    "Conseils, guides et actualités sur les travaux de rénovation en Eure-et-Loir. Toiture, isolation, aides financières, artisans RGE.",
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

      <h1 className="mb-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
        Blog
      </h1>
      <p className="mb-10 text-base text-muted-foreground">
        Conseils, guides et actualités pour vos travaux en Eure-et-Loir.
      </p>

      <div className="space-y-6">
        {sortedPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block rounded-xl border border-border/60 bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md"
          >
            <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="size-3" />
              {new Date(post.date).toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <h2 className="mb-2 font-heading text-lg font-bold text-foreground group-hover:text-primary">
              {post.title}
            </h2>
            <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
              {post.excerpt}
            </p>
            <span className="flex items-center gap-1 text-sm font-semibold text-primary">
              Lire l'article
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </>
  )
}
