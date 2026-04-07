"use client";

import { useApp } from "@/context/AppContext";
import { formatPrice } from "@/utils/formatPrice";

export default function FloatingCart() {
  const { state, setScreen, cartTotal, cartSavings, cartItemCount } = useApp();
  const { screen, hasActiveOrder } = state;

  const isHidden =
    cartItemCount === 0 ||
    screen === "cart" ||
    screen === "tracking" ||
    hasActiveOrder;

  return (
    <div
      className={`floating-cart${isHidden ? " hidden" : ""}`}
      onClick={() => setScreen("cart")}
      role="button"
      tabIndex={isHidden ? -1 : 0}
      aria-label={`Корзина, ${cartItemCount} товаров, ${formatPrice(cartTotal)}`}
      onKeyDown={(e) => !isHidden && e.key === "Enter" && setScreen("cart")}
    >
      {/* Item count circle */}
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: "50%",
          background: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
        aria-hidden="true"
      >
        <span style={{ fontSize: 13, fontWeight: 700, color: "#D4853A" }}>
          {cartItemCount}
        </span>
      </div>

      {/* Label */}
      <div
        style={{ flex: 1, textAlign: "center" }}
        aria-hidden="true"
      >
        <span style={{ fontSize: 14, fontWeight: 700, color: "white" }}>
          Корзина · {formatPrice(cartTotal)}
        </span>
      </div>

      {/* Savings pill */}
      {cartSavings > 0 && (
        <div
          style={{
            background: "rgba(255,255,255,0.2)",
            borderRadius: 8,
            padding: "4px 8px",
            flexShrink: 0,
          }}
          aria-hidden="true"
        >
          <span style={{ fontSize: 11, fontWeight: 700, color: "white" }}>
            −{formatPrice(cartSavings)}
          </span>
        </div>
      )}
    </div>
  );
}
