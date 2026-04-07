"use client";

import { useApp, type Screen } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";

interface NavItem {
  id: Screen;
  label: string;
  icon: string;
}

const BASE_NAV: NavItem[] = [
  { id: "home", label: "Главная", icon: "🏪" },
  { id: "cart", label: "Корзина", icon: "🛒" },
  { id: "tracking", label: "Трекинг", icon: "📍" },
  { id: "savings", label: "Экономия", icon: "💰" },
];

const GUEST_LAST: NavItem = { id: "subscription", label: "Профиль", icon: "👤" };
const AUTH_LAST: NavItem = { id: "profile", label: "Профиль", icon: "👤" };

export default function BottomNav() {
  const { state, setScreen, cartItemCount } = useApp();
  const { authState } = useAuth();
  const { screen, hasActiveOrder, trackingStep } = state;
  const isAuthenticated = authState.user.isAuthenticated;

  const navItems: NavItem[] = [...BASE_NAV, isAuthenticated ? AUTH_LAST : GUEST_LAST];
  const showTrackingDot = hasActiveOrder && trackingStep >= 0 && trackingStep < 4;

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Основная навигация">
      {navItems.map((item) => {
        const isActive = screen === item.id ||
          // profile and subscription share the last tab slot visually
          (item.id === "profile" && screen === "subscription") ||
          (item.id === "subscription" && screen === "profile");
        const isTracking = item.id === "tracking";
        const isCart = item.id === "cart";

        return (
          <button
            key={item.id}
            className={`nav-item${isActive ? " active" : ""}`}
            onClick={() => setScreen(item.id)}
            aria-label={item.label}
            aria-current={isActive ? "page" : undefined}
            style={{ background: "none", border: "none", padding: "8px 4px", minHeight: 44, minWidth: 0 }}
          >
            {isTracking && showTrackingDot && (
              <div className="nav-active-dot" aria-hidden="true" />
            )}

            <div style={{ position: "relative", display: "inline-flex" }}>
              <span className="nav-icon">{item.icon}</span>
              {isCart && cartItemCount > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: -5,
                    right: -8,
                    background: "#C0392B",
                    color: "white",
                    borderRadius: "50%",
                    width: 16,
                    height: 16,
                    fontSize: 9,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid white",
                  }}
                  aria-label={`${cartItemCount} товаров`}
                >
                  {cartItemCount > 9 ? "9+" : cartItemCount}
                </div>
              )}
            </div>

            <span className="nav-label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
