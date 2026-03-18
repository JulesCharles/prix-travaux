import type { Metadata } from "next"
import { Breadcrumb } from "@/components/Breadcrumb"

export const metadata: Metadata = {
  title: "Mentions légales — Prix Travaux 28",
  description:
    "Mentions légales, politique de confidentialité et informations RGPD du site Prix Travaux 28.",
  alternates: { canonical: "/mentions-legales" },
}

export default function MentionsLegalesPage() {
  return (
    <>
      <Breadcrumb
        items={[
          { label: "Accueil", href: "/" },
          { label: "Mentions légales" },
        ]}
      />

      <article className="article-content">
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          Mentions légales
        </h1>

        <h2>Éditeur du site</h2>
        <p>
          <strong>Prix Travaux 28</strong> — JulesCharlesDev
          <br />
          Statut juridique : Auto-entrepreneur
          <br />
          SIRET : 910 587 302 00019
          <br />
          Responsable de la publication : Jules Charles
          <br />
          Adresse : Arcisses, Eure-et-Loir (28), France
          <br />
          Email : contact@prix-travaux-28.fr
        </p>

        <h2>Hébergeur</h2>
        <p>
          Vercel Inc.
          <br />
          440 N Barranca Ave #4133, Covina, CA 91723, États-Unis
          <br />
          Site web :{" "}
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            vercel.com
          </a>
        </p>

        <h2>Données personnelles et RGPD</h2>
        <p>
          Conformément au Règlement Général sur la Protection des Données
          (RGPD) et à la loi Informatique et Libertés du 6 janvier 1978
          modifiée, vous disposez d'un droit d'accès, de rectification, de
          suppression et de portabilité de vos données personnelles.
        </p>

        <h3>Données collectées</h3>
        <p>
          Lors de l'utilisation du formulaire de demande de devis, les données
          suivantes sont collectées :
        </p>
        <ul>
          <li>Nom complet</li>
          <li>Adresse email</li>
          <li>Numéro de téléphone</li>
          <li>Code postal</li>
          <li>Type de travaux souhaité</li>
          <li>Surface estimée du projet</li>
          <li>Message libre (optionnel)</li>
        </ul>

        <h3>Finalité du traitement</h3>
        <p>
          Vos données sont collectées dans le but exclusif de vous mettre en
          relation avec des artisans qualifiés de votre secteur géographique
          pour l'établissement de devis gratuits. Vos coordonnées sont
          transmises à un maximum de 3 professionnels partenaires.
        </p>

        <h3>Base légale</h3>
        <p>
          Le traitement de vos données repose sur votre consentement explicite,
          recueilli via la case à cocher du formulaire de demande de devis.
        </p>

        <h3>Destinataires des données</h3>
        <p>
          Vos données personnelles sont susceptibles d'être transmises aux
          destinataires suivants, dans le cadre strict de la mise en relation
          avec des professionnels du bâtiment :
        </p>
        <ul>
          <li>
            <strong>Casaneo</strong> — Plateforme de mise en relation entre
            particuliers et artisans. Les données transmises sont : nom, téléphone,
            email, code postal, type de travaux, surface du projet.
          </li>
          <li>
            <strong>Travaux.com</strong> — Service de devis en ligne pour travaux
            de rénovation. Les données transmises sont : nom, téléphone, email,
            code postal, catégorie de travaux, surface du projet.
          </li>
        </ul>
        <p>
          Ces partenaires sont soumis à leurs propres politiques de
          confidentialité et au respect du RGPD. Vos données ne sont jamais
          vendues à des tiers à des fins publicitaires.
        </p>
        <p>
          Des données anonymisées et agrégées (statistiques de demandes par type
          de travaux, par zone géographique, tendances saisonnières) peuvent être
          utilisées à des fins d'études de marché, sans qu'aucune donnée
          personnelle ne soit identifiable.
        </p>

        <h3>Durée de conservation</h3>
        <p>
          Vos données personnelles sont conservées pendant une durée maximale
          de 3 ans à compter de leur collecte, ou 3 ans après le dernier
          contact. Passé ce délai, elles sont automatiquement supprimées.
        </p>

        <h3>Exercer vos droits</h3>
        <p>
          Pour exercer vos droits (accès, rectification, suppression,
          portabilité, opposition), adressez votre demande à :{" "}
          <strong>contact@prix-travaux-28.fr</strong>. Une réponse vous sera
          apportée dans un délai de 30 jours.
        </p>
        <p>
          En cas de litige, vous pouvez introduire une réclamation auprès de la
          CNIL (Commission Nationale de l'Informatique et des Libertés) :{" "}
          <a
            href="https://www.cnil.fr"
            target="_blank"
            rel="noopener noreferrer"
          >
            www.cnil.fr
          </a>
          .
        </p>

        <h2>Cookies</h2>
        <p>
          Le site Prix Travaux 28 utilise exclusivement des cookies techniques
          essentiels au fonctionnement du site. Aucun cookie publicitaire ou de
          traçage n'est déposé. Aucun outil d'analyse comportementale n'est
          utilisé.
        </p>

        <h2>Propriété intellectuelle</h2>
        <p>
          L'ensemble du contenu du site Prix Travaux 28 (textes, images,
          graphismes, logo, structure) est protégé par le droit de la propriété
          intellectuelle. Toute reproduction, représentation ou diffusion, en
          tout ou partie, sans autorisation écrite préalable est interdite.
        </p>
        <p>
          Les données tarifaires présentées sur ce site sont fournies à titre
          indicatif et ne constituent pas un engagement contractuel. Les prix
          réels peuvent varier en fonction de la complexité du chantier, des
          matériaux choisis et des conditions spécifiques à chaque projet.
        </p>

        <h2>Limitation de responsabilité</h2>
        <p>
          Prix Travaux 28 met en relation des particuliers avec des artisans
          indépendants. Prix Travaux 28 ne peut être tenu responsable de la
          qualité, des délais ou du résultat des prestations réalisées par les
          artisans mis en relation via la plateforme.
        </p>
      </article>
    </>
  )
}
