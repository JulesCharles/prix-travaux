"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HomeSearchProps {
  trades: { slug: string; title: string }[]
  cities: { slug: string; name: string }[]
}

export function HomeSearch({ trades, cities }: HomeSearchProps) {
  const router = useRouter()
  const [trade, setTrade] = useState(trades[0]?.slug ?? "")
  const [city, setCity] = useState(cities[0]?.slug ?? "")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (trade && city) {
      router.push(`/prix/${trade}/${city}`)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 sm:flex-row sm:items-end"
    >
      <div className="flex-1 space-y-1.5">
        <label
          htmlFor="trade-select"
          className="block text-sm font-medium text-foreground/70"
        >
          Type de travaux
        </label>
        <select
          id="trade-select"
          value={trade}
          onChange={(e) => setTrade(e.target.value)}
          className="h-11 w-full rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          {trades.map((t) => (
            <option key={t.slug} value={t.slug}>
              {t.title}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 space-y-1.5">
        <label
          htmlFor="city-select"
          className="block text-sm font-medium text-foreground/70"
        >
          Commune
        </label>
        <select
          id="city-select"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="h-11 w-full rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          {cities.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <Button
        type="submit"
        size="lg"
        className="h-11 gap-2 px-6 text-sm font-semibold"
      >
        <Search className="size-4" />
        Comparer les prix
      </Button>
    </form>
  )
}
