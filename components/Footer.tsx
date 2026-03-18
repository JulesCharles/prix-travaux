import Link from "next/link"
import Image from "next/image"
import { trades, getTopCities, blogPosts } from "@/lib/data"

const TOP_CITIES_PER_TRADE = 6
const FOOTER_TRADES_COL3 = 6 // max trades shown in 3rd column

export function Footer() {
  const currentYear = new Date().getFullYear()
  const topCities = getTopCities(TOP_CITIES_PER_TRADE)
  const footerColumnTrades = trades.slice(0, 2) // first 2 get their own columns
  const otherTrades = trades.slice(2, 2 + FOOTER_TRADES_COL3)
  const recentPosts = [...blogPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)

  return (
    <footer className="border-t border-border/60 bg-foreground/[0.03]">
      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* Link grid */}
        <div className="mb-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Trades + cities columns */}
          {footerColumnTrades.map((trade) => (
            <div key={trade.slug}>
              <h3 className="mb-3 font-heading text-sm font-bold tracking-wide">
                <Link
                  href={`/prix/${trade.slug}`}
                  className="transition-colors hover:text-primary"
                >
                  Prix {trade.title}
                </Link>
              </h3>
              <ul className="space-y-1.5">
                {topCities.map((city) => (
                  <li key={city.slug}>
                    <Link
                      href={`/prix/${trade.slug}/${city.slug}`}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {trade.title} {city.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href={`/prix/${trade.slug}`}
                    className="text-sm font-semibold text-primary"
                  >
                    Tous les prix {trade.title.toLowerCase()} →
                  </Link>
                </li>
              </ul>
            </div>
          ))}

          {/* Department + other trades */}
          <div>
            <h3 className="mb-3 font-heading text-sm font-bold tracking-wide">
              <Link
                href="/eure-et-loir"
                className="transition-colors hover:text-primary"
              >
                Eure-et-Loir (28)
              </Link>
            </h3>
            <ul className="space-y-1.5">
              <li>
                <Link
                  href="/prix"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Tous les métiers
                </Link>
              </li>
              {otherTrades.map((trade) => (
                <li key={trade.slug}>
                  <Link
                    href={`/prix/${trade.slug}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    Prix {trade.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/prix"
                  className="text-sm font-semibold text-primary"
                >
                  Tous les métiers →
                </Link>
              </li>
            </ul>
          </div>

          {/* Guides + new pages */}
          <div>
            <h3 className="mb-3 font-heading text-sm font-bold tracking-wide">
              Guides & ressources
            </h3>
            <ul className="mb-6 space-y-1.5">
              <li>
                <Link
                  href="/guide"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Guides rénovation par ville
                </Link>
              </li>
              <li>
                <Link
                  href="/aides"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Aides financières
                </Link>
              </li>
              <li>
                <Link
                  href="/urgence"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Urgences travaux
                </Link>
              </li>
              <li>
                <Link
                  href="/comparatif"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Comparatifs matériaux
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm font-semibold text-primary"
                >
                  Blog
                </Link>
              </li>
              {recentPosts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="text-xs leading-relaxed text-muted-foreground/70">
              Guide indépendant des prix des travaux en Eure-et-Loir.
              Estimations basées sur les tarifs constatés auprès des artisans
              locaux.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 sm:flex-row">
          <div className="flex items-center">
            <Image
              src="/assets/logo.png"
              alt="Prix Travaux 28"
              width={140}
              height={40}
              className="h-9 w-auto"
            />
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground/70">
            <Link
              href="/mentions-legales"
              className="transition-colors hover:text-primary"
            >
              Mentions légales
            </Link>
            <span className="text-border">|</span>
            <Link
              href="/contact"
              className="transition-colors hover:text-primary"
            >
              Contact
            </Link>
            <span className="text-border">|</span>
            <Link
              href="/a-propos"
              className="transition-colors hover:text-primary"
            >
              À propos
            </Link>
          </div>
          <p className="text-xs text-muted-foreground/70">
            &copy; {currentYear} Prix Travaux 28. Guide indicatif — les prix
            peuvent varier selon les artisans et la complexité du chantier.
          </p>
        </div>
      </div>
    </footer>
  )
}
