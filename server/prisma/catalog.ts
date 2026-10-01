export type CatalogProduct = {
  name: string;
  description: string;
  priceCents: number;
  imageUrl?: string;
  // Photos supplémentaires pour la galerie de la fiche produit
  images?: string[];
  material: string;
  ageRange: string;
  featured: boolean;
  isNew?: boolean;
};

export type CatalogCategory = {
  slug: string;
  name: string;
  tagline: string;
  imageUrl?: string;
  accentColor: string;
  illustrationKey: string;
  products: CatalogProduct[];
};

export function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Anciens slugs de produits renommés, pour que la synchro mette à jour
// les produits existants au lieu d'en créer de nouveaux.
export const renamedProducts: Record<string, string> = {
  "set-d-emboitement-formes-couleurs": "puzzle-chiffres-arc-en-ciel",
  "blocs-pastel-arc-en-ciel-30-pieces": "cubes-en-bois-colores-24-pieces",
  "bols-gigognes-en-bois-6-pieces": "bols-de-tri-arc-en-ciel-et-pince",
  "jetons-de-tri-nature-20-pieces": "puzzle-animaux-a-encastrer",
  "tour-d-empilement-anneaux-pastel": "pyramide-d-anneaux-bleu-ocean",
  "camion-de-chantier-en-bois": "jeu-de-construction-arc-en-ciel-30-pieces",
  "tour-de-cubes-arc-en-ciel-12-pieces": "jeu-de-construction-arc-en-ciel-30-pieces",
  "voiture-en-bois-roues-souples": "petit-train-en-bois-roues-pastel",
  "disques-d-equilibre-arc-en-ciel-10-pieces": "boulier-des-formes-geometriques",
};

// Catégories retirées du catalogue : la synchro supprime leurs produits
// (sauf ceux déjà présents dans une commande) puis la catégorie elle-même.
export const removedCategories = ["foulards-de-jeu", "bacs-sensoriels", "blocs-gemmes"];

export const categories: CatalogCategory[] = [
  {
    slug: "blocs-de-construction",
    name: "Blocs en bois",
    tagline: "Construire, empiler et créer à l'infini",
    imageUrl: "/blocdebois.webp",
    accentColor: "mustard",
    illustrationKey: "blocks",
    products: [
      {
        name: "Coffret de blocs naturels (60 pièces)",
        description:
          "Un grand coffret de blocs en bois de hêtre brut : cubes, arches, triangles, cylindres et planchettes pour bâtir châteaux, tours et villes imaginaires. Poncés et huilés à la main.",
        priceCents: 4390,
        imageUrl: "/blocdebois.webp",
        material: "Bois de hêtre huilé",
        ageRange: "18 mois et +",
        featured: true,
      },
      {
        name: "Cubes en bois colorés (24 pièces)",
        description:
          "Vingt-quatre cubes en bois massif teintés dans des couleurs chaudes et profondes — terracotta, vert sapin, moutarde, bleu nuit — pour empiler, construire des murs ou abriter les animaux.",
        priceCents: 3490,
        imageUrl: "/blocdeboiscarre2.webp",
        material: "Bois de hêtre, teinture à l'eau",
        ageRange: "12 mois et +",
        featured: false,
      },
      {
        name: "Jeu de construction arc-en-ciel (30 pièces)",
        description:
          "Cubes, toits, arches, cylindres et planchettes en bois peint aux couleurs vives pour bâtir maisons, ponts et tours… et tout faire tomber ! Travaille l'équilibre, la concentration et la coordination.",
        priceCents: 2590,
        imageUrl: "/blocarcenciel.webp",
        material: "Bois de hêtre, peinture à l'eau",
        ageRange: "12 mois et +",
        featured: true,
      },
    ],
  },
  {
    slug: "emboitement-et-tri",
    name: "Emboîtement & tri",
    tagline: "Verser, trier et explorer",
    imageUrl: "/pinceetbol.webp",
    accentColor: "sage",
    illustrationKey: "nesting-bowls",
    products: [
      {
        name: "Bols de tri arc-en-ciel et pince",
        description:
          "Six bols en bois aux couleurs de l'arc-en-ciel, des boutons géants et des petites formes (poissons, cœurs, étoiles) à trier avec une pince en bois. Idéal pour la motricité fine et la reconnaissance des couleurs.",
        priceCents: 3090,
        imageUrl: "/pinceetbol.webp",
        material: "Bois d'érable teinté, panier en jonc de mer",
        ageRange: "3 ans et +",
        featured: true,
      },
      {
        name: "Puzzle chiffres arc-en-ciel",
        description:
          "Un plateau en bois avec dix chiffres colorés à emboîter et un arc-en-ciel de réglettes à compléter de 1 à 10. Pour apprendre les chiffres, compter et associer les couleurs en s'amusant.",
        priceCents: 2590,
        imageUrl: "/chiffrescouleurs.webp",
        material: "Contreplaqué de bouleau, peinture à l'eau",
        ageRange: "2 ans et +",
        featured: false,
      },
      {
        name: "Puzzle animaux à encastrer",
        description:
          "Des pièces épaisses en bois coloré dans lesquelles viennent s'encastrer des silhouettes d'animaux en bois naturel. Un jeu d'observation et de logique, livré avec son plateau de rangement.",
        priceCents: 2190,
        imageUrl: "/puzzlebois.webp",
        material: "Contreplaqué de bouleau, teinture à l'eau",
        ageRange: "2 ans et +",
        featured: false,
      },
      {
        name: "Puzzle alphabet en bois",
        description:
          "Les vingt-six lettres de l'alphabet en bois épais, teintées dans des couleurs douces, à retirer et replacer dans leur plateau en pin. Pour reconnaître les lettres, les nommer et former ses premiers mots.",
        priceCents: 3190,
        imageUrl: "/alphabet.webp",
        material: "Pin massif, teinture à l'eau",
        ageRange: "3 ans et +",
        featured: true,
      },
      {
        name: "Puzzle des formes gigognes",
        description:
          "Un carré, un triangle et un rond qui s'emboîtent les uns dans les autres avant de trouver leur place sur le plateau. Un premier puzzle pour découvrir les formes, les tailles et les couleurs.",
        priceCents: 1990,
        imageUrl: "/puzzle.webp",
        material: "Bois d'érable, peinture à l'eau",
        ageRange: "12 mois et +",
        featured: false,
      },
      {
        name: "Poupées russes gigognes (lot de 4)",
        description:
          "Quatre poupées en bois peintes à la main, chacune avec sa frimousse et ses motifs, qui se cachent les unes dans les autres. Pour ouvrir, comparer les tailles et inventer des histoires.",
        priceCents: 2590,
        imageUrl: "/poupees.webp",
        material: "Bois de tilleul peint à la main",
        ageRange: "3 ans et +",
        featured: false,
      },
    ],
  },
  {
    slug: "empileurs-arc-en-ciel",
    name: "Empileurs & tours",
    tagline: "Équilibrer, empiler et imaginer",
    imageUrl: "/blocdeboisarcenciel.webp",
    accentColor: "dustypink",
    illustrationKey: "rainbow-stacker",
    products: [
      {
        name: "Empileur arc-en-ciel géant",
        description:
          "Un grand arc-en-ciel de huit arches en bois massif teinté aux couleurs vives, à empiler, aligner ou transformer en tunnel, en pont ou en abri pour les animaux.",
        priceCents: 5290,
        imageUrl: "/blocdeboisarcenciel.webp",
        material: "Bois de hêtre, teinture à l'eau",
        ageRange: "12 mois et +",
        featured: true,
      },
      {
        name: "Pyramide d'anneaux bleu océan",
        description:
          "Sept anneaux en bois aux tons océan, rose et miel à enfiler du plus grand au plus petit. Un classique pour apprendre les tailles et affiner la préhension.",
        priceCents: 2290,
        imageUrl: "/anneaux1.webp",
        material: "Bois de hêtre, peinture à l'eau",
        ageRange: "10 mois et +",
        featured: false,
      },
    ],
  },
  {
    slug: "vehicules-en-bois",
    name: "Véhicules en bois",
    tagline: "Des routes ouvertes vers des histoires sans fin",
    imageUrl: "/petittrain.webp",
    accentColor: "mustard",
    illustrationKey: "vehicle",
    products: [
      {
        name: "Petit train en bois roues pastel",
        description:
          "Une locomotive et ses wagons en pin massif, montés sur des roues aux couleurs pastel. Chaque wagon peut accueillir une bougie : le train devient aussi une jolie décoration d'anniversaire.",
        priceCents: 2890,
        imageUrl: "/petittrain.webp",
        material: "Pin massif, roues en hêtre peintes",
        ageRange: "18 mois et +",
        featured: false,
      },
      {
        name: "Bateaux à voile en bois (lot de 5)",
        description:
          "Une flottille de cinq petits bateaux à voile en bois, chacun avec son matelot en bois tourné, montés sur roulettes pour naviguer aussi bien sur le parquet que sur l'eau du bain.",
        priceCents: 3190,
        imageUrl: "/baby-natur-hld-gd-wn7k-unsplash.webp",
        material: "Bois peint, voile en coton, roues en bois",
        ageRange: "3 ans et +",
        featured: true,
      },
      {
        name: "Circuit de train en bois",
        description:
          "Un circuit en huit avec son pont, un train de trois wagons aimantés, une maisonnette, des arbres et des panneaux de signalisation. De quoi créer tout un village et le faire vivre au fil des trajets.",
        priceCents: 4890,
        imageUrl: "/circuit.webp",
        material: "Bois de hêtre, aimants, peinture à l'eau",
        ageRange: "3 ans et +",
        featured: true,
      },
      {
        name: "Bus en bois et ses passagers",
        description:
          "Un bus sculpté dans du pin massif avec cinq petits passagers en bois foncé à faire monter et descendre par le toit. Des roues en noyer pour rouler en douceur sur tous les sols.",
        priceCents: 3090,
        imageUrl: "/busbois.webp",
        material: "Pin massif, personnages et roues en noyer",
        ageRange: "18 mois et +",
        featured: false,
      },
      {
        name: "Trio de véhicules de secours",
        description:
          "Une voiture de police, une grue avec son crochet et un camion de pompiers en bois peint, montés sur des roues silencieuses. Parfaits pour les petites mains et les grandes missions.",
        priceCents: 2490,
        imageUrl: "/camions.webp",
        material: "Bois peint, roues en caoutchouc",
        ageRange: "2 ans et +",
        featured: false,
      },
    ],
  },
  {
    slug: "disques-en-bois",
    name: "Disques en bois",
    tagline: "Compter, trier et construire",
    imageUrl: "/disques.webp",
    accentColor: "sage",
    illustrationKey: "discs",
    products: [
      {
        name: "Boulier des formes géométriques",
        description:
          "Une planche en bois avec cinq colonnes de tiges : on y enfile ronds, rectangles, triangles, carrés et pentagones selon leur nombre de trous. Pour compter de 1 à 5, trier les formes et les couleurs.",
        priceCents: 2390,
        imageUrl: "/encastrement.webp",
        material: "Bois d'hévéa, peinture à l'eau",
        ageRange: "2 ans et +",
        featured: false,
      },
      {
        name: "Puzzle des cercles dégradés",
        description:
          "Cinq disques en bois, du plus petit au plus grand, dans un dégradé du jaune au corail, avec de gros boutons faciles à saisir. Un puzzle Montessori pour comparer les tailles et affiner la préhension.",
        priceCents: 1990,
        imageUrl: "/disques.webp",
        material: "Contreplaqué de bouleau, peinture à l'eau",
        ageRange: "12 mois et +",
        featured: false,
      },
    ],
  },
  {
    slug: "animaux-en-bois",
    name: "Animaux en bois",
    tagline: "Inventer des histoires et des mondes",
    imageUrl: "/animauxetarbres.webp",
    accentColor: "sage",
    illustrationKey: "blocks",
    products: [
      {
        name: "Animaux de la savane et arbres (lot de 10)",
        description:
          "Une girafe, un éléphant et un crocodile sculptés à la main, accompagnés de sept arbres en bois teinté dans des verts profonds, pour créer une savane miniature et inventer mille histoires.",
        priceCents: 3790,
        imageUrl: "/animauxetarbres.webp",
        material: "Bois de hêtre et d'érable, teinture à l'eau",
        ageRange: "18 mois et +",
        featured: true,
      },
      {
        name: "Dinosaures et arbres (lot de 13)",
        description:
          "Six dinosaures en bois peints à la main (T-rex, diplodocus, stégosaure et leurs amis) et sept arbres aux formes douces dans des tons de vert, pour recréer une forêt préhistorique et partir à l'aventure au temps des dinosaures.",
        priceCents: 3990,
        imageUrl: "/dino.webp",
        material: "Bois de hêtre, peinture à l'eau",
        ageRange: "3 ans et +",
        featured: false,
      },
      {
        name: "Souris à tirer",
        description:
          "Une petite souris en hêtre naturel, avec ses oreilles en feutre et ses moustaches peintes, installée au volant de sa voiture. Il suffit de tirer la cordelette pour qu'elle suive l'enfant partout.",
        priceCents: 2190,
        imageUrl: "/atirer.webp",
        material: "Bois de hêtre, feutre, cordelette en coton",
        ageRange: "12 mois et +",
        featured: false,
        isNew: true,
      },
    ],
  },
  {
    slug: "eveil-musical",
    name: "Éveil musical",
    tagline: "Taper, écouter et créer ses premières mélodies",
    imageUrl: "/xylophone.webp",
    accentColor: "sky",
    illustrationKey: "discs",
    products: [
      {
        name: "Xylophone arc-en-ciel",
        description:
          "Un xylophone à dix lames métalliques colorées sur une base en hêtre, avec sa baguette en bois. Des notes justes et douces pour les premières découvertes musicales.",
        priceCents: 2890,
        imageUrl: "/xylophone.webp",
        material: "Base en hêtre, lames en métal laqué",
        ageRange: "18 mois et +",
        featured: false,
      },
      {
        name: "Maracas pastel (lot de 3)",
        description:
          "Trois maracas en bois tourné aux couleurs douces, moutarde, rose poudré et vert tilleul. Leur son léger et leur manche bien en main en font un premier instrument idéal.",
        priceCents: 1690,
        imageUrl: "/maracasse.webp",
        material: "Bois de hêtre, peinture à l'eau",
        ageRange: "6 mois et +",
        featured: false,
      },
      {
        name: "Piano à queue rose et son tabouret",
        description:
          "Un vrai petit piano à queue en bois laqué rose poudré, avec ses touches noires et blanches et son tabouret assorti. Des notes justes pour jouer ses premières mélodies comme un grand pianiste.",
        priceCents: 8990,
        imageUrl: "/piano.webp",
        material: "Bois laqué, lames métalliques",
        ageRange: "3 ans et +",
        featured: false,
      },
    ],
  },
  {
    slug: "jeux-d-imitation",
    name: "Jeux d'imitation",
    tagline: "Faire comme les grands et jouer à la vie",
    imageUrl: "/maison.webp",
    accentColor: "terracotta",
    illustrationKey: "blocks",
    products: [
      {
        name: "Grande maison de poupée en bois",
        description:
          "Une grande maison de trois étages aux façades qui s'ouvrent comme des volets, avec son escalier, ses fenêtres à carreaux et ses meubles en bois. Un univers entier à aménager et à habiter.",
        priceCents: 13390,
        imageUrl: "/maison.webp",
        material: "Contreplaqué de bouleau",
        ageRange: "3 ans et +",
        featured: true,
      },
      {
        name: "Cagette de fruits à découper",
        description:
          "Une dizaine de fruits en bois peint, citron, pomme, kiwi, orange ou poire, qui se coupent en deux grâce à leurs attaches, livrés dans leur cagette en bois. Pour jouer à la marchande ou à la dînette.",
        priceCents: 2890,
        imageUrl: "/fruits.webp",
        material: "Bois de hêtre, peinture à l'eau, feutre",
        ageRange: "2 ans et +",
        featured: false,
      },
      {
        name: "Licorne à bascule",
        description:
          "Une grande licorne à bascule au design épuré, avec sa poignée en bois et son assise stable, pour les premières chevauchées. Un bel objet qui trouve aussi sa place dans la décoration de la chambre.",
        priceCents: 11590,
        imageUrl: "/cheval.webp",
        material: "Contreplaqué de bouleau, carton alvéolé",
        ageRange: "12 mois et +",
        featured: false,
        isNew: true,
      },
      {
        name: "Cuisine en bois avec accessoires",
        description:
          "Une cuisine à hauteur d'enfant avec plaque de cuisson, évier et robinet, four, micro-ondes et étagères, livrée avec ses ustensiles à suspendre. Pour mijoter de bons petits plats et imiter les grands.",
        priceCents: 10690,
        imageUrl: "/cuisine.webp",
        material: "Contreplaqué de bouleau, poignées et robinet en métal",
        ageRange: "2 ans et +",
        featured: false,
      },
      {
        name: "Mallette de docteur personnalisable",
        description:
          "Une mallette en bois rouge à personnaliser avec le prénom de l'enfant, garnie de tous les instruments du parfait docteur : stéthoscope cœur, thermomètre, seringue, marteau à réflexes, ciseaux et plaquette de pilules. Pour soigner doudous et poupées.",
        priceCents: 3490,
        imageUrl: "/docteur.webp",
        material: "Bois de hêtre et de noyer, peinture à l'eau",
        ageRange: "3 ans et +",
        featured: false,
      },
      {
        name: "Poussette de poupée fleurie",
        description:
          "Une poussette pliable pour promener poupées et doudous, avec sa jolie assise en coton matelassé à petites fleurs, sa pochette assortie et ses grandes roues en bois. Légère et à la bonne hauteur pour les petits parents.",
        priceCents: 4990,
        imageUrl: "/poussettebois.webp",
        material: "Structure en métal laqué, roues en bois, coton matelassé",
        ageRange: "2 ans et +",
        featured: false,
      },
      {
        name: "Appareil photo en bois",
        description:
          "Un appareil photo en bois massif avec son objectif qui tourne, son viseur et sa dragonne en coton pour le porter autour du cou. De quoi immortaliser toutes les aventures… avec beaucoup d'imagination !",
        priceCents: 1990,
        imageUrl: "/appareilphoto.webp",
        material: "Bois de teck et de pin, cordelette en coton",
        ageRange: "18 mois et +",
        featured: false,
      },
    ],
  },
  {
    slug: "eveil-et-motricite",
    name: "Éveil & motricité",
    tagline: "Compter, manipuler et affiner son geste",
    imageUrl: "/boulier.webp",
    accentColor: "sky",
    illustrationKey: "discs",
    products: [
      {
        name: "Boulier 100 perles tons naturels",
        description:
          "Un boulier de dix rangées de perles en bois aux teintes douces, terracotta, sauge, crème ou bleu ardoise, monté sur un cadre en hêtre. Pour compter, additionner et découvrir les premières notions de calcul.",
        priceCents: 3190,
        imageUrl: "/boulier.webp",
        material: "Bois de hêtre, peinture à l'eau",
        ageRange: "3 ans et +",
        featured: true,
      },
      {
        name: "Cube d'activités labyrinthe",
        description:
          "Un grand cube en bois avec des circuits de perles sur le dessus, un boulier, des labyrinthes et des formes sur les côtés. Plusieurs enfants peuvent jouer ensemble tout autour.",
        priceCents: 11990,
        imageUrl: "/grandboulier.webp",
        material: "Contreplaqué de bouleau, fil métallique laqué, perles en bois",
        ageRange: "18 mois et +",
        featured: false,
      },
      {
        name: "Toupies en bois (lot de 3)",
        description:
          "Trois toupies tournées à la main, chacune avec sa forme et ses couleurs, à lancer d'un petit geste des doigts. Un jeu d'adresse intemporel qui fascine petits et grands.",
        priceCents: 1590,
        imageUrl: "/toupies.webp",
        material: "Bois de hêtre, peinture à l'eau",
        ageRange: "3 ans et +",
        featured: false,
      },
      {
        name: "Ensemble de motricité Pikler",
        description:
          "Un triangle d'escalade avec son toboggan réversible, une arche à bascule et un tapis de réception : de quoi grimper, glisser, se balancer et construire mille parcours à la maison. L'arche se retourne aussi en tunnel, en pont ou en petit fauteuil.",
        priceCents: 17990,
        imageUrl: "/ensembleboismotricite.webp",
        material: "Contreplaqué de bouleau, barreaux en hêtre, tapis en coton",
        ageRange: "12 mois et +",
        featured: true,
      },
      {
        name: "Planche d'équilibre",
        description:
          "Une planche incurvée en bois, doublée de liège, pour se balancer, surfer ou garder l'équilibre. Elle se transforme aussi en pont, en toboggan ou en berceau pour les doudous, et développe la coordination et la confiance en soi.",
        priceCents: 6990,
        imageUrl: "/bascule.webp",
        material: "Bois de hêtre multiplis, liège naturel",
        ageRange: "18 mois et +",
        featured: false,
      },
    ],
  },
];
