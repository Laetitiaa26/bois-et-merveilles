// Convertit un libellé d'âge conseillé ("18 mois et +", "3 ans et +") en
// nombre de mois, pour pouvoir filtrer les produits par âge de l'enfant.
export function parseMinAgeMonths(ageRange: string | null | undefined): number {
  if (!ageRange) return 0;
  const match = ageRange.match(/(\d+)\s*(mois|an)/i);
  if (!match) return 0;
  const value = Number(match[1]);
  return match[2].toLowerCase() === "mois" ? value : value * 12;
}
