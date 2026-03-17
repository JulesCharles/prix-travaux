import Link from "next/link"
import {
  ArrowRight,
  ClipboardList,
  GitCompare,
  Handshake,
  Home,
  MapPin,
  ShieldCheck,
  Users,
  Star,
  BookOpen,
} from "lucide-react"
import { Database, Award, RefreshCw } from "lucide-react"
import { trades, cities, getTopCities } from "@/lib/data"
import { tradeIcons } from "@/lib/trade-icons"
import { Header } from "@/components/Header"
import { TrustBar } from "@/components/TrustBar"
import { Footer } from "@/components/Footer"
import { HomeSearch } from "@/components/HomeSearch"
import { RecentActivity } from "@/components/RecentActivity"

const topCities = getTopCities(12)

const steps = [
  {
    icon: ClipboardList,
    title: "Estimez",
    description:
      "Renseignez votre type de travaux et votre commune pour obtenir une estimation instantanée basée sur les prix locaux.",
  },
  {
    icon: GitCompare,
    title: "Comparez",
    description:
      "Recevez jusqu'à 3 devis gratuits d'artisans qualifiés et certifiés de votre secteur dans le Perche.",
  },
  {
    icon: Handshake,
    title: "Choisissez",
    description:
      "Sélectionnez l'artisan qui correspond à vos attentes en toute transparence, sans engagement.",
  },
]

const stats = [
  { value: "150+", label: "Artisans partenaires", icon: Users },
  { value: "100%", label: "Gratuit & sans engagement", icon: ShieldCheck },
  { value: "4.8/5", label: "Satisfaction client", icon: Star },
]

export default function HomePage() {
  return (
    <>
      <Header />
      <TrustBar />

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden border-b border-border/40">
        {/* Decorative background */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--primary)_0%,transparent_60%)] opacity-[0.04]" />
        <div className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 size-72 rounded-full bg-primary/5 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 pb-12 pt-12 sm:pb-16 sm:pt-16">
          <div className="mx-auto max-w-2xl text-center animate-fade-in">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary">
              Guide des prix &middot; Eure-et-Loir (28)
            </p>
            <h1 className="font-heading text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl">
              Prix des travaux
              <br />
              <span className="text-primary">en Eure-et-Loir</span>
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              Comparez les tarifs des artisans locaux à Chartres, Dreux,
              Nogent-le-Rotrou et dans 33 communes du département.
              Estimations gratuites, sans engagement.
            </p>
          </div>

          {/* Search form */}
          <div className="mx-auto mt-10 max-w-2xl rounded-xl border-2 border-border/60 bg-card p-5 shadow-sm animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <HomeSearch
              trades={trades.map((t) => ({ slug: t.slug, title: t.title }))}
              cities={cities.map((c) => ({ slug: c.slug, name: c.name }))}
            />
          </div>
        </div>
      </section>

      {/* ─── Recent Activity ─── */}
      <div className="mx-auto max-w-2xl px-4 py-3 animate-fade-in" style={{ animationDelay: "0.4s" }}>
        <RecentActivity seed="homepage" />
      </div>

      {/* ─── Stats ─── */}
      <section className="border-b border-border/40 bg-card/50">
        <div className="mx-auto grid max-w-4xl grid-cols-1 divide-y divide-border/40 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {stats.map(({ value, label, icon: Icon }, i) => (
            <div
              key={label}
              className="flex items-center justify-center gap-3 px-6 py-6 animate-slide-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex size-9 items-center justify-center rounded-full bg-primary/10">
                <Icon className="size-4.5 text-primary" />
              </div>
              <div>
                <span className="text-lg font-bold text-foreground">
                  {value}
                </span>
                <span className="ml-1.5 text-sm text-muted-foreground">
                  {label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Trades Grid ─── */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div className="mb-10 text-center">
          <h2 className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Nos guides de prix
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sélectionnez un corps de métier pour consulter les tarifs détaillés
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {trades.map((trade, i) => {
            const Icon = tradeIcons[trade.slug] ?? Home
            return (
              <Link
                key={trade.slug}
                href={`/prix/${trade.slug}`}
                className="group relative overflow-hidden rounded-xl border-2 border-border/60 bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md hover:scale-[1.02] animate-fade-in-up"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <div className="pointer-events-none absolute -right-6 -top-6 size-24 rounded-full bg-primary/5 transition-transform group-hover:scale-150" />
                <div className="relative">
                  <div className="mb-4 flex size-11 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="size-5 text-primary" />
                  </div>
                  <h3 className="font-heading text-xl text-foreground">
                    {trade.title}
                  </h3>
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
                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
                    Voir les prix
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section className="border-y border-border/40 bg-foreground/[0.02]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <div className="mb-12 text-center">
            <h2 className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Comment ça marche
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              3 étapes simples pour trouver votre artisan
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {steps.map(({ icon: Icon, title, description }, i) => (
              <div key={title} className="text-center animate-fade-in-up" style={{ animationDelay: `${i * 0.12}s` }}>
                <div className="relative mx-auto mb-5 flex size-14 items-center justify-center rounded-full border-2 border-primary/20 bg-card">
                  <Icon className="size-6 text-primary" />
                  <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-heading text-lg text-foreground">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── E-E-A-T Section ─── */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div className="mb-10 text-center">
          <h2 className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Observatoire indépendant des prix du bâtiment
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Nos estimations reposent sur des tarifs réels collectés auprès
            d'artisans exerçant en Eure-et-Loir, actualisés chaque trimestre et
            ajustés par commune.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          {[
            {
              icon: Database,
              title: "Données locales vérifiées",
              desc: "Tarifs issus de devis réels d'artisans du département 28, croisés avec les barèmes FFB et CAPEB.",
            },
            {
              icon: Award,
              title: "Artisans certifiés RGE",
              desc: "Mise en relation exclusive avec des professionnels Qualibat, Qualifelec ou Qualit'EnR.",
            },
            {
              icon: RefreshCw,
              title: "Mise à jour trimestrielle",
              desc: "Prix des matériaux et taux horaires actualisés chaque trimestre pour refléter le marché local.",
            },
          ].map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className="rounded-xl border-2 border-border/60 bg-card p-5 text-center animate-fade-in-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-full bg-primary/10">
                <Icon className="size-5 text-primary" />
              </div>
              <h3 className="mb-1.5 font-heading text-sm font-bold">
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/a-propos"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
          >
            En savoir plus sur notre méthodologie
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </section>

      {/* ─── Cities Grid ─── */}
      <section className="border-t border-border/40 bg-foreground/[0.02]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div className="mb-10 text-center">
          <h2 className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            33 communes couvertes en Eure-et-Loir
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Chartres, Dreux, Nogent-le-Rotrou et toutes les communes du département 28
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {topCities.map((city, i) => (
            <Link
              key={city.slug}
              href={`/ville/${city.slug}`}
              className="group flex items-center gap-3 rounded-lg border-2 border-border/60 bg-card px-4 py-3.5 transition-all hover:border-primary/30 hover:shadow-sm hover:scale-[1.02] animate-fade-in-up"
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <MapPin className="size-4 shrink-0 text-primary/60 transition-colors group-hover:text-primary" />
              <div className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-foreground">
                  {city.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {city.zip} &middot; {city.population.toLocaleString("fr-FR")}{" "}
                  hab.
                </span>
              </div>
              <ArrowRight className="size-3.5 shrink-0 text-muted-foreground/50 transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/eure-et-loir"
            className="inline-flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
          >
            Voir les 33 communes d'Eure-et-Loir
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
        </div>
      </section>

      {/* ─── Blog CTA ─── */}
      <section className="border-t border-border/40 bg-foreground/[0.02]">
        <div className="mx-auto max-w-6xl px-4 py-12 text-center">
          <BookOpen className="mx-auto mb-4 size-8 text-primary/60" />
          <h2 className="font-heading text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
            Guides &amp; conseils travaux
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Aides financières, choix des matériaux, trouver un artisan RGE… nos guides pour réussir vos travaux en Eure-et-Loir.
          </p>
          <Link
            href="/blog"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Lire nos articles
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </section>

      <Footer />
    </>
  )
}
