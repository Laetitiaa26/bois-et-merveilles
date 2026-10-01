// Codes promo acceptés au paiement, avec leur pourcentage de réduction.
// BIENVENUE10 est offert à l'inscription à la newsletter.
export const WELCOME_PROMO_CODE = "BIENVENUE10";

const PROMO_CODES: Record<string, number> = {
  [WELCOME_PROMO_CODE]: 10,
};

export function getPromoPercent(code: string | undefined): number | null {
  if (!code) return null;
  return PROMO_CODES[code.trim().toUpperCase()] ?? null;
}

export function applyPercent(cents: number, percent: number): number {
  return Math.round((cents * (100 - percent)) / 100);
}
