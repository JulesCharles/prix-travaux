import type { Trade, City, BlogPost, ExtendedFaqItem, Comparatif } from "./types"
import tradesData from "@/data/trades.json"
import citiesData from "@/data/cities.json"
import blogPostsData from "@/data/blog-posts.json"
import comparatifsData from "@/data/comparatifs.json"

export const trades: Trade[] = tradesData as Trade[]
export const cities: City[] = citiesData as City[]
export const blogPosts: BlogPost[] = blogPostsData as BlogPost[]
export const comparatifs: Comparatif[] = comparatifsData as Comparatif[]

export function getTrade(slug: string): Trade | undefined {
  return trades.find((t) => t.slug === slug)
}

export function getCity(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug)
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug)
}

export function getNeighboringCities(city: City): City[] {
  return city.neighboring_cities_slugs
    .map((slug) => getCity(slug))
    .filter((c): c is City => c !== undefined)
}

export function getAllTradesCityCombinations(): { trade: string; city: string }[] {
  return trades.flatMap((trade) =>
    cities.map((city) => ({ trade: trade.slug, city: city.slug }))
  )
}

export function interpolateTemplate(template: string, trade: Trade, city: City): string {
  return template
    .replace(/{city}/g, city.name)
    .replace(/{min_price}/g, String(trade.min_price))
    .replace(/{max_price}/g, String(trade.max_price))
    .replace(/{unit}/g, trade.unit)
    .replace(/{department}/g, city.department)
    .replace(/{zip}/g, city.zip)
    .replace(/{population}/g, city.population.toLocaleString("fr-FR"))
    .replace(/{population_tier}/g, city.population_tier)
    .replace(/{architectural_style}/g, city.architectural_style)
    .replace(/{climate_note}/g, city.climate_note)
}

/** Regional coefficient based on population density — small villages cost slightly more */
export function getRegionalCoefficient(city: City): number {
  if (city.population >= 10000) return 1.0
  if (city.population >= 2000) return 1.05
  if (city.population >= 1000) return 1.08
  return 1.12
}

/** Get top N cities sorted by population descending */
export function getTopCities(n: number): City[] {
  return [...cities].sort((a, b) => b.population - a.population).slice(0, n)
}

/** Get all cities sorted by population descending */
export function getCitiesSorted(): City[] {
  return [...cities].sort((a, b) => b.population - a.population)
}

/** Get the tier-specific paragraph for a trade × city combination (interpolated) */
export function getTierContent(trade: Trade, city: City): string {
  const raw = trade.tier_content[city.population_tier] ?? ""
  return interpolateTemplate(raw, trade, city)
}

/** Get the zone-specific paragraph for a trade × city combination (interpolated) */
export function getZoneContent(trade: Trade, city: City): string {
  const raw = trade.zone_content[city.geographic_zone] ?? ""
  return interpolateTemplate(raw, trade, city)
}

/** Get extended FAQ items filtered by city tier and zone, merged with base FAQ */
export function getExtendedFaq(trade: Trade, city: City): ExtendedFaqItem[] {
  return trade.extended_faq.filter((item) => {
    if (item.tier_filter && item.tier_filter !== city.population_tier) return false
    if (item.zone_filter && item.zone_filter !== city.geographic_zone) return false
    return true
  })
}

/**
 * Interpolate template for department-level pages (trade hubs).
 * Handles French grammar: "à Eure-et-Loir" → "en Eure-et-Loir",
 * and replaces {city} with "Eure-et-Loir".
 */
export function interpolateForDepartment(template: string, trade: Trade): string {
  return template
    .replace(/{city}/g, "Eure-et-Loir")
    .replace(/{min_price}/g, String(trade.min_price))
    .replace(/{max_price}/g, String(trade.max_price))
    .replace(/{unit}/g, trade.unit)
    .replace(/{department}/g, "28")
    .replace(/\bà Eure-et-Loir\b/g, "en Eure-et-Loir")
    .replace(/\bde Eure-et-Loir\b/g, "d'Eure-et-Loir")
}

/** Get a comparatif by slug */
export function getComparatif(slug: string): Comparatif | undefined {
  return comparatifs.find((c) => c.slug === slug)
}

/** Get trades flagged as emergency services */
export function getEmergencyTrades(): Trade[] {
  return trades.filter((t) => t.is_emergency)
}

/** Get related trades for a given trade */
export function getRelatedTrades(trade: Trade): Trade[] {
  if (!trade.related_trades) return []
  return trade.related_trades
    .map((slug) => getTrade(slug))
    .filter((t): t is Trade => t !== undefined)
}

/** Get all urgence (emergency) trade × city combinations */
export function getAllUrgenceCombinations(): { trade: string; city: string }[] {
  const emergencyTrades = getEmergencyTrades()
  return emergencyTrades.flatMap((trade) =>
    cities.map((city) => ({ trade: trade.slug, city: city.slug }))
  )
}
