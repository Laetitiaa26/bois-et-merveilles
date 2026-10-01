import type { ReactNode } from "react";

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
        <h2>Éditeur du site</h2>
        <p>
          Bois &amp; Merveilles, boutique fictive créée à des fins de démonstration.
          <br />
          Contact : contact@boisetmerveilles.fr
        </p>
      </section>
      <section>
        <h2>Hébergement</h2>
        <p>Les informations sur l'hébergeur seront précisées lors de la mise en ligne du site.</p>
      </section>
      <section>
        <h2>Propriété intellectuelle</h2>
        <p>
          Les textes et la mise en page du site sont la propriété de leur auteur. Les photographies proviennent de
          banques d'images libres de droits.
        </p>
      </section>
      <section>
        <h2>Données personnelles</h2>
        <p>
          Les données saisies (compte client, adresse de livraison, avis, inscription à la newsletter) servent
          uniquement au fonctionnement du site. Vous pouvez demander leur suppression à tout moment en écrivant à
          l'adresse de contact ci-dessus.
        </p>
      </section>
      <section>
        <h2>Cookies</h2>
        <p>
          Le site utilise uniquement un cookie technique pour garder votre session ouverte, et le stockage local de
          votre navigateur pour mémoriser votre panier. Aucun cookie publicitaire ou de mesure d'audience n'est
          déposé.
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
          contact@boisetmerveilles.fr avec votre numéro de commande : nous vous envoyons une étiquette de retour, et
          le remboursement est effectué sous 7 jours après réception du colis.
        </p>
      </section>
    </LegalLayout>
  );
}
