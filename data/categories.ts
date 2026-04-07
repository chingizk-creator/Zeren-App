export interface Category {
  id: string;
  label: string;
  emoji: string;
}

export const CATEGORIES: Category[] = [
  { id: "all", label: "Все", emoji: "🏪" },
  { id: "popular", label: "Хиты", emoji: "⭐" },
  { id: "veg", label: "Овощи", emoji: "🥕" },
  { id: "fruit", label: "Фрукты", emoji: "🍎" },
  { id: "meat", label: "Мясо", emoji: "🥩" },
  { id: "dairy", label: "Молочка", emoji: "🥛" },
  { id: "grain", label: "Крупы", emoji: "🌾" },
  { id: "herb", label: "Зелень", emoji: "🌿" },
  { id: "nut", label: "Орехи", emoji: "🥜" },
];
