import type { MetadataRoute } from "next"
import { trades, cities, blogPosts } from "@/lib/data"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://prix-travaux-28.fr"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // Homepage
  const homepage: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
  ]

  // Department page
  const department: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/eure-et-loir`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
  ]

  // /prix hub
  const prixHub: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/prix`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
  ]

  // Trade hubs: /prix/[trade]
  const tradeHubs: MetadataRoute.Sitemap = trades.map((trade) => ({
    url: `${BASE_URL}/prix/${trade.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }))

  // City hubs: /ville/[city]
  const cityHubs: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${BASE_URL}/ville/${city.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }))

  // Trade + City pages: /prix/[trade]/[city]
  const tradeCityPages: MetadataRoute.Sitemap = trades.flatMap((trade) =>
    cities.map((city) => ({
      url: `${BASE_URL}/prix/${trade.slug}/${city.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }))
  )

  // Blog index
  const blogIndex: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
  ]

  // Blog posts
  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  // Legal & info pages
  const legalPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/mentions-legales`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.5 },
    { url: `${BASE_URL}/a-propos`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.5 },
  ]

  return [
    ...homepage,
    ...department,
    ...prixHub,
    ...tradeHubs,
    ...cityHubs,
    ...tradeCityPages,
    ...blogIndex,
    ...blogPages,
    ...legalPages,
  ]
}
