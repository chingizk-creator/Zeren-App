export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  deliveriesPerMonth: number | "unlimited";
  minOrder: number | null;
  hasSandyq: boolean;
  accentColor: string;
  isPopular: boolean;
  features: string[];
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "basic",
    name: "Basic",
    price: 2990,
    deliveriesPerMonth: 4,
    minOrder: 5000,
    hasSandyq: false,
    accentColor: "#6B8F5A",
    isPopular: false,
    features: [
      "4 доставки/мес",
      "Мин. заказ ₸5,000",
      "Приоритетный сбор",
      "Свежие продукты",
    ],
  },
  {
    id: "plus",
    name: "Plus",
    price: 4990,
    deliveriesPerMonth: 8,
    minOrder: 4000,
    hasSandyq: true,
    accentColor: "#C8A96E",
    isPopular: true,
    features: [
      "8 доставок/мес",
      "Мин. заказ ₸4,000",
      "Сандық недели",
      "Приоритетная сборка",
    ],
  },
  {
    id: "family",
    name: "Family",
    price: 7990,
    deliveriesPerMonth: "unlimited",
    minOrder: null,
    hasSandyq: true,
    accentColor: "#4A6A8A",
    isPopular: false,
    features: [
      "Безлимит доставок",
      "Без мин. заказа",
      "Сандық недели",
      "VIP поддержка",
    ],
  },
];
