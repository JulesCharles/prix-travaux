import type { Trade, City } from "./types"

const tradeCityTitles = [
  "Prix {trade} à {city} ({zip}) — Tarifs {year}",
  "{trade} à {city} : prix et devis gratuit ({year})",
  "Coût {trade} à {city} ({zip}) — Estimation {year}",
  "Tarif {trade} à {city} — Guide des prix {year}",
  "{trade} à {city} : combien ça coûte en {year} ?",
]

const tradeCityDescriptions = [
  "Découvrez les prix de {trade_lower} à {city} en {year}. De {min} € à {max} €/{unit}. Comparez les devis d'artisans qualifiés en Eure-et-Loir gratuitement.",
  "Prix {trade_lower} à {city} ({zip}) : de {min} € à {max} €/{unit} en {year}. Estimation gratuite, artisans certifiés en Eure-et-Loir.",
  "Combien coûte la {trade_lower} à {city} ? Tarifs de {min} à {max} €/{unit}. Devis gratuits d'artisans locaux — {year}.",
  "Guide des prix {trade_lower} à {city} ({zip}). Budget moyen, aides disponibles et devis gratuit. Mis à jour en {year}.",
]

function deterministicHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

function applyReplacements(template: string, replacements: Record<string, string>): string {
  let result = template
  for (const [key, value] of Object.entries(replacements)) {
    result = result.replaceAll(key, value)
  }
  return result
}

export function getTradeCityMeta(trade: Trade, city: City) {
  const seed = `${trade.slug}-${city.slug}`
  const hash = deterministicHash(seed)
  const year = String(new Date().getFullYear())

  const replacements: Record<string, string> = {
    "{trade}": trade.title,
    "{trade_lower}": trade.title.toLowerCase(),
    "{city}": city.name,
    "{zip}": city.zip,
    "{year}": year,
    "{min}": String(trade.min_price),
    "{max}": String(trade.max_price),
    "{unit}": trade.unit,
  }

  const title = applyReplacements(
    tradeCityTitles[hash % tradeCityTitles.length],
    replacements
  )
  const description = applyReplacements(
    tradeCityDescriptions[hash % tradeCityDescriptions.length],
    replacements
  )

  return { title, description }
}
