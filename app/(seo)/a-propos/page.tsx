import type { Metadata } from "next"
import Link from "next/link"
import {
  Database,
  Award,
  RefreshCw,
  ShieldCheck,
  MapPin,
  ArrowRight,
} from "lucide-react"
import { Breadcrumb } from "@/components/Breadcrumb"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "À propos — Prix Travaux 28 | Observatoire des prix travaux en Eure-et-Loir",
  description:
    "Prix Travaux 28 est un observatoire indépendant des prix du bâtiment en Eure-et-Loir (28). Découvrez notre méthodologie, notre équipe et notre engagement pour la transparence.",
  alternates: { canonical: "/a-propos" },
}

const pillars = [
  {
    icon: Database,
    title: "Données locales vérifiées",
    description:
      "Nos estimations reposent sur des tarifs constatés auprès d'artisans exerçant en Eure-et-Loir. Chaque fourchette de prix est croisée avec des devis réels collectés sur le terrain.",
  },
  {
    icon: Award,
    title: "Artisans certifiés RGE",
    description:
      "Nous travaillons exclusivement avec des professionnels titulaires de certifications reconnues : RGE (Reconnu Garant de l'Environnement), Qualibat, Qualifelec ou Qualit'EnR.",
  },
  {
    icon: RefreshCw,
    title: "Mise à jour trimestrielle",
    description:
      "Les prix des matériaux et de la main-d'œuvre évoluent. Notre base de données est actualisée chaque trimestre pour refléter les tarifs réellement pratiqués dans le département.",
  },
  {
    icon: ShieldCheck,
    title: "Indépendance éditoriale",
    description:
      "Aucun artisan ne paye pour apparaître en tête de nos estimations. Notre modèle repose sur la mise en relation volontaire, jamais sur le classement sponsorisé.",
  },
]

export default function AProposPage() {
  return (
    <>
      <Breadcrumb
        items={[
          { label: "Accueil", href: "/" },
          { label: "À propos" },
        ]}
      />

      {/* H1 — Mission */}
      <section className="mb-10">
        <h1 className="mb-4 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
          Observatoire indépendant des prix du bâtiment en Eure-et-Loir
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
          Prix Travaux 28 est né d'un constat simple : trouver un prix fiable
          pour des travaux de rénovation dans le département 28 relevait du
          parcours du combattant. Entre les estimations nationales déconnectées
          du terrain et les devis opaques, les propriétaires manquaient d'un
          outil de référence local.
        </p>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Notre mission est d'apporter la transparence que les particuliers
          méritent : des fourchettes de prix réalistes, contextualisées pour
          chaque commune d'Eure-et-Loir, et une mise en relation gratuite avec
          des artisans vérifiés.
        </p>
      </section>

      <Separator />

      {/* H2 — Méthodologie */}
      <section className="my-10">
        <h2 className="mb-6 font-heading text-xl font-bold">
          Comment nous calculons les prix
        </h2>
        <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Contrairement aux plateformes qui affichent des moyennes nationales,
            Prix Travaux 28 s'appuie sur une méthodologie en quatre étapes
            spécifiquement calibrée pour l'Eure-et-Loir :
          </p>
          <ol className="list-decimal space-y-3 pl-5">
            <li>
              <strong className="text-foreground">Collecte terrain</strong> — Nous
              analysons des devis réels transmis par des artisans partenaires du
              département 28 : couvreurs, plombiers, électriciens, peintres,
              carreleurs et façadiers exerçant entre Chartres, Dreux et
              Nogent-le-Rotrou.
            </li>
            <li>
              <strong className="text-foreground">Coefficient régional</strong> — Les
              tarifs varient selon la densité de population et l'accessibilité
              de la commune. Un chantier en centre-ville de Chartres ne coûte
              pas le même prix qu'en zone rurale du Perche. Nous appliquons un
              coefficient correcteur basé sur la taille de la commune.
            </li>
            <li>
              <strong className="text-foreground">Actualisation trimestrielle</strong>{" "}
              — Chaque trimestre, nous mettons à jour nos fourchettes pour tenir
              compte de l'évolution des prix des matériaux (bois, cuivre, laine
              de verre) et des taux horaires de la main-d'œuvre locale.
            </li>
            <li>
              <strong className="text-foreground">Validation croisée</strong> — Nos
              estimations sont confrontées aux barèmes des fédérations
              professionnelles (FFB, CAPEB) et aux données de l'Observatoire des
              prix du bâtiment. Les écarts significatifs font l'objet d'une
              investigation complémentaire.
            </li>
          </ol>
        </div>
      </section>

      <Separator />

      {/* H2 — Nos engagements */}
      <section className="my-10">
        <h2 className="mb-6 font-heading text-xl font-bold">
          Nos engagements
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {pillars.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-xl border-2 border-border/60 bg-card p-5"
            >
              <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-primary/10">
                <Icon className="size-5 text-primary" />
              </div>
              <h3 className="mb-1.5 text-sm font-bold">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* H2 — Équipe éditoriale */}
      <section className="my-10">
        <h2 className="mb-4 font-heading text-xl font-bold">
          L'équipe éditoriale
        </h2>
        <p className="mb-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Prix Travaux 28 est animé par une équipe de rédacteurs spécialisés dans
          le bâtiment, la rénovation énergétique et l'économie locale. Nos
          contributeurs ont une expérience directe du secteur de la construction
          en Eure-et-Loir et collaborent régulièrement avec des artisans, des
          architectes et des conseillers France Rénov'.
        </p>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Chaque article, chaque fiche de prix et chaque guide publié sur le
          site est relu et validé avant publication. Nous privilégions
          l'exactitude technique et la pertinence locale à la quantité de
          contenu.
        </p>
      </section>

      <Separator />

      {/* H2 — Couverture */}
      <section className="my-10">
        <h2 className="mb-4 font-heading text-xl font-bold">
          Notre couverture
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-muted/40 p-5 text-center">
            <p className="text-3xl font-extrabold text-primary">10</p>
            <p className="mt-1 text-sm font-medium text-muted-foreground">
              corps de métier
            </p>
          </div>
          <div className="rounded-lg bg-muted/40 p-5 text-center">
            <p className="text-3xl font-extrabold text-primary">33</p>
            <p className="mt-1 text-sm font-medium text-muted-foreground">
              communes couvertes
            </p>
          </div>
          <div className="rounded-lg bg-muted/40 p-5 text-center">
            <p className="text-3xl font-extrabold text-primary">330+</p>
            <p className="mt-1 text-sm font-medium text-muted-foreground">
              pages de prix détaillés
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/prix"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
          >
            <MapPin className="size-3.5" />
            Tous les prix travaux
            <ArrowRight className="size-3.5" />
          </Link>
          <Link
            href="/eure-et-loir"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
          >
            <MapPin className="size-3.5" />
            Toutes les communes
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </section>

      <Separator />

      {/* CTA Contact */}
      <section className="my-10">
        <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-6 text-center">
          <h2 className="mb-2 font-heading text-lg font-bold">
            Une question ? Un partenariat artisan ?
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Notre équipe répond sous 24h à toutes vos demandes.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Nous contacter
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </section>
    </>
  )
}
