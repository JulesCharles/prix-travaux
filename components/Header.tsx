"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, Menu, X } from "lucide-react"
import { trades, getTopCities } from "@/lib/data"
import { tradeIcons } from "@/lib/trade-icons"

const topCities = getTopCities(10)

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-card/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/assets/logo.png"
            alt="Prix Travaux 28"
            width={180}
            height={52}
            className="h-11 w-auto sm:h-12"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link
            href="/prix"
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Prix
          </Link>

          {/* Métiers dropdown */}
          <div className="group relative">
            <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              Métiers
              <ChevronDown className="size-3.5 transition-transform group-hover:rotate-180" />
            </button>
            <div className="invisible absolute left-0 top-full z-50 min-w-[240px] pt-1 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
              <div className="rounded-xl border border-border/60 bg-card p-2 shadow-lg">
                {trades.map((trade) => {
                  const Icon = tradeIcons[trade.slug] ?? ChevronDown
                  return (
                    <Link
                      key={trade.slug}
                      href={`/prix/${trade.slug}`}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted"
                    >
                      <Icon className="size-4 text-primary" />
                      <span className="font-medium">{trade.title}</span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {trade.min_price}–{trade.max_price} €
                      </span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Villes dropdown */}
          <div className="group relative">
            <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              Villes
              <ChevronDown className="size-3.5 transition-transform group-hover:rotate-180" />
            </button>
            <div className="invisible absolute left-0 top-full z-50 min-w-[220px] pt-1 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
              <div className="rounded-xl border border-border/60 bg-card p-2 shadow-lg">
                {topCities.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/ville/${city.slug}`}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted"
                  >
                    <span className="font-medium">{city.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {city.zip}
                    </span>
                  </Link>
                ))}
                <Link
                  href="/eure-et-loir"
                  className="mt-1 flex items-center gap-1 rounded-lg border-t px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-muted"
                >
                  Toutes les communes
                </Link>
              </div>
            </div>
          </div>

          <Link
            href="/eure-et-loir"
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Eure-et-Loir
          </Link>

          <Link
            href="/blog"
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Blog
          </Link>

          <Link
            href="/a-propos"
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            À propos
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted md:hidden"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border/60 bg-card px-4 pb-4 pt-2 md:hidden">
          <nav className="space-y-1">
            <Link
              href="/prix"
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
            >
              Tous les prix
            </Link>
            <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Métiers
            </div>
            {trades.map((trade) => (
              <Link
                key={trade.slug}
                href={`/prix/${trade.slug}`}
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted"
              >
                {trade.title}
              </Link>
            ))}
            <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Villes
            </div>
            {topCities.slice(0, 6).map((city) => (
              <Link
                key={city.slug}
                href={`/ville/${city.slug}`}
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted"
              >
                {city.name}
              </Link>
            ))}
            <Link
              href="/eure-et-loir"
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-muted"
            >
              Toutes les communes
            </Link>
            <Link
              href="/blog"
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
            >
              Blog
            </Link>
            <Link
              href="/a-propos"
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
            >
              À propos
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
