import type { Trade, City } from "@/lib/types"
import { interpolateTemplate } from "@/lib/data"

interface JsonLdProps {
  trade: Trade
  city: City
}

export function JsonLd({ trade, city }: JsonLdProps) {
  const currentYear = new Date().getFullYear()

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `${trade.title} - ${city.name}`,
    description: `Comparez les prix de ${trade.title.toLowerCase()} à ${city.name} (${city.zip}). Devis gratuit auprès d'artisans qualifiés du Perche.`,
    areaServed: {
      "@type": "City",
      name: city.name,
      postalCode: city.zip,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: city.coordinates.lat,
      longitude: city.coordinates.lng,
    },
    priceRange: `${trade.min_price}€ - ${trade.max_price}€/${trade.unit}`,
  }

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: trade.faq.map((item) => ({
      "@type": "Question",
      name: interpolateTemplate(item.question, trade, city),
      acceptedAnswer: {
        "@type": "Answer",
        text: interpolateTemplate(item.answer, trade, city),
      },
    })),
  }

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Prix ${trade.title} ${city.name} (${city.zip}) - Tarifs ${currentYear}`,
    description: `Estimez le coût de ${trade.title.toLowerCase()} à ${city.name}. Prix de ${trade.min_price}€ à ${trade.max_price}€/${trade.unit}. Devis gratuit.`,
    dateModified: new Date().toISOString().split("T")[0],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPage) }}
      />
    </>
  )
}
