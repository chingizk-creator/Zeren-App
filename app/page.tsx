"use client";

import { useEffect } from "react";
import { AppProvider, useApp } from "@/context/AppContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Header from "@/components/navigation/Header";
import BottomNav from "@/components/navigation/BottomNav";
import FloatingCart from "@/components/navigation/FloatingCart";
import Toast from "@/components/ui/Toast";
import OrderSuccess from "@/components/ui/OrderSuccess";
import AuthFlow from "@/components/auth/AuthFlow";
import HomeScreen from "@/screens/HomeScreen";
import CartScreen from "@/screens/CartScreen";
import TrackingScreen from "@/screens/TrackingScreen";
import SavingsScreen from "@/screens/SavingsScreen";
import SubscriptionScreen from "@/screens/SubscriptionScreen";
import ProfileScreen from "@/screens/ProfileScreen";

const SCREEN_TITLES: Record<string, string | undefined> = {
  cart: "Корзина",
  tracking: "Трекинг",
  savings: "Экономия",
  subscription: "Подписка",
  profile: "Профиль",
};

function AppShell() {
  const { state, showToast } = useApp();
  const { authState } = useAuth();
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
      <Header title={screenTitle} />

      <main
        style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}
        id="main-content"
      >
        {screen === "home" && <HomeScreen />}
        {screen === "cart" && <CartScreen />}
        {screen === "tracking" && <TrackingScreen />}
        {screen === "savings" && <SavingsScreen />}
        {/* Show ProfileScreen for logged-in users, SubscriptionScreen for guests */}
        {screen === "subscription" && (
          authState.user.isAuthenticated ? <ProfileScreen /> : <SubscriptionScreen />
        )}
        {screen === "profile" && <ProfileScreen />}
      </main>

      <FloatingCart />
      <BottomNav />

      {/* Auth flow modals (rendered on top of everything) */}
      <AuthFlow />

      {/* App-level overlays */}
      <Toast />
      <OrderSuccess />
    </div>
  );
}

export default function Page() {
  return (
    <AppProvider>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </AppProvider>
  );
}
