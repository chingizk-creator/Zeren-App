"use client";

import { useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { formatPrice } from "@/utils/formatPrice";

const STEP_DELAYS = [2000, 3000, 3000, 4000];

const STEPS = [
  { emoji: "📋", title: "Заказ принят", sub: "Формируем список" },
  { emoji: "🌅", title: "На базаре", sub: "Пикер на Алтын Орде" },
  { emoji: "✅", title: "Качество", sub: "Проверяем продукты" },
  { emoji: "🚗", title: "В пути", sub: "Курьер выехал" },
  { emoji: "🏠", title: "Доставлено!", sub: "Приятного аппетита" },
];

export default function TrackingScreen() {
  const {
    state,
    setTrackingStep,
    completeOrder,
    showToast,
  } = useApp();
  const { trackingStep, hasActiveOrder, orderSavings } = state;

  // Auto-advance steps
  useEffect(() => {
    if (!hasActiveOrder || trackingStep < 0 || trackingStep >= 4) return;

    const delay = STEP_DELAYS[trackingStep] ?? 3000;
    const timer = setTimeout(() => {
      const nextStep = trackingStep + 1;
      setTrackingStep(nextStep);

      if (nextStep === 4) {
        setTimeout(() => {
          completeOrder();
          showToast(
            "✅ Доставлено!",
            `Экономия ${formatPrice(orderSavings)} · Приятного аппетита!`,
            "✅"
          );
        }, 800);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [trackingStep, hasActiveOrder, setTrackingStep, completeOrder, showToast, orderSavings]);

  if (!hasActiveOrder && trackingStep < 0) {
    return (
      <div
        className="screen"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          padding: 32,
          textAlign: "center",
        }}
      >
        <span style={{ fontSize: 52 }}>📍</span>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#3D2E1F", marginBottom: 6 }}>
            Нет активных заказов
          </div>
          <div style={{ fontSize: 13, color: "#9A9490", lineHeight: 1.5 }}>
            Оформите заказ, и мы доставим свежее с базара Алтын Орда прямо к вам
          </div>
        </div>
      </div>
    );
  }

  // Determine map state
  const mapContent = () => {
    if (trackingStep <= 0)
      return { label: "📍 Подготовка", bg: "linear-gradient(135deg, #FAF7F0 0%, #EAE4D8 100%)" };
    if (trackingStep <= 2)
      return { label: "🏪 Алтын Орда", bg: "linear-gradient(135deg, #E8D5A8 0%, #C8A96E44 100%)" };
    return { label: "🚗 Курьер в 2 мин", bg: "linear-gradient(135deg, #D5F5E3 0%, #4A8B3A22 100%)" };
  };
  const map = mapContent();

  return (
    <div className="screen" style={{ paddingBottom: 16 }}>
      <div style={{ padding: "16px 16px 12px" }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#3D2E1F" }}>Ваш заказ</h1>
        <div style={{ fontSize: 13, color: "#9A9490", marginTop: 2 }}>
          Доставка 18:00–20:00
        </div>
      </div>

      {/* Map placeholder */}
      <div style={{ padding: "0 16px 16px" }}>
        <div
          style={{
            height: 150,
            borderRadius: 16,
            background: map.bg,
            border: "1px solid #EAE4D8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
          }}
          aria-label={`Карта: ${map.label}`}
        >
          {/* Grid overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(61,46,31,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(61,46,31,0.07) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
            aria-hidden="true"
          />
          <div
            style={{
              position: "relative",
              background: "white",
              borderRadius: 10,
              padding: "8px 16px",
              fontSize: 14,
              fontWeight: 600,
              color: "#3D2E1F",
              boxShadow: "0 2px 8px rgba(61,46,31,0.12)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span>{map.label}</span>
            {trackingStep === 3 && (
              <span
                style={{ display: "inline-block" }}
                className="animate-car"
                aria-hidden="true"
              >
                🚗
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Progress tracker */}
      <div style={{ padding: "0 16px 16px" }}>
        <div
          style={{
            background: "white",
            borderRadius: 16,
            border: "1px solid #EAE4D8",
            padding: "16px",
          }}
        >
          {STEPS.map((step, idx) => {
            const isCompleted = idx < trackingStep;
            const isCurrent = idx === trackingStep;
            const isFuture = idx > trackingStep;

            return (
              <div key={idx}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  {/* Circle */}
                  <div
                    className={`tracking-circle${isCompleted ? " completed" : isCurrent ? " current" : " future"}`}
                    style={isCurrent ? { animation: "step-pop 0.4s ease" } : {}}
                    aria-label={
                      isCompleted ? `${step.title} — выполнено` :
                      isCurrent ? `${step.title} — в процессе` :
                      step.title
                    }
                  >
                    {isCompleted ? "✓" : step.emoji}
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1, paddingTop: 3 }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: isCurrent ? 700 : 500,
                        color: isCompleted ? "#4A8B3A" : isCurrent ? "#D4853A" : "#C5C0B8",
                        marginBottom: 2,
                      }}
                    >
                      {step.title}
                    </div>
                    <div style={{ fontSize: 11, color: isCurrent ? "#9A9490" : "#C5C0B8" }}>
                      {isCurrent ? (
                        <span style={{ color: "#D4853A", fontWeight: 500 }}>
                          Сейчас... {step.sub}
                        </span>
                      ) : (
                        step.sub
                      )}
                    </div>
                  </div>
                </div>

                {/* Connector line */}
                {idx < STEPS.length - 1 && (
                  <div style={{ paddingLeft: 13 }}>
                    <div
                      className={`tracking-line${isCompleted ? " completed" : " future"}`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Order summary */}
      {state.cart.length > 0 && (
        <div style={{ padding: "0 16px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#3D2E1F", marginBottom: 10 }}>
            Состав заказа
          </div>
          <div
            style={{
              background: "white",
              borderRadius: 16,
              border: "1px solid #EAE4D8",
              padding: "12px 16px",
            }}
          >
            {state.cart.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "6px 0",
                  borderBottom: "1px solid #EAE4D8",
                }}
              >
                <span style={{ fontSize: 13, color: "#3D2E1F" }}>
                  {item.emoji} {item.name} × {item.quantity}
                </span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#3D2E1F" }}>
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingTop: 8,
              }}
            >
              <span style={{ fontSize: 13, color: "#4A8B3A", fontWeight: 600 }}>
                Экономия
              </span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#4A8B3A" }}>
                {formatPrice(orderSavings)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
