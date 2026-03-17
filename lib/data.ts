import type { Trade, City, BlogPost } from "./types"
import tradesData from "@/data/trades.json"
import citiesData from "@/data/cities.json"
import blogPostsData from "@/data/blog-posts.json"

export const trades: Trade[] = tradesData as Trade[]
export const cities: City[] = citiesData as City[]
export const blogPosts: BlogPost[] = blogPostsData as BlogPost[]

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
