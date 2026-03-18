"use client"

import Link from "next/link"
import { AlertTriangle, Home, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-red-50">
        <AlertTriangle className="size-8 text-red-600" aria-hidden="true" />
      </div>

      <h1 className="mb-2 font-heading text-2xl font-bold">
        Une erreur est survenue
      </h1>
      <p className="mb-8 max-w-md text-sm text-muted-foreground">
        Nous rencontrons un problème technique. Veuillez réessayer ou revenir à
        la page d&apos;accueil.
      </p>

      <div className="flex gap-3">
        <Button onClick={reset} variant="outline" className="gap-2">
          Réessayer
        </Button>
        <Link href="/">
          <Button className="gap-2">
            <Home className="size-4" aria-hidden="true" />
            Accueil
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
