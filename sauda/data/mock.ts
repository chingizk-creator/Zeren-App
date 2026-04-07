// ─── Types ────────────────────────────────────────────────────────────────────

export type VendorTier = "gold" | "silver" | "bronze";
export type OrderStatus = "pending" | "negotiating" | "accepted" | "rejected" | "completed" | "expired";
export type LoanStatus = "available" | "active" | "repaying" | "completed";
export type SettlementStatus = "pending" | "processing" | "paid" | "instant";
export type Confidence = "high" | "medium" | "low";
export type Trend = "up" | "stable" | "down";
export type SaudaTab = "orders" | "analytics" | "finance" | "profile";

export interface VendorMetrics {
  acceptanceRate: number;       // 0–1
  qualityScore: number;         // 0–1
  avgResponseTime: number;      // seconds
  monthlyRevenue: number;
  monthlyVolume: number;
  monthlyOrders: number;
  repeatCustomerRate: number;
  spoilageRate: number;
}

export interface Vendor {
  id: string;
  name: string;
  stallNumber: number;
  bazaar: string;
  city: string;
  phone: string;
  productCategories: string[];
  tier: VendorTier;
  joinedDate: string;
  metrics: VendorMetrics;
}

export interface Order {
  id: string;
  status: OrderStatus;
  product: string;
  emoji: string;
  quantity: number;
  unit: string;
  zerenOfferPrice: number;
  vendorRetailPrice: number;
  vendorCounterPrice: number | null;
  finalPrice: number | null;
  expiresAt: string;            // ISO
  negotiationRound: number;     // 0 | 1 | 2
  isSelectOrder: boolean;
  createdAt: string;
}

export interface DayRevenue {
  day: string;                  // "Пн"
  amount: number;
  isToday: boolean;
}

export interface ForecastItem {
  emoji: string;
  product: string;
  predictedKg: number;
  confidence: Confidence;
  trend: Trend;
}

export interface Loan {
  id: string;
  amount: number;
  monthlyPayment: number;
  interestRate: number;         // annual %
  termMonths: number;
  status: LoanStatus;
  autoDeductPercent: number;
  remainingBalance: number;
}

export interface LoanOption {
  amount: number;
  termMonths: number;
  monthlyPayment: number;
  interestRate: number;
  autoDeductPercent: number;
}

export interface Settlement {
  id: string;
  period: string;
  gross: number;
  loanDeduction: number;
  net: number;
  status: SettlementStatus;
  paidDate: string | null;
}

// ─── Vendor ───────────────────────────────────────────────────────────────────

export const MOCK_VENDOR: Vendor = {
  id: "v-001",
  name: "Аслан",
  stallNumber: 47,
  bazaar: "Алтын Орда",
  city: "Алматы",
  phone: "+77001234567",
  productCategories: ["Помидоры", "Перец болгарский", "Огурцы", "Баклажаны"],
  tier: "gold",
  joinedDate: "2027-01-15",
  metrics: {
    acceptanceRate: 0.87,
    qualityScore: 0.94,
    avgResponseTime: 126,        // 2.1 min
    monthlyRevenue: 847000,
    monthlyVolume: 3420,
    monthlyOrders: 142,
    repeatCustomerRate: 0.78,
    spoilageRate: 0.03,
  },
};

// ─── Orders ───────────────────────────────────────────────────────────────────

function expiresIn(minutes: number, seconds: number): string {
  return new Date(Date.now() + (minutes * 60 + seconds) * 1000).toISOString();
}

export const MOCK_PENDING_ORDERS: Order[] = [
  {
    id: "ord-p1",
    status: "pending",
    product: "Помидоры узбекские",
    emoji: "🍅",
    quantity: 45,
    unit: "кг",
    zerenOfferPrice: 420,
    vendorRetailPrice: 500,
    vendorCounterPrice: null,
    finalPrice: null,
    expiresAt: expiresIn(4, 32),
    negotiationRound: 0,
    isSelectOrder: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "ord-p2",
    status: "pending",
    product: "Перец болгарский",
    emoji: "🫑",
    quantity: 20,
    unit: "кг",
    zerenOfferPrice: 650,
    vendorRetailPrice: 750,
    vendorCounterPrice: null,
    finalPrice: null,
    expiresAt: expiresIn(3, 15),
    negotiationRound: 0,
    isSelectOrder: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "ord-p3",
    status: "pending",
    product: "Огурцы",
    emoji: "🥒",
    quantity: 30,
    unit: "кг",
    zerenOfferPrice: 320,
    vendorRetailPrice: 380,
    vendorCounterPrice: null,
    finalPrice: null,
    expiresAt: expiresIn(2, 48),
    negotiationRound: 0,
    isSelectOrder: true,
    createdAt: new Date().toISOString(),
  },
];

export const MOCK_COMPLETED_ORDERS: Order[] = [
  {
    id: "ord-c1", status: "completed", product: "Помидоры узбекские", emoji: "🍅",
    quantity: 50, unit: "кг", zerenOfferPrice: 440, vendorRetailPrice: 500,
    vendorCounterPrice: null, finalPrice: 440,
    expiresAt: "", negotiationRound: 0, isSelectOrder: false, createdAt: "",
  },
  {
    id: "ord-c2", status: "completed", product: "Баклажаны", emoji: "🍆",
    quantity: 15, unit: "кг", zerenOfferPrice: 480, vendorRetailPrice: 580,
    vendorCounterPrice: 500, finalPrice: 500,
    expiresAt: "", negotiationRound: 1, isSelectOrder: false, createdAt: "",
  },
  {
    id: "ord-c3", status: "completed", product: "Перец болгарский", emoji: "🫑",
    quantity: 25, unit: "кг", zerenOfferPrice: 680, vendorRetailPrice: 750,
    vendorCounterPrice: null, finalPrice: 680,
    expiresAt: "", negotiationRound: 0, isSelectOrder: false, createdAt: "",
  },
  {
    id: "ord-c4", status: "completed", product: "Помидоры узбекские", emoji: "🍅",
    quantity: 35, unit: "кг", zerenOfferPrice: 430, vendorRetailPrice: 500,
    vendorCounterPrice: null, finalPrice: 430,
    expiresAt: "", negotiationRound: 0, isSelectOrder: false, createdAt: "",
  },
  {
    id: "ord-c5", status: "completed", product: "Огурцы", emoji: "🥒",
    quantity: 20, unit: "кг", zerenOfferPrice: 330, vendorRetailPrice: 380,
    vendorCounterPrice: 350, finalPrice: 350,
    expiresAt: "", negotiationRound: 1, isSelectOrder: false, createdAt: "",
  },
];

// ─── Analytics ────────────────────────────────────────────────────────────────

export const MOCK_WEEKLY_REVENUE: DayRevenue[] = [
  { day: "Пн", amount: 95000, isToday: false },
  { day: "Вт", amount: 120000, isToday: false },
  { day: "Ср", amount: 85000, isToday: false },
  { day: "Чт", amount: 138000, isToday: true },
  { day: "Пт", amount: 0, isToday: false },
  { day: "Сб", amount: 0, isToday: false },
  { day: "Вс", amount: 0, isToday: false },
];

// ─── Finance ──────────────────────────────────────────────────────────────────

export const MOCK_FORECAST: ForecastItem[] = [
  { emoji: "🍅", product: "Помидоры", predictedKg: 80, confidence: "high", trend: "up" },
  { emoji: "🫑", product: "Перец болгарский", predictedKg: 35, confidence: "medium", trend: "stable" },
  { emoji: "🥒", product: "Огурцы", predictedKg: 45, confidence: "high", trend: "up" },
  { emoji: "🍆", product: "Баклажаны", predictedKg: 15, confidence: "low", trend: "down" },
];

export const MOCK_ACTIVE_LOAN: Loan = {
  id: "loan-1",
  amount: 1000000,
  monthlyPayment: 120000,
  interestRate: 27,
  termMonths: 9,
  status: "active",
  autoDeductPercent: 15,
  remainingBalance: 715000,
};

export const LOAN_OPTIONS: LoanOption[] = [
  { amount: 500000, termMonths: 3, monthlyPayment: 185000, interestRate: 25, autoDeductPercent: 10 },
  { amount: 1000000, termMonths: 6, monthlyPayment: 195000, interestRate: 27, autoDeductPercent: 15 },
  { amount: 1500000, termMonths: 9, monthlyPayment: 195000, interestRate: 29, autoDeductPercent: 20 },
];

export const MOCK_SETTLEMENTS: Settlement[] = [
  { id: "s1", period: "25 мар — 31 мар", gross: 285000, loanDeduction: 42000, net: 243000, status: "paid", paidDate: "1 апр" },
  { id: "s2", period: "18 мар — 24 мар", gross: 312000, loanDeduction: 42000, net: 270000, status: "paid", paidDate: "25 мар" },
  { id: "s3", period: "1 апр — 7 апр", gross: 248000, loanDeduction: 42000, net: 206000, status: "pending", paidDate: null },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function formatPrice(n: number): string {
  if (n >= 1000000) return "₸" + (n / 1000000).toFixed(1).replace(".0", "") + "M";
  if (n >= 1000) return "₸" + Math.round(n / 1000) + "K";
  return "₸" + n.toLocaleString("ru-RU");
}

export function formatPriceFull(n: number): string {
  return "₸" + n.toLocaleString("ru-RU");
}

export const TIER_LABELS: Record<VendorTier, string> = {
  gold: "Золотой",
  silver: "Серебряный",
  bronze: "Бронзовый",
};

export const TIER_COLORS: Record<VendorTier, string> = {
  gold: "#C8A96E",
  silver: "#9A9490",
  bronze: "#C0834A",
};

export const CONFIDENCE_LABELS: Record<Confidence, string> = {
  high: "Высокий",
  medium: "Средний",
  low: "Низкий",
};

export const CONFIDENCE_COLORS: Record<Confidence, string> = {
  high: "#4A8B3A",
  medium: "#C8A96E",
  low: "#C0392B",
};

export const TREND_ICONS: Record<Trend, string> = {
  up: "↑",
  stable: "→",
  down: "↓",
};
