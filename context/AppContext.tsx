"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  useEffect,
  type ReactNode,
} from "react";
import type { Product } from "@/data/products";

const CART_STORAGE_KEY = "zeren_cart";

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (raw) return JSON.parse(raw) as CartItem[];
  } catch {}
  return [];
}

function saveCart(cart: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch {}
}

// ────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────

export type Screen = "home" | "cart" | "tracking" | "savings" | "subscription" | "profile";

export interface CartItem {
  id: number;
  name: string;
  emoji: string;
  price: number;
  retailPrice: number;
  unit: string;
  vendorName: string;
  stallNumber: number;
  quantity: number;
}

export interface OrderHistoryEntry {
  id: string;
  date: string;
  itemCount: number;
  total: number;
  savings: number;
  savingsPercent: number;
}

export interface AppState {
  screen: Screen;
  cart: CartItem[];
  activeSubscription: string;
  trackingStep: number;
  hasActiveOrder: boolean;
  orderSavings: number;
  orderHistory: OrderHistoryEntry[];
  lifetimeSavings: number;
  toastVisible: boolean;
  toastTitle: string;
  toastDesc: string;
  toastEmoji: string;
  orderSuccessVisible: boolean;
}

type Action =
  | { type: "SET_SCREEN"; screen: Screen }
  | { type: "ADD_TO_CART"; product: Product }
  | { type: "REMOVE_FROM_CART"; id: number }
  | { type: "UPDATE_QUANTITY"; id: number; quantity: number }
  | { type: "CLEAR_CART" }
  | { type: "SET_SUBSCRIPTION"; planId: string }
  | { type: "SET_TRACKING_STEP"; step: number }
  | { type: "START_ORDER"; savings: number }
  | { type: "COMPLETE_ORDER" }
  | { type: "SHOW_TOAST"; title: string; desc: string; emoji: string }
  | { type: "HIDE_TOAST" }
  | { type: "SHOW_ORDER_SUCCESS" }
  | { type: "HIDE_ORDER_SUCCESS" }
  | { type: "SET_CART"; items: CartItem[] };

// ────────────────────────────────────────────────
// Mock order history
// ────────────────────────────────────────────────

const MOCK_ORDER_HISTORY: OrderHistoryEntry[] = [
  {
    id: "ord-1",
    date: "3 апр",
    itemCount: 8,
    total: 6840,
    savings: 3120,
    savingsPercent: 31,
  },
  {
    id: "ord-2",
    date: "28 мар",
    itemCount: 5,
    total: 5200,
    savings: 2100,
    savingsPercent: 29,
  },
  {
    id: "ord-3",
    date: "21 мар",
    itemCount: 12,
    total: 9800,
    savings: 4200,
    savingsPercent: 30,
  },
  {
    id: "ord-4",
    date: "14 мар",
    itemCount: 6,
    total: 7100,
    savings: 2980,
    savingsPercent: 30,
  },
  {
    id: "ord-5",
    date: "7 мар",
    itemCount: 9,
    total: 8500,
    savings: 3640,
    savingsPercent: 30,
  },
];

// ────────────────────────────────────────────────
// Initial state
// ────────────────────────────────────────────────

const initialState: AppState = {
  screen: "home",
  cart: [],
  activeSubscription: "plus",
  trackingStep: -1,
  hasActiveOrder: false,
  orderSavings: 0,
  orderHistory: MOCK_ORDER_HISTORY,
  lifetimeSavings: 187340,
  toastVisible: false,
  toastTitle: "",
  toastDesc: "",
  toastEmoji: "",
  orderSuccessVisible: false,
};

// ────────────────────────────────────────────────
// Reducer
// ────────────────────────────────────────────────

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "SET_SCREEN":
      return { ...state, screen: action.screen };

    case "ADD_TO_CART": {
      const existing = state.cart.find((i) => i.id === action.product.id);
      if (existing) {
        return {
          ...state,
          cart: state.cart.map((i) =>
            i.id === action.product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      const newItem: CartItem = {
        id: action.product.id,
        name: action.product.name,
        emoji: action.product.emoji,
        price: action.product.price,
        retailPrice: action.product.retailPrice,
        unit: action.product.unit,
        vendorName: action.product.vendorName,
        stallNumber: action.product.stallNumber,
        quantity: 1,
      };
      return { ...state, cart: [...state.cart, newItem] };
    }

    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((i) => i.id !== action.id),
      };

    case "UPDATE_QUANTITY": {
      if (action.quantity <= 0) {
        return {
          ...state,
          cart: state.cart.filter((i) => i.id !== action.id),
        };
      }
      return {
        ...state,
        cart: state.cart.map((i) =>
          i.id === action.id ? { ...i, quantity: action.quantity } : i
        ),
      };
    }

    case "CLEAR_CART":
      return { ...state, cart: [] };

    case "SET_SUBSCRIPTION":
      return { ...state, activeSubscription: action.planId };

    case "SET_TRACKING_STEP":
      return { ...state, trackingStep: action.step };

    case "START_ORDER":
      return {
        ...state,
        hasActiveOrder: true,
        trackingStep: 0,
        orderSavings: action.savings,
      };

    case "COMPLETE_ORDER": {
      const cartTotal = state.cart.reduce(
        (s, i) => s + i.price * i.quantity,
        0
      );
      const cartRetail = state.cart.reduce(
        (s, i) => s + i.retailPrice * i.quantity,
        0
      );
      const savingsAmt = cartRetail - cartTotal;
      const pct = cartRetail > 0 ? Math.round((savingsAmt / cartRetail) * 100) : 0;
      const newEntry: OrderHistoryEntry = {
        id: `ord-${Date.now()}`,
        date: new Date().toLocaleDateString("ru-RU", {
          day: "numeric",
          month: "short",
        }),
        itemCount: state.cart.reduce((s, i) => s + i.quantity, 0),
        total: cartTotal,
        savings: savingsAmt,
        savingsPercent: pct,
      };
      return {
        ...state,
        hasActiveOrder: false,
        trackingStep: -1,
        lifetimeSavings: state.lifetimeSavings + savingsAmt,
        orderHistory: [newEntry, ...state.orderHistory],
      };
    }

    case "SHOW_TOAST":
      return {
        ...state,
        toastVisible: true,
        toastTitle: action.title,
        toastDesc: action.desc,
        toastEmoji: action.emoji,
      };

    case "HIDE_TOAST":
      return { ...state, toastVisible: false };

    case "SHOW_ORDER_SUCCESS":
      return { ...state, orderSuccessVisible: true };

    case "HIDE_ORDER_SUCCESS":
      return { ...state, orderSuccessVisible: false };

    case "SET_CART":
      return { ...state, cart: action.items };

    default:
      return state;
  }
}

// ────────────────────────────────────────────────
// Context
// ────────────────────────────────────────────────

interface AppContextValue {
  state: AppState;
  setScreen: (screen: Screen) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  setSubscription: (planId: string) => void;
  setTrackingStep: (step: number) => void;
  startOrder: (savings: number) => void;
  completeOrder: () => void;
  showToast: (title: string, desc: string, emoji: string) => void;
  hideToast: () => void;
  showOrderSuccess: () => void;
  hideOrderSuccess: () => void;
  cartTotal: number;
  cartRetailTotal: number;
  cartSavings: number;
  cartItemCount: number;
  getQuantityInCart: (id: number) => number;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Hydrate cart from localStorage after first mount (avoids SSR hydration mismatch)
  useEffect(() => {
    const saved = loadCart();
    if (saved.length > 0) dispatch({ type: "SET_CART", items: saved });
  }, []);

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    saveCart(state.cart);
  }, [state.cart]);

  const setScreen = useCallback((screen: Screen) => dispatch({ type: "SET_SCREEN", screen }), []);
  const addToCart = useCallback((product: Product) => dispatch({ type: "ADD_TO_CART", product }), []);
  const removeFromCart = useCallback((id: number) => dispatch({ type: "REMOVE_FROM_CART", id }), []);
  const updateQuantity = useCallback((id: number, quantity: number) => dispatch({ type: "UPDATE_QUANTITY", id, quantity }), []);
  const clearCart = useCallback(() => dispatch({ type: "CLEAR_CART" }), []);
  const setSubscription = useCallback((planId: string) => dispatch({ type: "SET_SUBSCRIPTION", planId }), []);
  const setTrackingStep = useCallback((step: number) => dispatch({ type: "SET_TRACKING_STEP", step }), []);
  const startOrder = useCallback((savings: number) => dispatch({ type: "START_ORDER", savings }), []);
  const completeOrder = useCallback(() => dispatch({ type: "COMPLETE_ORDER" }), []);
  const showToast = useCallback((title: string, desc: string, emoji: string) => dispatch({ type: "SHOW_TOAST", title, desc, emoji }), []);
  const hideToast = useCallback(() => dispatch({ type: "HIDE_TOAST" }), []);
  const showOrderSuccess = useCallback(() => dispatch({ type: "SHOW_ORDER_SUCCESS" }), []);
  const hideOrderSuccess = useCallback(() => dispatch({ type: "HIDE_ORDER_SUCCESS" }), []);

  const cartTotal = useMemo(
    () => state.cart.reduce((s, i) => s + i.price * i.quantity, 0),
    [state.cart]
  );
  const cartRetailTotal = useMemo(
    () => state.cart.reduce((s, i) => s + i.retailPrice * i.quantity, 0),
    [state.cart]
  );
  const cartSavings = cartRetailTotal - cartTotal;
  const cartItemCount = useMemo(
    () => state.cart.reduce((s, i) => s + i.quantity, 0),
    [state.cart]
  );
  const getQuantityInCart = useCallback(
    (id: number) => state.cart.find((i) => i.id === id)?.quantity ?? 0,
    [state.cart]
  );

  const value = useMemo<AppContextValue>(
    () => ({
      state,
      setScreen,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      setSubscription,
      setTrackingStep,
      startOrder,
      completeOrder,
      showToast,
      hideToast,
      showOrderSuccess,
      hideOrderSuccess,
      cartTotal,
      cartRetailTotal,
      cartSavings,
      cartItemCount,
      getQuantityInCart,
    }),
    [
      state,
      setScreen,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      setSubscription,
      setTrackingStep,
      startOrder,
      completeOrder,
      showToast,
      hideToast,
      showOrderSuccess,
      hideOrderSuccess,
      cartTotal,
      cartRetailTotal,
      cartSavings,
      cartItemCount,
      getQuantityInCart,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
