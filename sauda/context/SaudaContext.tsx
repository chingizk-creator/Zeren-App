"use client";

import React, {
  createContext, useContext, useReducer, useCallback, useMemo, useEffect,
  useRef, type ReactNode,
} from "react";
import type {
  Order, Vendor, Settlement, Loan, SaudaTab,
} from "@/sauda/data/mock";
import {
  MOCK_VENDOR, MOCK_PENDING_ORDERS, MOCK_COMPLETED_ORDERS,
  MOCK_ACTIVE_LOAN, MOCK_SETTLEMENTS,
} from "@/sauda/data/mock";

// ─── State ────────────────────────────────────────────────────────────────────

export interface SaudaState {
  tab: SaudaTab;
  vendor: Vendor;
  pendingOrders: Order[];
  completedOrders: Order[];
  activeOrder: Order | null;          // order open in negotiation modal
  activeLoan: Loan;
  settlements: Settlement[];
  toastVisible: boolean;
  toastTitle: string;
  toastDesc: string;
  toastEmoji: string;
  isOnline: boolean;
  pendingSync: boolean;
  loanModalOpen: boolean;
  instantPayOrder: Settlement | null;
  negotiationWaiting: boolean;        // "waiting for Zeren response"
  negotiationResolved: boolean;       // response received
  negotiationAccepted: boolean;       // Zeren accepted counter
  zerenCounterPrice: number | null;   // Zeren's counter after vendor's counter
}

type Action =
  | { type: "SET_TAB"; tab: SaudaTab }
  | { type: "ACCEPT_ORDER"; orderId: string }
  | { type: "REJECT_ORDER"; orderId: string }
  | { type: "OPEN_NEGOTIATION"; order: Order }
  | { type: "CLOSE_NEGOTIATION" }
  | { type: "EXPIRE_ORDER"; orderId: string }
  | { type: "SUBMIT_COUNTER"; orderId: string; counterPrice: number }
  | { type: "ZEREN_ACCEPTS_COUNTER"; orderId: string; finalPrice: number }
  | { type: "ZEREN_COUNTERS"; orderId: string; zerenPrice: number }
  | { type: "ACCEPT_ZEREN_COUNTER"; orderId: string }
  | { type: "SHOW_TOAST"; title: string; desc: string; emoji: string }
  | { type: "HIDE_TOAST" }
  | { type: "SET_ONLINE"; online: boolean }
  | { type: "OPEN_LOAN_MODAL" }
  | { type: "CLOSE_LOAN_MODAL" }
  | { type: "OPEN_INSTANT_PAY"; settlement: Settlement }
  | { type: "CLOSE_INSTANT_PAY" }
  | { type: "COMPLETE_INSTANT_PAY"; settlementId: string }
  | { type: "APPLY_LOAN"; amount: number; monthlyPayment: number }
  | { type: "SET_NEGOTIATION_WAITING"; waiting: boolean }
  | { type: "ADD_NEW_ORDER"; order: Order };

// ─── Helpers ──────────────────────────────────────────────────────────────────

function moveToCompleted(state: SaudaState, orderId: string, finalPrice: number): SaudaState {
  const order = state.pendingOrders.find(o => o.id === orderId);
  if (!order) return state;
  const completed: Order = { ...order, status: "completed", finalPrice };
  const vendor = { ...state.vendor };
  vendor.metrics = {
    ...vendor.metrics,
    monthlyRevenue: vendor.metrics.monthlyRevenue + finalPrice * order.quantity,
    monthlyOrders: vendor.metrics.monthlyOrders + 1,
    monthlyVolume: vendor.metrics.monthlyVolume + order.quantity,
  };
  return {
    ...state,
    pendingOrders: state.pendingOrders.filter(o => o.id !== orderId),
    completedOrders: [completed, ...state.completedOrders],
    activeOrder: null,
    negotiationWaiting: false,
    negotiationResolved: false,
    negotiationAccepted: false,
    zerenCounterPrice: null,
    vendor,
  };
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

function reducer(state: SaudaState, action: Action): SaudaState {
  switch (action.type) {
    case "SET_TAB":
      return { ...state, tab: action.tab };

    case "ACCEPT_ORDER":
      return moveToCompleted(
        state,
        action.orderId,
        state.pendingOrders.find(o => o.id === action.orderId)?.zerenOfferPrice ?? 0,
      );

    case "REJECT_ORDER": {
      const rejected = state.pendingOrders.find(o => o.id === action.orderId);
      if (!rejected) return state;
      const updated: Order = { ...rejected, status: "rejected", finalPrice: null };
      return {
        ...state,
        pendingOrders: state.pendingOrders.filter(o => o.id !== action.orderId),
        completedOrders: [updated, ...state.completedOrders],
        activeOrder: null,
      };
    }

    case "OPEN_NEGOTIATION":
      return {
        ...state,
        activeOrder: action.order,
        negotiationWaiting: false,
        negotiationResolved: false,
        negotiationAccepted: false,
        zerenCounterPrice: null,
      };

    case "CLOSE_NEGOTIATION":
      return { ...state, activeOrder: null, negotiationWaiting: false, negotiationResolved: false, negotiationAccepted: false, zerenCounterPrice: null };

    case "EXPIRE_ORDER": {
      const expired = state.pendingOrders.find(o => o.id === action.orderId);
      if (!expired) return state;
      return {
        ...state,
        pendingOrders: state.pendingOrders.filter(o => o.id !== action.orderId),
        completedOrders: [{ ...expired, status: "expired" }, ...state.completedOrders],
        activeOrder: state.activeOrder?.id === action.orderId ? null : state.activeOrder,
      };
    }

    case "SUBMIT_COUNTER": {
      const updated = state.pendingOrders.map(o =>
        o.id === action.orderId
          ? { ...o, status: "negotiating" as const, vendorCounterPrice: action.counterPrice, negotiationRound: o.negotiationRound + 1 }
          : o
      );
      const activeOrder = state.activeOrder?.id === action.orderId
        ? { ...state.activeOrder, status: "negotiating" as const, vendorCounterPrice: action.counterPrice, negotiationRound: state.activeOrder.negotiationRound + 1 }
        : state.activeOrder;
      return { ...state, pendingOrders: updated, activeOrder, negotiationWaiting: true };
    }

    case "ZEREN_ACCEPTS_COUNTER":
      return {
        ...moveToCompleted(state, action.orderId, action.finalPrice),
        negotiationResolved: true,
        negotiationAccepted: true,
      };

    case "ZEREN_COUNTERS":
      return {
        ...state,
        negotiationWaiting: false,
        negotiationResolved: true,
        negotiationAccepted: false,
        zerenCounterPrice: action.zerenPrice,
      };

    case "ACCEPT_ZEREN_COUNTER":
      return moveToCompleted(
        { ...state, negotiationResolved: false, negotiationAccepted: false, zerenCounterPrice: null },
        action.orderId,
        state.zerenCounterPrice ?? state.pendingOrders.find(o => o.id === action.orderId)?.zerenOfferPrice ?? 0,
      );

    case "SHOW_TOAST":
      return { ...state, toastVisible: true, toastTitle: action.title, toastDesc: action.desc, toastEmoji: action.emoji };

    case "HIDE_TOAST":
      return { ...state, toastVisible: false };

    case "SET_ONLINE":
      return { ...state, isOnline: action.online };

    case "OPEN_LOAN_MODAL":
      return { ...state, loanModalOpen: true };

    case "CLOSE_LOAN_MODAL":
      return { ...state, loanModalOpen: false };

    case "OPEN_INSTANT_PAY":
      return { ...state, instantPayOrder: action.settlement };

    case "CLOSE_INSTANT_PAY":
      return { ...state, instantPayOrder: null };

    case "COMPLETE_INSTANT_PAY":
      return {
        ...state,
        instantPayOrder: null,
        settlements: state.settlements.map(s =>
          s.id === action.settlementId ? { ...s, status: "instant" as const, paidDate: "Сейчас" } : s
        ),
      };

    case "APPLY_LOAN":
      return {
        ...state,
        loanModalOpen: false,
        activeLoan: {
          ...state.activeLoan,
          amount: action.amount,
          monthlyPayment: action.monthlyPayment,
          status: "active",
          remainingBalance: action.amount,
        },
      };

    case "SET_NEGOTIATION_WAITING":
      return { ...state, negotiationWaiting: action.waiting };

    case "ADD_NEW_ORDER":
      return { ...state, pendingOrders: [action.order, ...state.pendingOrders] };

    default:
      return state;
  }
}

// ─── Initial state ────────────────────────────────────────────────────────────

const initialState: SaudaState = {
  tab: "orders",
  vendor: MOCK_VENDOR,
  pendingOrders: MOCK_PENDING_ORDERS,
  completedOrders: MOCK_COMPLETED_ORDERS,
  activeOrder: null,
  activeLoan: MOCK_ACTIVE_LOAN,
  settlements: MOCK_SETTLEMENTS,
  toastVisible: false,
  toastTitle: "",
  toastDesc: "",
  toastEmoji: "",
  isOnline: true,
  pendingSync: false,
  loanModalOpen: false,
  instantPayOrder: null,
  negotiationWaiting: false,
  negotiationResolved: false,
  negotiationAccepted: false,
  zerenCounterPrice: null,
};

// ─── Context ──────────────────────────────────────────────────────────────────

interface SaudaContextValue {
  state: SaudaState;
  setTab: (tab: SaudaTab) => void;
  acceptOrder: (orderId: string) => void;
  rejectOrder: (orderId: string) => void;
  openNegotiation: (order: Order) => void;
  closeNegotiation: () => void;
  expireOrder: (orderId: string) => void;
  submitCounter: (orderId: string, counterPrice: number) => void;
  acceptZerenCounter: (orderId: string) => void;
  showToast: (title: string, desc: string, emoji: string) => void;
  hideToast: () => void;
  openLoanModal: () => void;
  closeLoanModal: () => void;
  openInstantPay: (settlement: Settlement) => void;
  closeInstantPay: () => void;
  completeInstantPay: (settlementId: string) => void;
  applyLoan: (amount: number, monthlyPayment: number) => void;
  todayRevenue: number;
  todayVolume: number;
  todayOrderCount: number;
  todayAvgPrice: number;
}

const SaudaContext = createContext<SaudaContextValue | null>(null);

// ─── Mock new order (arrives 8s after mount) ─────────────────────────────────

const DEMO_NEW_ORDER: Order = {
  id: "ord-demo",
  status: "pending",
  product: "Помидоры узбекские",
  emoji: "🍅",
  quantity: 60,
  unit: "кг",
  zerenOfferPrice: 410,
  vendorRetailPrice: 500,
  vendorCounterPrice: null,
  finalPrice: null,
  expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
  negotiationRound: 0,
  isSelectOrder: false,
  createdAt: new Date().toISOString(),
};

// ─── Provider ─────────────────────────────────────────────────────────────────

export function SaudaProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const demoOrderFired = useRef(false);

  // Demo: new order notification after 8s
  useEffect(() => {
    if (demoOrderFired.current) return;
    const t = setTimeout(() => {
      demoOrderFired.current = true;
      dispatch({ type: "ADD_NEW_ORDER", order: { ...DEMO_NEW_ORDER, expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString() } });
      dispatch({ type: "SHOW_TOAST", title: "Новый заказ!", desc: "Помидоры 60 кг · ₸410/кг · Ответьте за 5 мин", emoji: "🔔" });
    }, 8000);
    return () => clearTimeout(t);
  }, []);

  // Auto-hide toast after 4s
  useEffect(() => {
    if (!state.toastVisible) return;
    const t = setTimeout(() => dispatch({ type: "HIDE_TOAST" }), 4000);
    return () => clearTimeout(t);
  }, [state.toastVisible, state.toastTitle]);

  // Computed: today's stats from completed orders
  const todayRevenue = useMemo(
    () => state.completedOrders
      .filter(o => o.status === "completed")
      .reduce((s, o) => s + (o.finalPrice ?? 0) * o.quantity, 0),
    [state.completedOrders]
  );
  const todayVolume = useMemo(
    () => state.completedOrders.filter(o => o.status === "completed").reduce((s, o) => s + o.quantity, 0),
    [state.completedOrders]
  );
  const todayOrderCount = useMemo(
    () => state.completedOrders.filter(o => o.status === "completed").length,
    [state.completedOrders]
  );
  const todayAvgPrice = todayVolume > 0 ? Math.round(todayRevenue / todayVolume) : 0;

  // Actions
  const setTab = useCallback((tab: SaudaTab) => dispatch({ type: "SET_TAB", tab }), []);
  const acceptOrder = useCallback((orderId: string) => {
    dispatch({ type: "ACCEPT_ORDER", orderId });
    dispatch({ type: "SHOW_TOAST", title: "Заказ принят!", desc: "Заказ добавлен в выполненные", emoji: "✅" });
  }, []);
  const rejectOrder = useCallback((orderId: string) => {
    dispatch({ type: "REJECT_ORDER", orderId });
  }, []);
  const openNegotiation = useCallback((order: Order) => dispatch({ type: "OPEN_NEGOTIATION", order }), []);
  const closeNegotiation = useCallback(() => dispatch({ type: "CLOSE_NEGOTIATION" }), []);
  const expireOrder = useCallback((orderId: string) => dispatch({ type: "EXPIRE_ORDER", orderId }), []);

  const submitCounter = useCallback((orderId: string, counterPrice: number) => {
    dispatch({ type: "SUBMIT_COUNTER", orderId, counterPrice });
    // Simulate Zeren response after 3-5s
    const delay = 3000 + Math.random() * 2000;
    const order = state.pendingOrders.find(o => o.id === orderId);
    if (!order) return;
    const gap = counterPrice - order.zerenOfferPrice;
    const pct = gap / order.zerenOfferPrice;
    setTimeout(() => {
      if (pct <= 0.08) {
        // Accept counter
        dispatch({ type: "ZEREN_ACCEPTS_COUNTER", orderId, finalPrice: counterPrice });
        dispatch({ type: "SHOW_TOAST", title: "Предложение принято!", desc: `₸${counterPrice}/кг · Заказ выполнен`, emoji: "✅" });
      } else {
        // Counter with midpoint
        const midPrice = Math.round((order.zerenOfferPrice + counterPrice) / 2 / 10) * 10;
        dispatch({ type: "ZEREN_COUNTERS", orderId, zerenPrice: midPrice });
      }
    }, delay);
  }, [state.pendingOrders]);

  const acceptZerenCounter = useCallback((orderId: string) => {
    dispatch({ type: "ACCEPT_ZEREN_COUNTER", orderId });
    dispatch({ type: "SHOW_TOAST", title: "Сделка!", desc: "Встречное предложение принято", emoji: "🤝" });
  }, []);

  const showToast = useCallback((title: string, desc: string, emoji: string) =>
    dispatch({ type: "SHOW_TOAST", title, desc, emoji }), []);
  const hideToast = useCallback(() => dispatch({ type: "HIDE_TOAST" }), []);
  const openLoanModal = useCallback(() => dispatch({ type: "OPEN_LOAN_MODAL" }), []);
  const closeLoanModal = useCallback(() => dispatch({ type: "CLOSE_LOAN_MODAL" }), []);
  const openInstantPay = useCallback((s: Settlement) => dispatch({ type: "OPEN_INSTANT_PAY", settlement: s }), []);
  const closeInstantPay = useCallback(() => dispatch({ type: "CLOSE_INSTANT_PAY" }), []);
  const completeInstantPay = useCallback((id: string) => {
    dispatch({ type: "COMPLETE_INSTANT_PAY", settlementId: id });
    dispatch({ type: "SHOW_TOAST", title: "Выплата отправлена!", desc: "Деньги поступят в течение нескольких минут", emoji: "💰" });
  }, []);
  const applyLoan = useCallback((amount: number, monthlyPayment: number) => {
    dispatch({ type: "APPLY_LOAN", amount, monthlyPayment });
    dispatch({ type: "SHOW_TOAST", title: "Кредит одобрен!", desc: `₸${(amount / 1000).toFixed(0)}K будут перечислены на ваш счёт`, emoji: "💳" });
  }, []);

  const value = useMemo<SaudaContextValue>(() => ({
    state, setTab, acceptOrder, rejectOrder, openNegotiation, closeNegotiation,
    expireOrder, submitCounter, acceptZerenCounter, showToast, hideToast,
    openLoanModal, closeLoanModal, openInstantPay, closeInstantPay, completeInstantPay,
    applyLoan, todayRevenue, todayVolume, todayOrderCount, todayAvgPrice,
  }), [
    state, setTab, acceptOrder, rejectOrder, openNegotiation, closeNegotiation,
    expireOrder, submitCounter, acceptZerenCounter, showToast, hideToast,
    openLoanModal, closeLoanModal, openInstantPay, closeInstantPay, completeInstantPay,
    applyLoan, todayRevenue, todayVolume, todayOrderCount, todayAvgPrice,
  ]);

  return <SaudaContext.Provider value={value}>{children}</SaudaContext.Provider>;
}

export function useSauda(): SaudaContextValue {
  const ctx = useContext(SaudaContext);
  if (!ctx) throw new Error("useSauda must be used within SaudaProvider");
  return ctx;
}
