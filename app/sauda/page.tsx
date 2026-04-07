"use client";

import { SaudaProvider, useSauda } from "@/sauda/context/SaudaContext";
import Header from "@/sauda/components/Header";
import BottomNav from "@/sauda/components/BottomNav";
import Toast from "@/sauda/components/Toast";
import NegotiationModal from "@/sauda/components/NegotiationModal";
import OrdersScreen from "@/sauda/screens/OrdersScreen";
import AnalyticsScreen from "@/sauda/screens/AnalyticsScreen";
import FinanceScreen from "@/sauda/screens/FinanceScreen";
import ProfileScreen from "@/sauda/screens/ProfileScreen";

function SaudaShell() {
  const { state } = useSauda();
  const { tab } = state;

  return (
    <div className="app-shell">
      <Header />
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

export default function SaudaPage() {
  return (
    <SaudaProvider>
      <SaudaShell />
    </SaudaProvider>
  );
}
