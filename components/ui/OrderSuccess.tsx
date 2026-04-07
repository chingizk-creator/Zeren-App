"use client";

import { useEffect } from "react";
import { useApp } from "@/context/AppContext";

export default function OrderSuccess() {
  const { state, hideOrderSuccess } = useApp();

  useEffect(() => {
    if (state.orderSuccessVisible) {
      const timer = setTimeout(() => {
        hideOrderSuccess();
      }, 2400);
      return () => clearTimeout(timer);
    }
  }, [state.orderSuccessVisible, hideOrderSuccess]);

  if (!state.orderSuccessVisible) return null;

  return (
    <div
      className="order-success"
      role="dialog"
      aria-modal="true"
      aria-label="Заказ оформлен"
    >
      <div
        style={{ fontSize: 64, animation: "breathe 1.2s ease-in-out infinite" }}
        aria-hidden="true"
      >
        🦌
      </div>
      <div
        style={{
          fontFamily: "Georgia, serif",
          fontSize: 26,
          fontWeight: 700,
          color: "#C8A96E",
          textAlign: "center",
          marginBottom: 8,
        }}
      >
        Заказ оформлен!
      </div>
      <div
        style={{
          fontSize: 14,
          color: "#E8D5A8",
          textAlign: "center",
        }}
      >
        Zeren мчится на базар 🏃
      </div>

      {/* Pulsing dots */}
      <div style={{ display: "flex", gap: 6, marginTop: 24 }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#C8A96E",
              animation: `pulse-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  );
}
