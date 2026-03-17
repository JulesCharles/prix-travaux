import Link from "next/link"
import { ArrowRight, MapPin, Home } from "lucide-react"
import { Header } from "@/components/Header"
import { TrustBar } from "@/components/TrustBar"
import { Footer } from "@/components/Footer"
import { trades, getTopCities } from "@/lib/data"
import { tradeIcons } from "@/lib/trade-icons"

const topTrades = trades.slice(0, 5)
const topCities = getTopCities(5)

export default function NotFound() {
  return (
    <>
      <Header />
      <TrustBar />

      <main className="mx-auto max-w-4xl px-4 py-16 sm:py-24">
        {/* Hero section */}
        <div className="mb-12 text-center">
          <p className="mb-4 font-heading text-7xl font-bold text-primary sm:text-8xl">
            404
          </p>
          <h1 className="mb-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Page introuvable
          </h1>
          <p className="mx-auto max-w-lg text-base leading-relaxed text-muted-foreground">
            La page que vous recherchez n&apos;existe pas ou a ete deplacee.
            Retrouvez nos guides de prix et nos pages villes ci-dessous.
          </p>
        </div>

        {/* Links grid */}
        <div className="mb-12 grid gap-8 sm:grid-cols-2">
          {/* Top trades */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="mb-4 flex items-center gap-2 font-heading text-lg font-bold">
              <Home className="size-5 text-primary" />
              Nos guides de prix
            </h2>
            <ul className="space-y-2">
              {topTrades.map((trade) => {
                const Icon = tradeIcons[trade.slug]
                return (
                  <li key={trade.slug}>
                    <Link
                      href={`/prix/${trade.slug}/`}
                      className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
                    >
                      {Icon && (
                        <Icon className="size-4 shrink-0 text-primary" />
                      )}
                      <span className="flex-1">Prix {trade.title}</span>
                      <ArrowRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Top cities */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="mb-4 flex items-center gap-2 font-heading text-lg font-bold">
              <MapPin className="size-5 text-primary" />
              Villes principales
            </h2>
            <ul className="space-y-2">
              {topCities.map((city) => (
                <li key={city.slug}>
                  <Link
                    href={`/ville/${city.slug}/`}
                    className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
                  >
                    <MapPin className="size-4 shrink-0 text-primary" />
                    <span className="flex-1">
                      {city.name} ({city.zip})
                    </span>
                    <ArrowRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-heading text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Home className="size-4" />
            Retour a l&apos;accueil
          </Link>
        </div>
      </main>

      <Footer />
    </>
  )
}
