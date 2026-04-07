"use client";

import { useSauda } from "@/sauda/context/SaudaContext";
import type { SaudaTab } from "@/sauda/data/mock";

const TABS: { id: SaudaTab; label: string; icon: string }[] = [
  { id: "orders", label: "Заказы", icon: "📋" },
  { id: "analytics", label: "Аналитика", icon: "📊" },
  { id: "finance", label: "Финансы", icon: "💰" },
  { id: "profile", label: "Профиль", icon: "👤" },
];

export default function BottomNav() {
  const { state, setTab } = useSauda();
  const { tab, pendingOrders } = state;

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "#FFFFFF",
        borderTop: "1px solid #EAE4D8",
        display: "flex",
        paddingBottom: "env(safe-area-inset-bottom)",
        maxWidth: 420,
        margin: "0 auto",
      }}
    >
      {TABS.map(({ id, label, icon }) => {
        const active = tab === id;
        const showBadge = id === "orders" && pendingOrders.length > 0;

        return (
          <button
            key={id}
            onClick={() => setTab(id)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: 10,
              paddingBottom: 10,
              border: "none",
              background: "none",
              cursor: "pointer",
              minHeight: 56,
              position: "relative",
            }}
          >
            {/* Icon wrapper for badge positioning */}
            <span style={{ position: "relative", display: "inline-block" }}>
              <span style={{ fontSize: 22, opacity: active ? 1 : 0.35 }}>{icon}</span>
              {showBadge && (
                <span
                  style={{
                    position: "absolute",
                    top: -4,
                    right: -8,
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: "#C0392B",
                    fontSize: 9,
                    fontWeight: 700,
                    color: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    lineHeight: 1,
                  }}
                >
                  {pendingOrders.length}
                </span>
              )}
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: active ? "#D4853A" : "#9A9490",
                marginTop: 3,
              }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
