import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Prix Travaux 28",
    short_name: "Prix Travaux 28",
    description:
      "Comparateur de prix travaux en Eure-et-Loir (28). Devis gratuits d'artisans qualifiés.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf9f6",
    theme_color: "#2d5a27",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}
