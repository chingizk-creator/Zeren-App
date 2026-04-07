/**
 * Format a price in Kazakhstani tenge (₸)
 * e.g. 1234567 → "₸1,234,567"
 */
export function formatPrice(amount: number): string {
  return "₸" + amount.toLocaleString("ru-KZ");
}

/**
 * Format savings percentage
 * e.g. 0.44 → "44%"
 */
export function formatPercent(ratio: number): string {
  return Math.round(ratio * 100) + "%";
}
