"use client";

import { useState, useEffect } from "react";
import { OnboardingProvider, useOnboarding } from "@/sauda/context/OnboardingContext";
import { SaudaProvider, useSauda } from "@/sauda/context/SaudaContext";
import OnboardingScreen from "@/sauda/screens/OnboardingScreen";
import Header from "@/sauda/components/Header";
import BottomNav from "@/sauda/components/BottomNav";
import Toast from "@/sauda/components/Toast";
import NegotiationModal from "@/sauda/components/NegotiationModal";
import OrdersScreen from "@/sauda/screens/OrdersScreen";
import AnalyticsScreen from "@/sauda/screens/AnalyticsScreen";
import FinanceScreen from "@/sauda/screens/FinanceScreen";
import ProfileScreen from "@/sauda/screens/ProfileScreen";
import VerificationBanner from "@/sauda/components/status/VerificationBanner";
import TerminationScreen from "@/sauda/components/status/TerminationScreen";

function SaudaShell() {
  const { state: saudaState } = useSauda();
  const { state: onboardingState } = useOnboarding();
  const { tab } = saudaState;
  const { vendorStatus } = onboardingState;

  if (vendorStatus === "terminated") {
    return <TerminationScreen />;
  }

  return (
    <div className="app-shell">
      <Header />
      <VerificationBanner status={vendorStatus} />
      <main style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
        {tab === "orders" && <OrdersScreen />}
        {tab === "analytics" && <AnalyticsScreen />}
        {tab === "finance" && <FinanceScreen />}
        {tab === "profile" && <ProfileScreen />}
      </main>
      <BottomNav />
      <NegotiationModal />
      <Toast />
    </div>
  );
}

function AppGate() {
  const { state } = useOnboarding();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => { setHydrated(true); }, []);

  if (!hydrated) {
    return <div style={{ height: "100dvh", background: "#FAF7F0" }} />;
  }

  if (!state.isComplete) {
    return <OnboardingScreen />;
  }

  return (
    <SaudaProvider>
      <SaudaShell />
    </SaudaProvider>
  );
}

export default function SaudaPage() {
  return (
    <OnboardingProvider>
      <AppGate />
    </OnboardingProvider>
  );
}
