"use client";

import { useEffect, useState } from "react";
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
import OnboardingScreen from "@/screens/OnboardingScreen";

const ONBOARDED_KEY = "zeren_onboarded";

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
      showToast("🍅 Цена дня!", "Помидоры ₸480/кг — на 44% дешевле Magnum", "🍅");
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
        {screen === "subscription" && (
          authState.user.isAuthenticated ? <ProfileScreen /> : <SubscriptionScreen />
        )}
        {screen === "profile" && <ProfileScreen />}
      </main>

      <FloatingCart />
      <BottomNav />
      <AuthFlow />
      <Toast />
      <OrderSuccess />
    </div>
  );
}

export default function AppPage() {
  // Three-state: "loading" (SSR), "onboarding", "app"
  const [phase, setPhase] = useState<"loading" | "onboarding" | "app">("loading");

  useEffect(() => {
    const onboarded = localStorage.getItem(ONBOARDED_KEY);
    setPhase(onboarded ? "app" : "onboarding");
  }, []);

  if (phase === "loading") {
    // Blank cream screen during hydration to avoid flash
    return <div style={{ position: "fixed", inset: 0, background: "#FAF7F0" }} />;
  }

  if (phase === "onboarding") {
    return (
      <OnboardingScreen
        onComplete={() => setPhase("app")}
      />
    );
  }

  return (
    <AppProvider>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </AppProvider>
  );
}
