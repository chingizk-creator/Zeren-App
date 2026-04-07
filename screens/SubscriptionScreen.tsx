"use client";

import { useApp } from "@/context/AppContext";
import { SUBSCRIPTION_PLANS } from "@/data/subscriptions";
import { formatPrice } from "@/utils/formatPrice";

export default function SubscriptionScreen() {
  const { state, setSubscription } = useApp();
  const { activeSubscription } = state;

  return (
    <div className="screen" style={{ paddingBottom: 24 }}>
      {/* Header */}
      <div style={{ padding: "20px 16px 16px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#3D2E1F", marginBottom: 4 }}>
          Подписка
        </h1>
        <p style={{ fontSize: 13, color: "#9A9490" }}>
          Экономьте больше с каждым заказом
        </p>
      </div>

      {/* Plan cards */}
      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 12 }}>
        {SUBSCRIPTION_PLANS.map((plan) => {
          const isActive = activeSubscription === plan.id;

          return (
            <div
              key={plan.id}
              style={{
                background: "white",
                borderRadius: 16,
                border: isActive
                  ? `2px solid ${plan.accentColor}`
                  : "1.5px solid #EAE4D8",
                padding: "16px",
                position: "relative",
                transition: "border-color 0.2s",
              }}
            >
              {/* Popular badge */}
              {plan.isPopular && (
                <div
                  style={{
                    position: "absolute",
                    top: -1,
                    right: 16,
                    background: plan.accentColor,
                    color: "white",
                    fontSize: 9,
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: "0 0 8px 8px",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                  aria-label="Популярный план"
                >
                  Популярный
                </div>
              )}

              {/* Top row: name + active badge or price */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 12,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: "#3D2E1F",
                      marginBottom: 2,
                    }}
                  >
                    {plan.name}
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
                    <span
                      style={{
                        fontSize: 22,
                        fontWeight: 700,
                        color: isActive ? plan.accentColor : "#3D2E1F",
                        fontFamily: "Georgia, serif",
                      }}
                    >
                      {formatPrice(plan.price)}
                    </span>
                    <span style={{ fontSize: 11, color: "#9A9490" }}>/мес</span>
                  </div>
                </div>

                {isActive && (
                  <div
                    style={{
                      background: plan.accentColor + "22",
                      border: `1px solid ${plan.accentColor}55`,
                      borderRadius: 20,
                      padding: "4px 12px",
                      fontSize: 11,
                      fontWeight: 700,
                      color: plan.accentColor,
                    }}
                    role="status"
                    aria-label="Активный план"
                  >
                    Активна
                  </div>
                )}
              </div>

              {/* Features grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px 12px",
                  marginBottom: 14,
                }}
              >
                <FeatureItem
                  label="Доставок"
                  value={
                    plan.deliveriesPerMonth === "unlimited"
                      ? "Безлимит"
                      : `${plan.deliveriesPerMonth}/мес`
                  }
                  color={isActive ? plan.accentColor : "#3D2E1F"}
                />
                <FeatureItem
                  label="Мин. заказ"
                  value={
                    plan.minOrder === null
                      ? "Нет"
                      : formatPrice(plan.minOrder)
                  }
                  color={isActive ? plan.accentColor : "#3D2E1F"}
                />
                <FeatureItem
                  label="Сандық"
                  value={plan.hasSandyq ? "📦 Есть" : "Нет"}
                  color={isActive ? plan.accentColor : "#3D2E1F"}
                />
                <FeatureItem
                  label="Поддержка"
                  value={plan.id === "family" ? "VIP" : "Стандарт"}
                  color={isActive ? plan.accentColor : "#3D2E1F"}
                />
              </div>

              {/* Features list */}
              <div style={{ marginBottom: 14 }}>
                {plan.features.map((feature, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginBottom: 4,
                    }}
                  >
                    <span
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        background: isActive ? plan.accentColor + "22" : "#EAE4D8",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 9,
                        color: isActive ? plan.accentColor : "#9A9490",
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                    <span style={{ fontSize: 12, color: "#3D2E1F" }}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              {!isActive && (
                <button
                  className="btn-primary"
                  style={{
                    width: "100%",
                    height: 42,
                    borderRadius: 10,
                    fontSize: 13,
                  }}
                  onClick={() => setSubscription(plan.id)}
                  aria-label={`Выбрать план ${plan.name}`}
                >
                  Выбрать план
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Annual promo card */}
      <div style={{ padding: "12px 16px 0" }}>
        <div
          style={{
            background: "linear-gradient(135deg, #3D2E1F 0%, #5C4433 100%)",
            borderRadius: 16,
            padding: "16px",
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#C8A96E",
              marginBottom: 6,
            }}
          >
            🗓 Годовой план — скидка 20%
          </div>
          <div
            style={{
              fontSize: 12,
              color: "#E8D5A8",
              lineHeight: 1.5,
              marginBottom: 12,
            }}
          >
            Оплатите год вперёд и получите 2 месяца в подарок
          </div>
          <button
            className="btn-primary"
            style={{
              padding: "10px 20px",
              fontSize: 12,
              borderRadius: 8,
              display: "inline-flex",
            }}
          >
            Узнать больше
          </button>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div>
      <div style={{ fontSize: 9, color: "#9A9490", marginBottom: 1 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color }}>{value}</div>
    </div>
  );
}
