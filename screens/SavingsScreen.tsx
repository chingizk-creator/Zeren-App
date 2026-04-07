"use client";

import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/utils/formatPrice";

export default function SavingsScreen() {
  const { state } = useApp();
  const { authState, startAuth } = useAuth();
  const isAuthenticated = authState.user.isAuthenticated;
  const { lifetimeSavings, orderHistory } = state;

  return (
    <div className="screen" style={{ paddingBottom: 24 }}>
      {/* Hero */}
      <div
        style={{
          background: "#3D2E1F",
          padding: "28px 20px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 10,
            color: "#E8D5A8",
            letterSpacing: "2.5px",
            fontWeight: 600,
            marginBottom: 10,
            textTransform: "uppercase",
          }}
        >
          Сэкономлено с ZEREN
        </div>
        <div
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 42,
            fontWeight: 700,
            color: "#C8A96E",
            lineHeight: 1,
            marginBottom: 14,
          }}
          aria-label={`Сэкономлено ${formatPrice(lifetimeSavings)}`}
        >
          {formatPrice(lifetimeSavings)}
        </div>

        {/* Leaderboard badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(74,139,58,0.15)",
            border: "1px solid rgba(74,139,58,0.3)",
            borderRadius: 20,
            padding: "6px 14px",
            marginBottom: 16,
          }}
        >
          <span style={{ fontSize: 14 }}>🏆</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#4ADE80" }}>
            Топ 12% в Алматы
          </span>
        </div>

        {/* Share button */}
        <div>
          <button
            className="btn-primary"
            style={{ padding: "10px 24px", fontSize: 13, borderRadius: 10 }}
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
      </div>

      {/* Order history */}
      <div style={{ padding: "16px 16px 0" }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: "#3D2E1F", marginBottom: 12 }}>
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
          <div
            style={{
              textAlign: "center",
              padding: "40px 20px",
              color: "#9A9490",
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 8 }}>📦</div>
            <div style={{ fontSize: 14 }}>Здесь появится ваша история экономии</div>
          </div>
        ) : (
          <div
            style={{
              background: "white",
              borderRadius: 16,
              border: "1px solid #EAE4D8",
              overflow: "hidden",
            }}
          >
            {orderHistory.map((order, idx) => (
              <div key={order.id}>
                {idx > 0 && (
                  <div style={{ height: 1, background: "#EAE4D8", margin: "0 16px" }} />
                )}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "12px 16px",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#3D2E1F",
                        marginBottom: 2,
                      }}
                    >
                      {order.date}
                    </div>
                    <div style={{ fontSize: 11, color: "#9A9490" }}>
                      {order.itemCount} товаров · {formatPrice(order.total)}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: "#4A8B3A",
                        fontFamily: "Georgia, serif",
                      }}
                    >
                      {formatPrice(order.savings)}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "#4A8B3A",
                        fontWeight: 600,
                      }}
                    >
                      −{order.savingsPercent}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* City savings card */}
      <div style={{ padding: "16px 16px 0" }}>
        <div
          style={{
            background: "#3D2E1F",
            borderRadius: 16,
            padding: "20px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: "#E8D5A8",
              letterSpacing: "2px",
              fontWeight: 600,
              marginBottom: 8,
              textTransform: "uppercase",
            }}
          >
            Алматы вместе
          </div>
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 28,
              fontWeight: 700,
              color: "#C8A96E",
              marginBottom: 6,
            }}
          >
            ₸2,147,000
          </div>
          <div style={{ fontSize: 12, color: "#E8D5A8" }}>
            этим месяцем 🦌
          </div>
        </div>
      </div>
    </div>
  );
}
