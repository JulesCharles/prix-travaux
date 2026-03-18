import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, MapPin, Banknote, CheckCircle, FileText, Euro } from "lucide-react"
import { getTopCities } from "@/lib/data"
import { Breadcrumb } from "@/components/Breadcrumb"

export const metadata: Metadata = {
  title: "Aides financières travaux en Eure-et-Loir (28) — Guide complet",
  description:
    "Retrouvez toutes les aides financières pour vos travaux de rénovation en Eure-et-Loir : MaPrimeRénov', éco-PTZ, CEE, ANAH, aides régionales. Montants, conditions et démarches par commune.",
  alternates: { canonical: "/aides" },
}

export default function AidesIndexPage() {
  const allCities = getTopCities(33)
  const year = new Date().getFullYear()

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Accueil", href: "/" },
          { label: "Aides travaux" },
        ]}
      />

      <section className="mb-10">
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
          <Banknote className="size-4" aria-hidden="true" />
          Aides par ville
        </div>
        <h1 className="mb-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Aides financières pour vos travaux en Eure-et-Loir
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
          Découvrez toutes les aides financières disponibles pour vos travaux de
          rénovation dans chaque commune d&apos;Eure-et-Loir. MaPrimeRénov&apos;, éco-PTZ,
          CEE, ANAH et aides régionales : montants, conditions et démarches.
        </p>
      </section>

      {/* ── Principales aides ── */}
      <section className="mb-10">
        <h2 className="mb-5 font-heading text-xl font-bold">
          Les principales aides en {year}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              icon: Euro,
              title: "MaPrimeRénov'",
              amount: "Jusqu'à 20 000 €",
              desc: "Aide de l'État pour la rénovation énergétique. Montant variable selon vos revenus et les travaux réalisés. Accessible à tous les propriétaires occupants et bailleurs.",
              condition: "Logement de plus de 15 ans, artisan RGE obligatoire",
            },
            {
              icon: FileText,
              title: "Éco-PTZ",
              amount: "Jusqu'à 50 000 €",
              desc: "Prêt à taux zéro pour financer vos travaux de rénovation énergétique. Cumulable avec MaPrimeRénov'. Remboursement sur 20 ans maximum.",
              condition: "Logement construit avant 1990, artisan RGE obligatoire",
            },
            {
              icon: CheckCircle,
              title: "Certificats d'économie d'énergie (CEE)",
              amount: "Variable selon travaux",
              desc: "Primes versées par les fournisseurs d'énergie pour l'isolation, le chauffage ou les fenêtres. Cumulables avec MaPrimeRénov' et l'éco-PTZ.",
              condition: "Logement de plus de 2 ans, professionnel qualifié",
            },
            {
              icon: Banknote,
              title: "TVA réduite à 5,5 %",
              amount: "Économie de 14,5 %",
              desc: "Taux de TVA réduit sur les travaux d'amélioration énergétique. S'applique automatiquement sur la facture de l'artisan pour les logements de plus de 2 ans.",
              condition: "Logement de plus de 2 ans, pose par un professionnel",
            },
          ].map((aide) => (
            <div key={aide.title} className="rounded-xl border border-border/60 bg-card p-5">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <aide.icon className="size-5 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">{aide.title}</h3>
                  <p className="text-xs font-semibold text-primary">{aide.amount}</p>
                </div>
              </div>
              <p className="mb-2 text-xs leading-relaxed text-muted-foreground">{aide.desc}</p>
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Condition :</span> {aide.condition}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SEO Content ── */}
      <section className="mb-10">
        <h2 className="mb-4 font-heading text-xl font-bold">
          Cumuler les aides pour réduire le reste à charge
        </h2>
        <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            En Eure-et-Loir, les propriétaires peuvent cumuler plusieurs dispositifs pour
            financer jusqu&apos;à <strong className="text-foreground">90 % du coût de leurs
            travaux de rénovation énergétique</strong>. La combinaison la plus courante
            associe MaPrimeRénov&apos; (aide directe), les CEE (prime énergie), l&apos;éco-PTZ
            (financement du reste à charge) et la TVA à 5,5 %.
          </p>
          <p>
            Le montant des aides dépend de plusieurs critères : <strong className="text-foreground">vos
            revenus fiscaux</strong> (classés en 4 catégories : bleu, jaune, violet, rose),
            la <strong className="text-foreground">nature des travaux</strong> (isolation,
            chauffage, ventilation, audit énergétique) et le <strong className="text-foreground">gain
            énergétique</strong> obtenu. Les ménages aux revenus modestes bénéficient
            des montants les plus élevés.
          </p>
          <p>
            Pour les propriétaires du Perche possédant un patrimoine ancien, le cumul avec
            les aides de la <strong className="text-foreground">Fondation du Patrimoine</strong> est
            parfois possible pour les travaux de restauration respectant le caractère
            architectural d&apos;origine. Dans les secteurs sauvegardés, des subventions
            spécifiques de l&apos;ABF (Architecte des Bâtiments de France) peuvent compléter
            le financement.
          </p>
        </div>
      </section>

      {/* ── Comment bénéficier ── */}
      <section className="mb-10">
        <h2 className="mb-4 font-heading text-xl font-bold">
          Les étapes pour obtenir vos aides
        </h2>
        <ol className="space-y-3">
          {[
            "Réalisez un audit énergétique ou un DPE (Diagnostic de Performance Énergétique) de votre logement.",
            "Identifiez les travaux éligibles aux aides et demandez des devis à des artisans RGE.",
            "Créez votre dossier MaPrimeRénov' sur le site officiel avant de signer les devis.",
            "Demandez votre éco-PTZ auprès de votre banque et vos primes CEE auprès de votre fournisseur d'énergie.",
            "Faites réaliser les travaux, puis transmettez les factures pour recevoir vos aides.",
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      {/* ── City grid ── */}
      <section className="mb-10">
        <h2 className="mb-5 font-heading text-xl font-bold">
          Aides par commune
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {allCities.map((city) => (
            <Link
              key={city.slug}
              href={`/aides/${city.slug}`}
              className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Banknote className="size-4 text-primary" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-foreground">
                  Aides travaux à {city.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {city.zip} · {city.population.toLocaleString("fr-FR")} hab.
                </span>
              </div>
              <ArrowRight className="size-4 shrink-0 text-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="mt-10">
        <h2 className="mb-5 font-heading text-xl font-bold">
          Questions fréquentes sur les aides
        </h2>
        <div className="space-y-5">
          {[
            {
              q: "Puis-je cumuler MaPrimeRénov' et les CEE ?",
              a: "Oui, MaPrimeRénov' et les Certificats d'Économie d'Énergie sont entièrement cumulables. Vous pouvez également y ajouter l'éco-PTZ et la TVA à 5,5 %. Le cumul permet de couvrir jusqu'à 90 % du coût des travaux pour les ménages aux revenus modestes.",
            },
            {
              q: "Faut-il obligatoirement un artisan RGE ?",
              a: "Pour MaPrimeRénov' et l'éco-PTZ, le recours à un artisan certifié RGE (Reconnu Garant de l'Environnement) est obligatoire. Pour les CEE, un professionnel qualifié suffit dans la plupart des cas. En Eure-et-Loir, nous référençons exclusivement des artisans disposant de cette certification.",
            },
            {
              q: "Combien de temps faut-il pour recevoir MaPrimeRénov' ?",
              a: "Le versement de MaPrimeRénov' intervient généralement 2 à 4 mois après la transmission de la facture finale. Le dossier doit être déposé avant le début des travaux. L'instruction prend environ 15 jours ouvrés. L'éco-PTZ est débloqué plus rapidement, dès la signature du prêt.",
            },
          ].map((item) => (
            <div key={item.q}>
              <h3 className="mb-1.5 text-sm font-semibold">{item.q}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
