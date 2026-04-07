"use client";

import { useState, useCallback } from "react";
import ProductVisual from "@/components/product/ProductVisual";
import QuantityStepper from "@/components/ui/QuantityStepper";
import { useApp } from "@/context/AppContext";
import { formatPrice, formatPercent } from "@/utils/formatPrice";
import { PRODUCTS } from "@/data/products";

const DELIVERY_SLOTS = [
  { id: "10-12", label: "10–12", available: true },
  { id: "14-16", label: "14–16", available: true },
  { id: "16-18", label: "16–18", available: true },
  { id: "18-20", label: "18–20", available: true },
  { id: "20-22", label: "20–22", available: false },
];

const MIN_ORDER = 5000;

export default function CartScreen() {
  const {
    state,
    setScreen,
    removeFromCart,
    updateQuantity,
    clearCart,
    startOrder,
    showOrderSuccess,
    cartTotal,
    cartRetailTotal,
    cartSavings,
  } = useApp();

  const [selectedSlot, setSelectedSlot] = useState("18-20");
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const savingsPercent = cartRetailTotal > 0
    ? Math.round((cartSavings / cartRetailTotal) * 100)
    : 0;

  const canCheckout = cartTotal >= MIN_ORDER;

  const handleCheckout = useCallback(() => {
    if (!canCheckout || isCheckingOut) return;
    setIsCheckingOut(true);

    showOrderSuccess();
    startOrder(cartSavings);

    setTimeout(() => {
      clearCart();
      setIsCheckingOut(false);
      setScreen("tracking");
    }, 2500);
  }, [canCheckout, isCheckingOut, showOrderSuccess, startOrder, cartSavings, clearCart, setScreen]);

  if (state.cart.length === 0) {
    return (
      <div className="screen" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 32 }}>
        <span style={{ fontSize: 56 }}>🦌</span>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#3D2E1F", marginBottom: 6 }}>
            Корзина пуста
          </div>
          <div style={{ fontSize: 13, color: "#9A9490" }}>
            Добавьте свежих продуктов с базара
          </div>
        </div>
        <button
          className="btn-primary"
          style={{ padding: "12px 28px", fontSize: 14, borderRadius: 12 }}
          onClick={() => setScreen("home")}
        >
          За покупками
        </button>
      </div>
    );
  }

  return (
    <div className="screen" style={{ paddingBottom: 16 }}>
      <div style={{ padding: "16px 16px 0", marginBottom: 8 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#3D2E1F" }}>Корзина</h1>
      </div>

      {/* Cart items */}
      <div style={{ padding: "0 16px" }}>
        {state.cart.map((item, idx) => {
          const product = PRODUCTS.find((p) => p.id === item.id);
          return (
            <div key={item.id}>
              {idx > 0 && (
                <div style={{ height: 1, background: "#EAE4D8", margin: "0 0 12px" }} />
              )}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                {/* Visual - static in cart */}
                {product ? (
                  <ProductVisual
                    emoji={product.emoji}
                    colorPalette={product.colorPalette}
                    size={44}
                    animate={false}
                    borderRadius={10}
                  />
                ) : (
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: "#EAE4D8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                    {item.emoji}
                  </div>
                )}

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#3D2E1F", marginBottom: 2 }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: 10, color: "#9A9490" }}>
                    {item.vendorName} · №{item.stallNumber}
                  </div>
                  <div style={{ fontSize: 12, color: "#9A9490", marginTop: 2 }}>
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>

                {/* Stepper */}
                <QuantityStepper
                  quantity={item.quantity}
                  onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                  onDecrease={() => {
                    if (item.quantity <= 1) removeFromCart(item.id);
                    else updateQuantity(item.id, item.quantity - 1);
                  }}
                  size="sm"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Savings summary */}
      <div
        style={{
          margin: "8px 16px",
          background: "white",
          borderRadius: 16,
          border: "1px solid #EAE4D8",
          padding: "14px 16px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 13, color: "#9A9490" }}>Корзина</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#3D2E1F" }}>
            {formatPrice(cartTotal)}
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: 13, color: "#9A9490" }}>В Magnum</span>
          <span
            style={{
              fontSize: 13,
              color: "#C5C0B8",
              textDecoration: "line-through",
            }}
          >
            {formatPrice(cartRetailTotal)}
          </span>
        </div>
        <div style={{ height: 1, background: "#EAE4D8", marginBottom: 10 }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#3D2E1F" }}>Экономия</span>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#4A8B3A",
                fontFamily: "Georgia, serif",
              }}
            >
              {formatPrice(cartSavings)}
            </div>
            <div style={{ fontSize: 11, color: "#4A8B3A" }}>
              {savingsPercent}% от Magnum
            </div>
          </div>
        </div>
      </div>

      {/* Delivery window picker */}
      <div style={{ padding: "8px 16px" }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: "#3D2E1F", marginBottom: 10 }}>
          Доставка
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 6,
          }}
          role="group"
          aria-label="Выберите время доставки"
        >
          {DELIVERY_SLOTS.map((slot) => (
            <button
              key={slot.id}
              className={`delivery-slot${selectedSlot === slot.id ? " active" : ""}${!slot.available ? " unavailable" : ""}`}
              onClick={() => slot.available && setSelectedSlot(slot.id)}
              disabled={!slot.available}
              aria-pressed={selectedSlot === slot.id}
              aria-label={`Доставка ${slot.label}${!slot.available ? ", недоступно" : ""}`}
            >
              {slot.label}
            </button>
          ))}
        </div>
      </div>

      {/* Checkout button */}
      <div style={{ padding: "12px 16px" }}>
        <button
          className="btn-primary"
          style={{
            width: "100%",
            height: 54,
            borderRadius: 14,
            fontSize: 15,
            flexDirection: "column",
            gap: 2,
            opacity: canCheckout ? 1 : 0.55,
          }}
          onClick={handleCheckout}
          disabled={!canCheckout}
          aria-label={
            canCheckout
              ? `Заказать на ${formatPrice(cartTotal)}`
              : `Минимальный заказ ${formatPrice(MIN_ORDER)}`
          }
        >
          {canCheckout ? (
            <>
              <span>Заказать · {formatPrice(cartTotal)}</span>
              <span style={{ fontSize: 11, fontWeight: 400, opacity: 0.85 }}>
                Бесплатная доставка
              </span>
            </>
          ) : (
            <span>Мин. {formatPrice(MIN_ORDER)}</span>
          )}
        </button>
      </div>
    </div>
  );
}
