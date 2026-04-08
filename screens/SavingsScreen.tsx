"use client";

import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/utils/formatPrice";

export default function SavingsScreen() {
  const { state } = useApp();
  const { authState, startAuth } = useAuth();
  const isAuthenticated = authState.user.isAuthenticated;
  const { lifetimeSavings, orderHistory } = state;

  const [cityTotal, setCityTotal] = useState(2147000);
  useEffect(() => {
    const t = setInterval(() => {
      setCityTotal(prev => prev + Math.floor(Math.random() * 800 + 200));
    }, 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="screen" style={{ paddingBottom: 24 }}>
      {/* Hero — full-bleed, dramatic */}
      <div style={{
        background: "linear-gradient(160deg, #2C2016 0%, #3D2E1F 70%, #2C2016 100%)",
        padding: "36px 24px 28px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        minHeight: 240,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}>
        {/* Gold radial glow behind number */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 240,
          height: 240,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200,169,110,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }} aria-hidden="true" />

        {/* Gazelle watermark */}
        <div style={{
          position: "absolute",
          bottom: -10,
          right: 10,
          fontSize: 100,
          opacity: 0.05,
          lineHeight: 1,
          pointerEvents: "none",
        }} aria-hidden="true">🦌</div>

        <div style={{
          fontSize: 10,
          color: "#E8D5A8",
          letterSpacing: "4px",
          fontWeight: 600,
          marginBottom: 14,
          textTransform: "uppercase",
          opacity: 0.8,
          fontFamily: "var(--font-jakarta, sans-serif)",
        }}>
          Сэкономлено с Zeren
        </div>

        {/* HUGE savings counter with shimmer */}
        <div
          className="animate-shimmer"
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 56,
            fontWeight: 700,
            lineHeight: 1,
            marginBottom: 16,
            letterSpacing: "-0.03em",
          }}
          aria-label={`Сэкономлено ${formatPrice(lifetimeSavings)}`}
        >
          {formatPrice(lifetimeSavings)}
        </div>

        {/* Leaderboard shield badge */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: "rgba(74,139,58,0.18)",
          border: "1px solid rgba(74,222,128,0.35)",
          borderRadius: 20,
          padding: "8px 18px",
          marginBottom: 20,
        }}>
          <span style={{ fontSize: 16 }}>🏆</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#4ADE80", letterSpacing: "0.5px" }}>
            Топ 12% в Алматы
          </span>
        </div>

        {/* Share button — golden bordered pill */}
        <button
          style={{
            background: "transparent",
            border: "1.5px solid rgba(200,169,110,0.6)",
            borderRadius: 24,
            padding: "10px 28px",
            fontSize: 14,
            fontWeight: 700,
            color: "#C8A96E",
            cursor: "pointer",
            fontFamily: "var(--font-jakarta, sans-serif)",
            letterSpacing: "0.3px",
            transition: "all 0.2s ease",
          }}
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: "ZEREN — Экономия",
                text: `Я сэкономил(а) ${formatPrice(lifetimeSavings)} на базарных продуктах с ZEREN!`,
              });
            }
          }}
        >
          📤 Поделиться
        </button>
      </div>

      {/* Order history */}
      <div style={{ padding: "20px 16px 0" }}>
        <h2 style={{
          fontSize: 18,
          fontWeight: 700,
          color: "#3D2E1F",
          marginBottom: 14,
          fontFamily: "var(--font-playfair, Georgia, serif)",
          letterSpacing: "-0.02em",
        }}>
          История заказов
        </h2>

        {!isAuthenticated ? (
          <div style={{ background: "white", borderRadius: 16, border: "1px solid #EAE4D8", padding: "24px 20px", textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>🔐</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#3D2E1F", marginBottom: 6 }}>
              Войдите, чтобы увидеть вашу историю
            </div>
            <div style={{ fontSize: 12, color: "#9A9490", marginBottom: 16 }}>
              Все ваши заказы и личная экономия будут здесь
            </div>
            <button
              className="btn-primary"
              style={{ padding: "10px 24px", fontSize: 13, borderRadius: 10 }}
              onClick={() => startAuth(false)}
            >
              Войти
            </button>
          </div>
        ) : orderHistory.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#9A9490" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📦</div>
            <div style={{ fontSize: 14 }}>Здесь появится ваша история экономии</div>
          </div>
        ) : (
          <div>
            {orderHistory.map((order, idx) => (
              <div key={order.id} style={{
                display: "flex",
                alignItems: "center",
                padding: "14px 16px",
                marginBottom: 8,
                background: "white",
                borderRadius: 14,
                border: "1px solid #EAE4D8",
                borderLeft: "3px solid #4A8B3A",
                boxShadow: "0 1px 4px rgba(61,46,31,0.05)",
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#3D2E1F", marginBottom: 3 }}>
                    {order.date}
                  </div>
                  <div style={{ fontSize: 12, color: "#9A9490" }}>
                    {order.itemCount} товаров · {formatPrice(order.total)}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#4A8B3A",
                    fontFamily: "Georgia, serif",
                    letterSpacing: "-0.02em",
                  }}>
                    {formatPrice(order.savings)}
                  </div>
                  <div style={{ fontSize: 11, color: "#4A8B3A", fontWeight: 600 }}>
                    −{order.savingsPercent}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* City savings card — animated */}
      <div style={{ padding: "16px 16px 24px" }}>
        <div style={{
          background: "linear-gradient(145deg, #2C2016 0%, #3D2E1F 100%)",
          borderRadius: 20,
          padding: "24px 20px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          border: "1px solid rgba(200,169,110,0.15)",
        }}>
          {/* Subtle pattern */}
          <div style={{
            position: "absolute",
            inset: 0,
            opacity: 0.04,
            backgroundImage: "repeating-linear-gradient(60deg, #C8A96E 0px, #C8A96E 1px, transparent 1px, transparent 14px)",
            pointerEvents: "none",
          }} aria-hidden="true" />

          <div style={{ position: "relative" }}>
            <div style={{
              fontSize: 10,
              color: "#E8D5A8",
              letterSpacing: "3px",
              fontWeight: 600,
              marginBottom: 10,
              textTransform: "uppercase",
              opacity: 0.8,
            }}>
              Алматы вместе
            </div>
            <div style={{
              fontFamily: "Georgia, serif",
              fontSize: 34,
              fontWeight: 700,
              color: "#C8A96E",
              marginBottom: 6,
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}>
              {formatPrice(cityTotal)}
            </div>
            <div style={{ fontSize: 13, color: "#E8D5A8", opacity: 0.7 }}>
              сэкономлено этим месяцем 🦌
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
