import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, Check, X } from "lucide-react"
import { comparatifs, getComparatif, getTrade } from "@/lib/data"
import { tradeIcons } from "@/lib/trade-icons"
import { Breadcrumb } from "@/components/Breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return comparatifs.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const comp = getComparatif(slug)
  if (!comp) return { title: "Page introuvable" }

  return {
    title: comp.title,
    description: comp.meta_description,
    alternates: { canonical: `/comparatif/${comp.slug}` },
  }
}

export default async function ComparatifPage({ params }: PageProps) {
  const { slug } = await params
  const comp = getComparatif(slug)
  if (!comp) notFound()

  const options = [comp.option_a, comp.option_b, ...(comp.option_c ? [comp.option_c] : [])]

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Accueil", href: "/" },
          { label: "Comparatifs", href: "/comparatif" },
          { label: comp.title },
        ]}
      />

<section className="mb-10">
        <h1 className="mb-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          {comp.title}
        </h1>
        <div
          className="max-w-3xl text-base leading-relaxed text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: comp.intro }}
        />
      </section>

      {/* Options cards */}
      <section className="mb-10">
        <h2 className="mb-5 font-heading text-xl font-bold">
          Les options en détail
        </h2>
        <div className={`grid gap-4 ${comp.option_c ? "lg:grid-cols-3" : "sm:grid-cols-2"}`}>
          {options.map((opt, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle className="text-base font-bold">{opt.name}</CardTitle>
                <p className="text-sm font-semibold text-primary">{opt.price_range}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-green-700">Avantages</p>
                  <ul className="space-y-1.5">
                    {opt.pros.map((pro, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="mt-0.5 size-3.5 shrink-0 text-green-600" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-red-700">Inconvénients</p>
                  <ul className="space-y-1.5">
                    {opt.cons.map((con, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <X className="mt-0.5 size-3.5 shrink-0 text-red-500" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg bg-muted/40 p-3">
                  <p className="text-xs font-semibold text-foreground">Idéal pour</p>
                  <p className="text-xs text-muted-foreground">{opt.best_for}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* Criteria comparison table */}
      <section className="my-10">
        <h2 className="mb-5 font-heading text-xl font-bold">
          Comparatif critère par critère
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left">
                <th className="pb-3 pr-4 font-bold">Critère</th>
                <th className="pb-3 pr-4 font-bold">{comp.option_a.name}</th>
                <th className="pb-3 pr-4 font-bold">{comp.option_b.name}</th>
                {comp.option_c && (
                  <th className="pb-3 pr-4 font-bold">{comp.option_c.name}</th>
                )}
                <th className="pb-3 font-bold">Gagnant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {comp.criteria.map((crit, i) => (
                <tr key={i}>
                  <td className="py-3 pr-4 font-medium">{crit.name}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{crit.option_a_score}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{crit.option_b_score}</td>
                  {comp.option_c && (
                    <td className="py-3 pr-4 text-muted-foreground">{crit.option_c_score}</td>
                  )}
                  <td className="py-3 font-semibold text-primary">{crit.winner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Separator />

      {/* Verdict */}
      <section className="my-10">
        <h2 className="mb-4 font-heading text-xl font-bold">
          Notre verdict
        </h2>
        <div
          className="rounded-lg bg-primary/5 p-6 text-sm leading-relaxed text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: comp.verdict }}
        />
      </section>

      <Separator />

      {/* CTA */}
      <section className="my-10">
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

      {/* Related trades */}
      {comp.related_trades.length > 0 && (
        <section className="my-10">
          <h2 className="mb-4 font-heading text-xl font-bold">
            Métiers concernés
          </h2>
          <div className="flex flex-wrap gap-3">
            {comp.related_trades.map((slug) => {
              const trade = getTrade(slug)
              if (!trade) return null
              const Icon = tradeIcons[trade.slug] ?? ArrowRight
              return (
                <Link
                  key={slug}
                  href={`/prix/${slug}`}
                  className="group inline-flex items-center gap-2 rounded-lg border border-border/60 bg-card px-4 py-2.5 text-sm transition-all hover:border-primary/30 hover:shadow-sm"
                >
                  <Icon className="size-4 text-primary/60 group-hover:text-primary" />
                  <span className="font-medium">{trade.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {trade.min_price}–{trade.max_price} €/{trade.unit}
                  </span>
                </Link>
              )
            })}
          </div>
        </section>
      )}
    </>
  )
}
