import type { CartItem } from "@/context/AppContext";

export interface SavingsSummary {
  total: number;
  retailTotal: number;
  savings: number;
  savingsPercent: number;
}

export function calculateSavings(items: CartItem[]): SavingsSummary {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const retailTotal = items.reduce(
    (sum, item) => sum + item.retailPrice * item.quantity,
    0
  );
  const savings = retailTotal - total;
  const savingsPercent = retailTotal > 0 ? savings / retailTotal : 0;

  return { total, retailTotal, savings, savingsPercent };
}

export function productSavingsPercent(price: number, retailPrice: number): number {
  return Math.round((1 - price / retailPrice) * 100);
}
