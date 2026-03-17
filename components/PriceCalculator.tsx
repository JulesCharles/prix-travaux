"use client"

import { useState, useMemo, useEffect } from "react"
import { Users } from "lucide-react"
import { Calculator, ArrowRight, CheckCircle, Loader2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"

interface PriceCalculatorProps {
  tradeSlug: string
  tradeTitle: string
  minPrice: number
  maxPrice: number
  unit: string
  cityName: string
  cityZip: string
  regionalCoefficient: number
}

type Step = "calculator" | "contact" | "success"

export function PriceCalculator({
  tradeSlug,
  tradeTitle,
  minPrice,
  maxPrice,
  unit,
  cityName,
  cityZip,
  regionalCoefficient,
}: PriceCalculatorProps) {
  const [surface, setSurface] = useState(50)
  const [step, setStep] = useState<Step>("calculator")
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [rgpdConsent, setRgpdConsent] = useState(false)
  const [website, setWebsite] = useState("")

  const avgPrice = (minPrice + maxPrice) / 2
  const estimateLow = Math.round(surface * minPrice * regionalCoefficient)
  const estimateHigh = Math.round(surface * maxPrice * regionalCoefficient)
  const estimateAvg = Math.round(surface * avgPrice * regionalCoefficient)

  const maxAmount = useMemo(() => {
    if (unit === "h") return 100
    if (unit === "ml") return 200
    return 500
  }, [unit])

  const amountLabel = useMemo(() => {
    if (unit === "h") return "Nombre d'heures estimées"
    if (unit === "ml") return "Longueur du projet"
    return "Surface du projet"
  }, [unit])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    setError(null)

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          zip: cityZip,
          trade: tradeSlug,
          surface,
          message,
          website,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Erreur lors de l'envoi")
      }

      setStep("success")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue")
    } finally {
      setSending(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="size-5" />
          Estimez le prix de votre {tradeTitle.toLowerCase()} à {cityName}
        </CardTitle>
        <CardDescription>
          Calcul instantané basé sur les tarifs locaux d'Eure-et-Loir
        </CardDescription>
      </CardHeader>

      <CardContent>
        {step === "calculator" && (
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="surface">{amountLabel}</Label>
                <span className="text-sm font-semibold tabular-nums">
                  {surface} {unit}
                </span>
              </div>
              <Slider
                id="surface"
                min={1}
                max={maxAmount}
                value={[surface]}
                onValueChange={(val) => setSurface(Array.isArray(val) ? val[0] : val)}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1 {unit}</span>
                <span>{maxAmount} {unit}</span>
              </div>
            </div>

            <Separator />

            <div className="rounded-lg bg-muted/50 p-4">
              <p className="mb-1 text-sm text-muted-foreground">
                Estimation pour {surface} {unit} à {cityName}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold tabular-nums tracking-tight">
                  {estimateAvg.toLocaleString("fr-FR")} €
                </span>
                <span className="text-sm text-muted-foreground">prix moyen</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Fourchette : {estimateLow.toLocaleString("fr-FR")} € — {estimateHigh.toLocaleString("fr-FR")} €
              </p>
            </div>

            <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <Users className="size-3" />
              <span>
                <strong className="font-semibold text-foreground">
                  {Math.max(8, Math.min(65, Math.round(parseInt(cityZip.slice(-3)) / 6 + 12)))}
                </strong>{" "}
                propriétaires ont estimé leur projet cette semaine à {cityName}
              </span>
            </p>

            <Button
              size="lg"
              className="w-full transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              onClick={() => setStep("contact")}
            >
              Obtenir un devis détaillé
              <ArrowRight data-icon="inline-end" className="size-4" />
            </Button>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Réponse sous 24h — Gratuit et sans engagement
            </p>
          </div>
        )}

        {step === "contact" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Recevez jusqu'à 3 devis gratuits d'artisans qualifiés à {cityName} pour votre projet de {surface} {unit}.
            </p>

            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                required
                minLength={2}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jean Dupont"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="06 12 34 56 78"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jean@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message (optionnel)</Label>
              <textarea
                id="message"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Décrivez votre projet..."
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>

            <div className="absolute -left-[9999px] -top-[9999px]" aria-hidden="true">
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="rgpd-consent"
                required
                checked={rgpdConsent}
                onChange={(e) => setRgpdConsent(e.target.checked)}
                className="mt-1 size-4 shrink-0 rounded border-border accent-primary"
              />
              <Label htmlFor="rgpd-consent" className="cursor-pointer text-xs leading-relaxed text-muted-foreground">
                En validant, j'accepte que mes données soient transmises à des
                professionnels pour l'établissement de devis.{" "}
                <a href="/mentions-legales" className="text-primary underline underline-offset-2 hover:text-primary/80">
                  Politique de confidentialité
                </a>.
              </Label>
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep("calculator")}
              >
                Retour
              </Button>
              <Button type="submit" className="flex-1" disabled={sending}>
                {sending && <Loader2 className="size-4 animate-spin" />}
                {sending ? "Envoi..." : "Recevoir mes devis gratuits"}
              </Button>
            </div>
          </form>
        )}

        {step === "success" && (
          <div className="space-y-4 py-6 text-center">
            <CheckCircle className="mx-auto size-12 text-green-600" />
            <div>
              <p className="text-lg font-semibold">Demande envoyée !</p>
              <p className="text-sm text-muted-foreground">
                Vous serez contacté sous 24h par des artisans qualifiés de {cityName}.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
