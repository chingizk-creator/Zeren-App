"use client";

import { useEffect } from "react";
import { AppProvider, useApp } from "@/context/AppContext";
import Header from "@/components/navigation/Header";
import BottomNav from "@/components/navigation/BottomNav";
import FloatingCart from "@/components/navigation/FloatingCart";
import Toast from "@/components/ui/Toast";
import OrderSuccess from "@/components/ui/OrderSuccess";
import HomeScreen from "@/screens/HomeScreen";
import CartScreen from "@/screens/CartScreen";
import TrackingScreen from "@/screens/TrackingScreen";
import SavingsScreen from "@/screens/SavingsScreen";
import SubscriptionScreen from "@/screens/SubscriptionScreen";

// Screen titles for non-home screens
const SCREEN_TITLES: Record<string, string | undefined> = {
  cart: "Корзина",
  tracking: "Трекинг",
  savings: "Экономия",
  subscription: "Подписка",
};

function AppShell() {
  const { state, showToast } = useApp();
  const { screen } = state;

  // First-load toast notification (5s delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      showToast(
        "🍅 Цена дня!",
        "Помидоры ₸480/кг — на 44% дешевле Magnum",
        "🍅"
      );
    }, 5000);
    return () => clearTimeout(timer);
  }, [showToast]);

  const screenTitle = SCREEN_TITLES[screen];

  return (
    <div className="app-shell">
      {/* Header */}
      <Header title={screenTitle} />

      {/* Screen content */}
      <main
        style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}
        id="main-content"
      >
        {screen === "home" && <HomeScreen />}
        {screen === "cart" && <CartScreen />}
        {screen === "tracking" && <TrackingScreen />}
        {screen === "savings" && <SavingsScreen />}
        {screen === "subscription" && <SubscriptionScreen />}
      </main>

      {/* Floating cart bar */}
      <FloatingCart />

      {/* Bottom navigation */}
      <BottomNav />

      {/* Overlays */}
      <Toast />
      <OrderSuccess />
    </div>
  );
}

export default function Page() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
