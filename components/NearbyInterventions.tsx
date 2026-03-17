import Link from "next/link"
import { MapPin, ArrowRight } from "lucide-react"
import type { City, Trade } from "@/lib/types"
import { getNeighboringCities } from "@/lib/data"
import { Badge } from "@/components/ui/badge"

interface NearbyInterventionsProps {
  trade: Trade
  city: City
}

export function NearbyInterventions({ trade, city }: NearbyInterventionsProps) {
  const neighbors = getNeighboringCities(city)

  if (neighbors.length === 0) return null

  return (
    <section className="py-10">
      <h2 className="mb-6 font-heading text-xl font-bold">
        {trade.title} dans les communes voisines de {city.name}
      </h2>

      {/* Trade-specific links to neighboring cities */}
      <div className="mb-6 flex flex-wrap gap-2">
        {neighbors.map((neighbor) => (
          <Link
            key={neighbor.slug}
            href={`/prix/${trade.slug}/${neighbor.slug}`}
            className="group"
          >
            <Badge
              variant="outline"
              className="cursor-pointer px-3.5 py-1.5 text-sm transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
            >
              Prix {trade.title} {neighbor.name}
            </Badge>
          </Link>
        ))}
      </div>

      {/* Cross-links to city hub pages */}
      <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
        <p className="mb-3 text-sm font-semibold text-foreground">
          Tous les travaux dans les communes voisines
        </p>
        <div className="flex flex-wrap gap-2">
          {neighbors.map((neighbor) => (
            <Link
              key={`hub-${neighbor.slug}`}
              href={`/ville/${neighbor.slug}`}
              className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <MapPin className="size-3" />
              {neighbor.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Link back to trade hub */}
      <div className="mt-4">
        <Link
          href={`/prix/${trade.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
        >
          Voir tous les prix {trade.title} en Eure-et-Loir
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </section>
  )
}
