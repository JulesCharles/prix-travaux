import type { Metadata } from "next"
import { Libre_Franklin, Instrument_Sans } from "next/font/google"
import "./globals.css"

const libreFranklin = Libre_Franklin({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
})

const instrumentSans = Instrument_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: {
    default: "Prix Travaux 28 — Comparateur de prix travaux en Eure-et-Loir (28)",
    template: "%s | Prix Travaux 28",
  },
  description:
    "Comparez les prix des travaux en Eure-et-Loir (28). Toiture, isolation, plomberie, peinture : devis gratuits d'artisans qualifiés à Chartres, Dreux, Nogent-le-Rotrou et dans tout le département.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://prix-travaux-28.fr"
  ),
  openGraph: {
    siteName: "Prix Travaux 28",
    locale: "fr_FR",
    type: "website",
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
      <body
        className={`${instrumentSans.variable} ${libreFranklin.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
