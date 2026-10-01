import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";

const VALUES = [
  {
    title: "Du bois, et presque rien d'autre",
    text: "Hêtre, érable, bouleau ou pin : des essences choisies pour leur solidité, poncées avec soin et finies avec des teintures à l'eau et des huiles végétales, sans danger pour les petites bouches.",
  },
  {
    title: "Le jeu libre avant tout",
    text: "Pas de piles, pas d'écran, pas de mode d'emploi. Un arc-en-ciel devient un pont, un tunnel ou un berceau : c'est l'enfant qui décide, et c'est là que son imagination grandit.",
  },
  {
    title: "Inspirés par Montessori",
    text: "Des jouets à la bonne taille pour les petites mains, qui accompagnent chaque étape : saisir, empiler, trier, compter, puis inventer des histoires entières.",
  },
  {
    title: "Faits pour durer",
    text: "Un jouet en bois bien fait se transmet d'un enfant à l'autre. Nous choisissons des pièces robustes et intemporelles, loin des modes et du tout-jetable.",
  },
];

export function AboutPage() {
  return (
    <div>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 sm:grid-cols-2">
        <div className="flex flex-col gap-5">
          <span className="w-fit rounded-full bg-sage-light px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-sage">
            Notre histoire
          </span>
          <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl">
            Tout a commencé avec <span className="text-terracotta">un simple cube en bois</span>
          </h1>
          <p className="text-ink-light">
            Un cube, puis deux, puis une tour qui s'effondre dans un éclat de rire. En regardant les enfants jouer,
            une évidence s'est imposée : les jouets les plus simples sont souvent ceux qui les occupent le plus
            longtemps.
          </p>
          <p className="text-ink-light">
            Bois &amp; Merveilles est née de cette envie : réunir au même endroit de beaux jouets en bois, pensés
            pour le jeu libre, qui laissent toute la place à la curiosité et à l'imagination des tout-petits.
          </p>
        </div>
        <img
          src="/animauxetarbres.webp"
          alt="Animaux et arbres en bois disposés sur le sol"
          className="aspect-4/5 w-full rounded-[28px] object-cover"
        />
      </section>

      <section className="bg-cream-dark py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-10 text-center font-display text-3xl text-ink">Ce qui nous guide</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {VALUES.map((value) => (
              <div key={value.title} className="rounded-3xl bg-white/50 p-6">
                <h3 className="font-display text-lg text-ink">{value.title}</h3>
                <p className="mt-2 text-sm text-ink-light">{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 sm:grid-cols-2">
        <img
          src="/blocdebois.webp"
          alt="Coffret de blocs en bois naturel"
          className="aspect-4/3 w-full rounded-[28px] object-cover sm:order-1"
        />
        <div className="flex flex-col gap-5 sm:order-2">
          <h2 className="font-display text-3xl text-ink">Choisis un par un</h2>
          <p className="text-ink-light">
            Chaque jouet de la boutique est sélectionné pour la qualité de son bois, la sécurité de ses finitions et,
            surtout, pour le nombre de façons différentes dont on peut jouer avec. S'il ne donne pas envie d'inventer,
            il n'entre pas dans le catalogue.
          </p>
          <Link to="/boutique" className="w-fit">
            <Button>Découvrir les jouets</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
