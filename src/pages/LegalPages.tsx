import type { ReactNode } from "react";
import { Link } from "react-router-dom";

const CONTACT = "contact@laetitiapenel.fr";

function Mail() {
  return (
    <a href={`mailto:${CONTACT}`} className="text-sage hover:underline">
      {CONTACT}
    </a>
  );
}

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-sage hover:underline">
      {children}
    </a>
  );
}

function LegalLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-3 font-display text-3xl text-ink sm:text-4xl">{title}</h1>
      <p className="mb-10 rounded-2xl bg-mustard-light px-4 py-3 text-sm text-ink">
        Bois &amp; Merveilles est un site de démonstration réalisé dans le cadre d'un portfolio : aucune vente réelle
        n'est effectuée et aucun paiement n'est débité.
      </p>
      <div className="flex flex-col gap-8 text-ink-light [&_h2]:mb-2 [&_h2]:font-display [&_h2]:text-xl [&_h2]:text-ink">
        {children}
      </div>
    </div>
  );
}

export function LegalNoticePage() {
  return (
    <LegalLayout title="Mentions légales">
      <section>
        <h2>Éditrice du site</h2>
        <p>
          Laetitia PENEL, développeuse web, entrepreneuse individuelle
          <br />
          SIRET : 106 228 166 00018
          <br />
          7 allée des Lilas, 62149 Givenchy-lès-la-Bassée, France
          <br />
          Email : <Mail />
          <br />
          Site : <ExternalLink href="https://laetitiapenel.fr">laetitiapenel.fr</ExternalLink>
        </p>
        <p className="mt-2">Directrice de la publication : Laetitia PENEL</p>
        <p className="mt-2">
          « Bois &amp; Merveilles » est une boutique fictive, créée pour présenter le savoir-faire de l'éditrice.
        </p>
      </section>
      <section>
        <h2>Hébergement</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Site : Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis (
            <ExternalLink href="https://vercel.com">vercel.com</ExternalLink>)
          </li>
          <li>
            Serveur (API) : Render Services, Inc., San Francisco, CA, États-Unis (
            <ExternalLink href="https://render.com">render.com</ExternalLink>)
          </li>
          <li>
            Base de données : Neon (<ExternalLink href="https://neon.tech">neon.tech</ExternalLink>)
          </li>
        </ul>
      </section>
      <section>
        <h2>Propriété intellectuelle</h2>
        <p>
          Le code, les textes et la mise en page du site sont la propriété de Laetitia PENEL. Les photographies
          proviennent de banques d'images libres de droits et restent la propriété de leurs auteurs.
        </p>
      </section>
      <section>
        <h2>Données personnelles et cookies</h2>
        <p>
          Les données saisies sur le site et vos droits sont détaillés dans la{" "}
          <Link to="/confidentialite" className="text-sage hover:underline">
            politique de confidentialité
          </Link>
          .
        </p>
      </section>
    </LegalLayout>
  );
}

export function PrivacyPage() {
  return (
    <LegalLayout title="Politique de confidentialité">
      <section>
        <p>
          Cette politique explique quelles données personnelles sont collectées sur Bois &amp; Merveilles, pourquoi,
          et comment exercer vos droits, conformément au Règlement général sur la protection des données (RGPD) et à
          la loi Informatique et Libertés.
        </p>
      </section>
      <section>
        <h2>Responsable du traitement</h2>
        <p>
          Laetitia PENEL, entrepreneuse individuelle, 7 allée des Lilas, 62149 Givenchy-lès-la-Bassée, France.
          Contact : <Mail />.
        </p>
      </section>
      <section>
        <h2>Données collectées et utilisation</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-ink">Compte client</strong> : nom, adresse email et mot de passe (enregistré sous
            forme chiffrée, illisible même pour l'administratrice). Il sert à vous connecter et à retrouver vos
            commandes et vos favoris.
          </li>
          <li>
            <strong className="text-ink">Commandes</strong> : email, nom, adresse de livraison et contenu de la
            commande, pour traiter et suivre la commande.
          </li>
          <li>
            <strong className="text-ink">Avis</strong> : note et commentaire, publiés avec votre nom après validation
            par l'administratrice.
          </li>
          <li>
            <strong className="text-ink">Newsletter</strong> : adresse email, uniquement si vous vous inscrivez.
          </li>
        </ul>
        <p className="mt-3">
          Ces traitements reposent sur l'exécution du service que vous demandez (compte, commande) et, pour la
          newsletter, sur votre consentement. Vos données ne sont jamais vendues ni utilisées à des fins publicitaires.
        </p>
      </section>
      <section>
        <h2>Paiement</h2>
        <p>
          Le paiement est géré par Stripe, en <strong className="text-ink">mode test</strong> : aucun paiement réel
          n'est débité. N'utilisez pas votre vraie carte bancaire, mais la carte de test indiquée sur la page de commande. Les
          données de paiement sont saisies directement chez Stripe et ne transitent jamais par Bois &amp; Merveilles.
        </p>
      </section>
      <section>
        <h2>Destinataires et sous-traitants</h2>
        <p>
          Vos données sont accessibles uniquement à l'administratrice du site. Elles sont hébergées par des
          prestataires techniques : Vercel (site), Render (serveur), Neon (base de données) et Stripe (paiement).
          Certains sont situés aux États-Unis : ces transferts sont encadrés par les clauses contractuelles types de
          la Commission européenne.
        </p>
      </section>
      <section>
        <h2>Durée de conservation</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Compte, commandes, favoris et avis : jusqu'à la suppression de votre compte, et au plus 3 ans après votre
            dernière connexion.
          </li>
          <li>Newsletter : jusqu'à votre désinscription, et au plus 3 ans après votre inscription.</li>
        </ul>
      </section>
      <section>
        <h2>Cookies</h2>
        <p>
          Le site dépose uniquement un cookie technique, nécessaire pour garder votre session ouverte, et mémorise
          votre panier dans votre navigateur. Aucun cookie publicitaire ou de mesure d'audience n'est utilisé : aucun
          consentement n'est donc demandé. Les polices d'écriture sont hébergées directement sur le site, sans appel à
          Google.
        </p>
      </section>
      <section>
        <h2>Vos droits</h2>
        <p>
          Vous pouvez à tout moment accéder à vos données, les rectifier, les faire supprimer (y compris votre compte
          ou votre inscription à la newsletter), vous opposer à leur traitement, en demander la limitation ou la
          portabilité. Il suffit d'écrire à <Mail /> ; une réponse vous sera apportée sous un mois.
        </p>
        <p className="mt-2">
          Si vous estimez que vos droits ne sont pas respectés, vous pouvez saisir la CNIL (
          <ExternalLink href="https://www.cnil.fr">www.cnil.fr</ExternalLink>).
        </p>
      </section>
    </LegalLayout>
  );
}

export function TermsPage() {
  return (
    <LegalLayout title="Conditions générales de vente">
      <section>
        <h2>1. Objet</h2>
        <p>
          Les présentes conditions régissent les ventes de jouets en bois réalisées sur le site Bois &amp;
          Merveilles. Passer commande implique leur acceptation pleine et entière.
        </p>
      </section>
      <section>
        <h2>2. Prix</h2>
        <p>
          Les prix sont indiqués en euros, toutes taxes comprises. Ils peuvent être modifiés à tout moment, mais
          les produits sont facturés au prix affiché au moment de la validation de la commande.
        </p>
      </section>
      <section>
        <h2>3. Commande et paiement</h2>
        <p>
          La commande est validée après le paiement en ligne, sécurisé par Stripe. Un code promo valide peut être
          saisi avant le paiement ; il ne peut pas être appliqué après coup.
        </p>
      </section>
      <section>
        <h2>4. Livraison</h2>
        <p>Les conditions et délais de livraison sont détaillés sur la page Livraison &amp; retours.</p>
      </section>
      <section>
        <h2>5. Droit de rétractation</h2>
        <p>
          Vous disposez de 14 jours à compter de la réception de votre commande pour exercer votre droit de
          rétractation, sans avoir à vous justifier. Les produits doivent être retournés complets et dans leur état
          d'origine.
        </p>
      </section>
      <section>
        <h2>6. Garanties</h2>
        <p>
          Tous les produits bénéficient de la garantie légale de conformité et de la garantie contre les vices
          cachés. Les jouets respectent la norme européenne de sécurité EN 71 ; merci de respecter l'âge conseillé
          indiqué sur chaque fiche produit.
        </p>
      </section>
    </LegalLayout>
  );
}

export function ShippingPage() {
  return (
    <LegalLayout title="Livraison & retours">
      <section>
        <h2>Délais</h2>
        <p>
          Les commandes sont préparées sous 48 heures ouvrées puis livrées en 3 à 5 jours ouvrés en France
          métropolitaine. Vous recevez un email de suivi dès l'expédition.
        </p>
      </section>
      <section>
        <h2>Frais de port</h2>
        <ul className="list-disc pl-5">
          <li>Livraison offerte dès 60 € d'achat</li>
          <li>4,90 € en point relais</li>
          <li>6,90 € à domicile</li>
        </ul>
      </section>
      <section>
        <h2>Emballage</h2>
        <p>
          Les jouets sont emballés dans du carton recyclé et du papier kraft, sans plastique. Chaque colis peut être
          réutilisé pour un prochain envoi.
        </p>
      </section>
      <section>
        <h2>Retours</h2>
        <p>
          Un jouet ne convient pas ? Vous avez 14 jours après réception pour nous le retourner. Écrivez-nous à
          <Mail /> avec votre numéro de commande : nous vous envoyons une étiquette de retour, et
          le remboursement est effectué sous 7 jours après réception du colis.
        </p>
      </section>
    </LegalLayout>
  );
}
