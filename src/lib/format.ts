export function formatPrice(cents: number, currency = "eur"): string {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(cents / 100);
}
