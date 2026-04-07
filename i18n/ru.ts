const ru = {
  brand: "ZEREN",
  tagline: "Даланың дәмі — үйіңізге",
  location: "📍 Алматы",

  // Home
  savings_label: "Ваша экономия",
  gazelle_rank: "Топ 12%",
  search_placeholder: "Поиск продуктов...",
  sandyq_title: "📦 Сандық недели",
  sandyq_desc: "Лучшее с сегодняшнего базара",
  sandyq_price: "₸3,500",
  sandyq_cta: "Хочу",
  live_indicator: "С сегодняшнего базара · Алтын Орда · 8:30",
  in_cart: "В корзину",
  from_bazaar: "С сегодняшнего базара",

  // Categories
  cat_all: "Все",
  cat_popular: "Хиты",
  cat_veg: "Овощи",
  cat_fruit: "Фрукты",
  cat_meat: "Мясо",
  cat_dairy: "Молочка",
  cat_grain: "Крупы",
  cat_herb: "Зелень",
  cat_nut: "Орехи",

  // Cart
  cart_empty: "Корзина пуста",
  cart_empty_sub: "Добавьте свежих продуктов с базара",
  cart_shop: "За покупками",
  cart_title: "Корзина",
  cart_in_magnum: "В Magnum",
  economy: "Экономия",
  delivery: "Доставка",
  free_delivery: "Бесплатная доставка",
  checkout: "Заказать",
  min_order: "Мин. ₸5,000",

  // Order success
  order_placed: "Заказ оформлен!",
  order_sub: "Zeren мчится на базар 🦌",

  // Tracking
  tracking_title: "Ваш заказ",
  tracking_subtitle: "Доставка 18:00–20:00",
  step_0_title: "Заказ принят",
  step_0_sub: "Формируем список",
  step_1_title: "На базаре",
  step_1_sub: "Пикер на Алтын Орде",
  step_2_title: "Качество",
  step_2_sub: "Проверяем продукты",
  step_3_title: "В пути",
  step_3_sub: "Курьер выехал",
  step_4_title: "Доставлено!",
  step_4_sub: "Приятного аппетита",
  step_current: "Сейчас...",
  no_active_order: "Нет активных заказов",
  no_active_order_sub: "Оформите заказ, и мы доставим свежее с базара",

  // Map
  map_prep: "📍 Подготовка",
  map_bazaar: "🏪 Алтын Орда",
  map_courier: "🚗 Курьер в 2 мин",

  // Savings
  savings_title: "СЭКОНОМЛЕНО С ZEREN",
  city_savings_title: "АЛМАТЫ ВМЕСТЕ",
  city_savings_sub: "этим месяцем 🦌",
  share: "📤 Поделиться",
  no_orders_yet: "Здесь появится ваша история экономии",

  // Subscription
  sub_title: "Подписка",
  sub_active: "Активна",
  sub_choose: "Выбрать план",
  sub_popular: "Популярный",
  sub_annual_title: "Годовой план — скидка 20%",
  sub_annual_desc: "Оплатите год вперёд и сэкономьте 2 месяца",
  sub_annual_cta: "Узнать больше",
  sub_unlimited: "Безлимит",
  sub_deliveries: "доставок/мес",
  sub_no_min: "Без ограничений",
  sub_sandyq_yes: "Сандық в подарок",
  sub_sandyq_no: "Без Сандыка",

  // Nav
  nav_home: "Главная",
  nav_cart: "Корзина",
  nav_tracking: "Трекинг",
  nav_savings: "Экономия",
  nav_profile: "Профиль",

  // Toast
  toast_price_title: "🍅 Цена дня!",
  toast_price_desc: "Помидоры ₸480/кг — на 44% дешевле Magnum",
  toast_delivered_title: "✅ Доставлено!",

  // Units
  unit_kg: "кг",
  unit_l: "л",
  unit_pack: "уп",
  unit_bunch: "пуч",
  unit_pcs: "шт",
} as const;

export type I18nKey = keyof typeof ru;
export default ru;
