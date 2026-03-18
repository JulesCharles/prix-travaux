export type PopulationTier = "urban" | "periurban" | "bourg" | "rural"
export type GeographicZone = "perche" | "beauce" | "drouais" | "dunois"

export interface MaterialComparison {
  name: string
  price_range: string
  pros: string
  cons: string
  best_for: string
}

export interface OfficialLink {
  label: string
  url: string
  description: string
}

export interface ExtendedFaqItem {
  question: string
  answer: string
  tier_filter?: PopulationTier | null
  zone_filter?: GeographicZone | null
}

export interface Trade {
  slug: string
  title: string
  min_price: number
  max_price: number
  unit: string
  description_template: string
  technical_details: string[]
  faq: { question: string; answer: string }[]
  process_steps: string[]
  timeline_template: string
  materials_comparison: MaterialComparison[]
  financing_guide: string
  seasonal_advice: string
  official_links: OfficialLink[]
  extended_faq: ExtendedFaqItem[]
  tier_content: Record<PopulationTier, string>
  zone_content: Record<GeographicZone, string>
  related_trades?: string[]
  is_emergency?: boolean
}

export interface City {
  slug: string
  name: string
  zip: string
  population: number
  coordinates: { lat: number; lng: number }
  neighboring_cities_slugs: string[]
  department: string
  region_description: string
  population_tier: PopulationTier
  geographic_zone: GeographicZone
  architectural_style: string
  climate_note: string
  local_highlight: string
}

export interface LeadFormData {
  name: string
  phone: string
  email: string
  zip: string
  trade: string
  surface: number
  message: string
}

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  author: string
  tags: string[]
  related_trades: string[]
}

export interface ComparatifOption {
  name: string
  price_range: string
  pros: string[]
  cons: string[]
  best_for: string
}

export interface ComparatifCriterion {
  name: string
  option_a_score: string
  option_b_score: string
  option_c_score?: string
  winner: string
}

export interface Comparatif {
  slug: string
  title: string
  meta_description: string
  intro: string
  option_a: ComparatifOption
  option_b: ComparatifOption
  option_c?: ComparatifOption
  criteria: ComparatifCriterion[]
  verdict: string
  related_trades: string[]
  tags: string[]
}
