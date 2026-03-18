import type { Metadata } from "next"
import Script from "next/script"
import { Libre_Franklin, Instrument_Sans } from "next/font/google"
import "./globals.css"

const libreFranklin = Libre_Franklin({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
})

const instrumentSans = Instrument_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
})

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://prix-travaux-28.fr"

export const metadata: Metadata = {
  title: {
    default: "Prix Travaux 28 — Comparateur de prix travaux en Eure-et-Loir (28)",
    template: "%s | Prix Travaux 28",
  },
  description:
    "Comparez les prix des travaux en Eure-et-Loir (28). Toiture, isolation, plomberie, peinture : devis gratuits d'artisans qualifiés à Chartres, Dreux, Nogent-le-Rotrou et dans tout le département.",
  metadataBase: new URL(BASE_URL),
  verification: {
    google: "2vat9KzWXaPVWbBQrMoe2O4t05ll8FeMOCHIyGfBXWA",
  },
  openGraph: {
    siteName: "Prix Travaux 28",
    locale: "fr_FR",
    type: "website",
    url: BASE_URL,
    description:
      "Comparez les prix des travaux en Eure-et-Loir (28). Devis gratuits d'artisans qualifiés.",
    images: [
      {
        url: `${BASE_URL}/images/og-default.jpg`,
        width: 1200,
        height: 630,
        alt: "Prix Travaux 28 — Comparateur de prix travaux en Eure-et-Loir",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Prix Travaux 28 — Comparateur de prix en Eure-et-Loir",
    description:
      "Comparez les prix des travaux en Eure-et-Loir (28). Devis gratuits d'artisans qualifiés.",
    images: [`${BASE_URL}/images/og-default.jpg`],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Prix Travaux 28",
              url: BASE_URL,
              description:
                "Observatoire indépendant des prix du bâtiment en Eure-et-Loir (28). Comparateur de prix travaux, devis gratuits d'artisans qualifiés.",
              areaServed: {
                "@type": "AdministrativeArea",
                name: "Eure-et-Loir",
                addressCountry: "FR",
              },
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "Service client",
                url: `${BASE_URL}/contact`,
                availableLanguage: "fr",
              },
            }),
          }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-4J9M2TK94H"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-4J9M2TK94H');
          `}
        </Script>
      </head>
      <body
        className={`${instrumentSans.variable} ${libreFranklin.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
