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
      <div className="screen" style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", gap: 16, padding: 32, textAlign: "center",
      }}>
        <div style={{ fontSize: 64, opacity: 0.4 }}>📍</div>
        <div>
          <div style={{
            fontSize: 22, fontWeight: 700, color: "#3D2E1F", marginBottom: 8,
            fontFamily: "var(--font-playfair, Georgia, serif)", letterSpacing: "-0.02em",
          }}>
            Нет активных заказов
          </div>
          <div style={{ fontSize: 14, color: "#9A9490", lineHeight: 1.6, maxWidth: 260, margin: "0 auto" }}>
            Оформите заказ — мы доставим свежее с Алтын Орды прямо к вам
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="screen" style={{ paddingBottom: 16 }}>
      {/* Header area */}
      <div style={{ padding: "20px 16px 12px" }}>
        <h1 style={{
          fontSize: 26,
          fontWeight: 700,
          color: "#3D2E1F",
          fontFamily: "var(--font-playfair, Georgia, serif)",
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
          marginBottom: 4,
        }}>Ваш заказ</h1>
        <div style={{ fontSize: 13, color: "#9A9490", fontWeight: 500 }}>
          📍 Доставка 18:00–20:00
        </div>
      </div>

      {/* Map — treasure map illustration */}
      <div style={{ padding: "0 16px 16px" }}>
        <div
          style={{
            height: 160,
            borderRadius: 20,
            background: trackingStep >= 3
              ? "linear-gradient(135deg, #EDF7EA 0%, #D5F5E3 100%)"
              : trackingStep >= 1
              ? "linear-gradient(135deg, #FDF5E8 0%, #F5E6C8 100%)"
              : "linear-gradient(135deg, #FAF7F0 0%, #EAE4D8 100%)",
            border: "1px solid #EAE4D8",
            position: "relative",
            overflow: "hidden",
            transition: "background 0.8s ease",
          }}
        >
          {/* Treasure map grid */}
          <div style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "linear-gradient(rgba(61,46,31,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(61,46,31,0.05) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }} aria-hidden="true" />

          {/* Dotted path from left (bazaar) to right (home) */}
          <div style={{
            position: "absolute",
            top: "50%",
            left: 48,
            right: 48,
            transform: "translateY(-50%)",
            height: 2,
            background: "repeating-linear-gradient(90deg, #EAE4D8 0px, #EAE4D8 6px, transparent 6px, transparent 12px)",
          }} aria-hidden="true" />

          {/* Filled progress on the path */}
          <div style={{
            position: "absolute",
            top: "50%",
            left: 48,
            transform: "translateY(-50%)",
            height: 2,
            background: "#4A8B3A",
            width: `${Math.min(100, (trackingStep / 4) * 100)}%`,
            maxWidth: "calc(100% - 96px)",
            transition: "width 0.8s ease",
          }} aria-hidden="true" />

          {/* Bazaar icon (left) */}
          <div style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            background: "white",
            borderRadius: 10,
            padding: "6px 8px",
            fontSize: 18,
            boxShadow: "0 2px 8px rgba(61,46,31,0.12)",
          }}>🏪</div>

          {/* House icon (right) */}
          <div style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            background: trackingStep >= 4 ? "#4A8B3A" : "white",
            borderRadius: 10,
            padding: "6px 8px",
            fontSize: 18,
            boxShadow: "0 2px 8px rgba(61,46,31,0.12)",
            transition: "background 0.5s ease",
          }}>🏠</div>

          {/* Moving courier dot */}
          {trackingStep >= 1 && trackingStep < 4 && (
            <div style={{
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              left: `calc(48px + ${Math.min(90, (trackingStep / 4) * 85)}%)`,
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "#D4783A",
              boxShadow: "0 0 0 4px rgba(212,120,58,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              animation: trackingStep === 3 ? "car-bounce 0.8s ease-in-out infinite" : undefined,
              transition: "left 0.8s ease",
            }}>
              {trackingStep === 3 ? "🚗" : "📦"}
            </div>
          )}

          {/* Status label */}
          <div style={{
            position: "absolute",
            bottom: 10,
            left: "50%",
            transform: "translateX(-50%)",
            background: "white",
            borderRadius: 10,
            padding: "5px 14px",
            fontSize: 12,
            fontWeight: 600,
            color: "#3D2E1F",
            boxShadow: "0 2px 8px rgba(61,46,31,0.1)",
            whiteSpace: "nowrap",
          }}>
            {trackingStep <= 0 && "📍 Подготовка"}
            {trackingStep === 1 && "🏪 Алтын Орда"}
            {trackingStep === 2 && "✅ Проверка качества"}
            {trackingStep === 3 && "🚗 Курьер в пути"}
            {trackingStep >= 4 && "✅ Доставлено!"}
          </div>
        </div>
      </div>

      {/* Progress tracker */}
      <div style={{ padding: "0 16px 16px" }}>
        <div style={{
          background: "white",
          borderRadius: 20,
          border: "1px solid #EAE4D8",
          padding: "20px 16px",
          boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(61,46,31,0.07)",
        }}>
          {STEPS.map((step, idx) => {
            const isCompleted = idx < trackingStep;
            const isCurrent = idx === trackingStep;
            const isFuture = idx > trackingStep;

            return (
              <div key={idx}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  {/* Circle — 36px via CSS class */}
                  <div
                    className={`tracking-circle${isCompleted ? " completed" : isCurrent ? " current" : " future"}`}
                    aria-label={isCompleted ? `${step.title} — выполнено` : isCurrent ? `${step.title} — в процессе` : step.title}
                  >
                    {isCompleted ? "✓" : step.emoji}
                  </div>

                  {/* Text content */}
                  <div style={{ flex: 1, paddingTop: 6 }}>
                    <div style={{
                      fontSize: 15,
                      fontWeight: isCurrent ? 700 : 500,
                      color: isCompleted ? "#4A8B3A" : isCurrent ? "#D4783A" : "#C5C0B8",
                      marginBottom: 2,
                      fontFamily: isCurrent ? "var(--font-playfair, Georgia, serif)" : "inherit",
                      letterSpacing: isCurrent ? "-0.01em" : undefined,
                    }}>
                      {step.title}
                    </div>
                    <div style={{ fontSize: 12, color: isCurrent ? "#D4783A" : "#C5C0B8", fontWeight: isCurrent ? 500 : 400 }}>
                      {isCurrent ? `Сейчас... ${step.sub}` : step.sub}
                    </div>
                    {/* Time estimate on current step */}
                    {isCurrent && idx < 4 && (
                      <div style={{ fontSize: 11, color: "#9A9490", marginTop: 4, fontWeight: 500 }}>
                        ~{[15, 10, 5, 2][idx] || 5} мин
                      </div>
                    )}
                  </div>
                </div>

                {/* Connector line — 28px per CSS */}
                {idx < STEPS.length - 1 && (
                  <div style={{ paddingLeft: 17 }}>
                    <div
                      className={`tracking-line${isCompleted ? " completed" : " future"}`}
                      style={isCompleted ? { animation: "line-fill 0.5s ease forwards" } : {}}
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
        <div style={{ padding: "0 16px 16px" }}>
          <div style={{
            fontSize: 16,
            fontWeight: 700,
            color: "#3D2E1F",
            marginBottom: 10,
            fontFamily: "var(--font-playfair, Georgia, serif)",
            letterSpacing: "-0.01em",
          }}>
            Состав заказа
          </div>
          <div style={{
            background: "white",
            borderRadius: 16,
            border: "1px solid #EAE4D8",
            padding: "14px 16px",
            boxShadow: "0 1px 4px rgba(61,46,31,0.05)",
          }}>
            {state.cart.map((item) => (
              <div key={item.id} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 0",
                borderBottom: "1px solid #EAE4D8",
              }}>
                <span style={{ fontSize: 13, color: "#3D2E1F", fontWeight: 500 }}>
                  {item.emoji} {item.name} × {item.quantity}
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#3D2E1F", fontFamily: "Georgia, serif" }}>
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10 }}>
              <span style={{ fontSize: 14, color: "#4A8B3A", fontWeight: 700 }}>Экономия</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#4A8B3A", fontFamily: "Georgia, serif" }}>
                {formatPrice(orderSavings)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
