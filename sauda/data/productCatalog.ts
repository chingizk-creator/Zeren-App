// Category → products → unit mapping for onboarding Step 3

export type ProductCategory =
  | "vegetables" | "fruits" | "meat" | "dairy"
  | "grains" | "driedfruits" | "greens" | "other";

export interface ProductItem {
  name: string;
  unit: string;      // "кг" | "л" | "пучок" | "шт"
  hint: number;      // placeholder average market price
}

export interface CategoryDef {
  id: ProductCategory;
  emoji: string;
  label: string;
  products: ProductItem[];
}

export const PRODUCT_CATALOG: CategoryDef[] = [
  {
    id: "vegetables", emoji: "🥕", label: "Овощи",
    products: [
      { name: "Помидоры", unit: "кг", hint: 500 },
      { name: "Огурцы", unit: "кг", hint: 350 },
      { name: "Перец болгарский", unit: "кг", hint: 700 },
      { name: "Картофель", unit: "кг", hint: 180 },
      { name: "Лук", unit: "кг", hint: 150 },
    ],
  },
  {
    id: "fruits", emoji: "🍎", label: "Фрукты",
    products: [
      { name: "Яблоки", unit: "кг", hint: 400 },
      { name: "Бананы", unit: "кг", hint: 600 },
      { name: "Виноград", unit: "кг", hint: 900 },
      { name: "Апельсины", unit: "кг", hint: 500 },
    ],
  },
  {
    id: "meat", emoji: "🥩", label: "Мясо",
    products: [
      { name: "Говядина", unit: "кг", hint: 3500 },
      { name: "Баранина", unit: "кг", hint: 4000 },
      { name: "Курица", unit: "кг", hint: 1200 },
    ],
  },
  {
    id: "dairy", emoji: "🧀", label: "Молочные продукты",
    products: [
      { name: "Молоко", unit: "л", hint: 250 },
      { name: "Творог", unit: "кг", hint: 900 },
      { name: "Сметана", unit: "кг", hint: 700 },
    ],
  },
  {
    id: "grains", emoji: "🌾", label: "Крупы и бакалея",
    products: [
      { name: "Рис", unit: "кг", hint: 350 },
      { name: "Гречка", unit: "кг", hint: 400 },
      { name: "Масло подсолнечное", unit: "л", hint: 1100 },
    ],
  },
  {
    id: "driedfruits", emoji: "🥜", label: "Сухофрукты и орехи",
    products: [
      { name: "Курага", unit: "кг", hint: 2500 },
      { name: "Грецкий орех", unit: "кг", hint: 3500 },
      { name: "Миндаль", unit: "кг", hint: 4000 },
    ],
  },
  {
    id: "greens", emoji: "🌿", label: "Зелень",
    products: [
      { name: "Укроп", unit: "пучок", hint: 80 },
      { name: "Петрушка", unit: "пучок", hint: 80 },
      { name: "Кинза", unit: "пучок", hint: 100 },
    ],
  },
  {
    id: "other", emoji: "📦", label: "Другое",
    products: [],
  },
];

export function getCategoryById(id: ProductCategory): CategoryDef | undefined {
  return PRODUCT_CATALOG.find(c => c.id === id);
}
