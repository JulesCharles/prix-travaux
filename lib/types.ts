export interface Trade {
  slug: string
  title: string
  min_price: number
  max_price: number
  unit: string
  description_template: string
  technical_details: string[]
  faq: { question: string; answer: string }[]
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
