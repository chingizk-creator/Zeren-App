"use client";

import { useState, useCallback, useEffect } from "react";
import ProductVisual from "@/components/product/ProductVisual";
import QuantityStepper from "@/components/ui/QuantityStepper";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import AddressEntry from "@/components/auth/AddressEntry";
import { formatPrice } from "@/utils/formatPrice";
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

  const {
    authState,
    startAuth,
    shouldProceedToCheckout,
    consumeCheckoutSignal,
  } = useAuth();

  const { user } = authState;

  const [selectedSlot, setSelectedSlot] = useState("18-20");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showAddressEdit, setShowAddressEdit] = useState(false);

  const savingsPercent = cartRetailTotal > 0
    ? Math.round((cartSavings / cartRetailTotal) * 100)
    : 0;

  const canCheckout = cartTotal >= MIN_ORDER;

  // ── Actual order confirmation (fires when auth+address are complete) ──
  const placeOrder = useCallback(() => {
    if (isCheckingOut) return;
    setIsCheckingOut(true);
    showOrderSuccess();
    startOrder(cartSavings);
    setTimeout(() => {
      clearCart();
      setIsCheckingOut(false);
      setScreen("tracking");
    }, 2500);
  }, [isCheckingOut, showOrderSuccess, startOrder, cartSavings, clearCart, setScreen]);

  // ── Listen for checkout signal from AuthContext ──
  useEffect(() => {
    if (shouldProceedToCheckout) {
      consumeCheckoutSignal();
      placeOrder();
    }
  }, [shouldProceedToCheckout, consumeCheckoutSignal, placeOrder]);

  // ── Checkout button tap ──
  const handleCheckout = useCallback(() => {
    if (!canCheckout || isCheckingOut) return;

    if (!user.isAuthenticated) {
      // Trigger auth flow; checkout continues after auth completes
      startAuth(true);
      return;
    }

    if (!user.address) {
      // Auth done but no address yet — open address modal
      startAuth(true); // will jump straight to address step since authenticated
      return;
    }

    placeOrder();
  }, [canCheckout, isCheckingOut, user, startAuth, placeOrder]);

  // When authenticated user has no address, auth flow goes to address step
  // We need to handle the case where user is already authenticated and clicks checkout
  const handleAuthenticatedCheckout = useCallback(() => {
    if (!canCheckout || isCheckingOut) return;
    if (!user.address) {
      // Show address modal inline
      setShowAddressEdit(true);
      return;
    }
    placeOrder();
  }, [canCheckout, isCheckingOut, user, placeOrder]);

  // Combine handlers
  const onCheckout = user.isAuthenticated ? handleAuthenticatedCheckout : handleCheckout;

  // After address is saved via inline modal, place order
  useEffect(() => {
    if (showAddressEdit && user.address && !isCheckingOut) {
      setShowAddressEdit(false);
      placeOrder();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.address]);

  // ── Empty state ──
  if (state.cart.length === 0) {
    return (
      <div className="screen" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: 40 }}>
        <div style={{ fontSize: 64, opacity: 0.5 }}>🦌</div>
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#3D2E1F",
            marginBottom: 8,
            fontFamily: "var(--font-playfair, Georgia, serif)",
            letterSpacing: "-0.02em",
          }}>
            Корзина пуста
          </div>
          <div style={{ fontSize: 14, color: "#9A9490", lineHeight: 1.5 }}>
            Добавьте свежих продуктов с базара
          </div>
        </div>
        <button
          className="btn-primary"
          style={{ padding: "14px 32px", fontSize: 15, borderRadius: 14, fontWeight: 700 }}
          onClick={() => setScreen("home")}
        >
          За покупками
        </button>
      </div>
    );
  }

  return (
    <div className="screen" style={{ paddingBottom: 16 }}>
      {/* Screen title */}
      <div style={{ padding: "16px 16px 0", marginBottom: 12 }}>
        <h1 style={{
          fontSize: 26,
          fontWeight: 700,
          color: "#3D2E1F",
          fontFamily: "var(--font-playfair, Georgia, serif)",
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
        }}>Корзина</h1>
      </div>

      {/* Cart items — elevated card wrapping all items */}
      <div style={{
        margin: "0 16px 12px",
        background: "white",
        borderRadius: 18,
        border: "1px solid #EAE4D8",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(61,46,31,0.07)",
        overflow: "hidden",
      }}>
        {state.cart.map((item, idx) => {
          const product = PRODUCTS.find((p) => p.id === item.id);
          return (
            <div key={item.id}>
              {idx > 0 && (
                <div style={{ height: 1, background: "#EAE4D8" }} />
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px" }}>
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
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#3D2E1F", marginBottom: 2 }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: 11, color: "#9A9490" }}>
                    {item.vendorName} · №{item.stallNumber}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#3D2E1F", fontFamily: "Georgia, serif", marginTop: 2 }}>
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
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

      {/* Savings summary card — gradient background, HUGE savings number */}
      <div style={{
        margin: "0 16px 12px",
        background: "linear-gradient(135deg, #FFFFFF 0%, #FAF7F0 50%, #FDF5E8 100%)",
        borderRadius: 18,
        border: "1px solid #EAE4D8",
        padding: "16px 18px",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(61,46,31,0.05)",
      }}>
        {/* Top rows */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: "#9A9490", fontWeight: 500 }}>Корзина</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#3D2E1F", fontFamily: "Georgia, serif" }}>
            {formatPrice(cartTotal)}
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontSize: 13, color: "#9A9490" }}>В Magnum</span>
          <span style={{ fontSize: 13, color: "#C0392B", textDecoration: "line-through" }}>
            {formatPrice(cartRetailTotal)}
          </span>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "#EAE4D8", marginBottom: 12 }} />

        {/* Big savings row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 12, color: "#4A8B3A", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 2 }}>
              Ваша экономия
            </div>
            <div style={{ fontSize: 11, color: "#9A9490" }}>{savingsPercent}% дешевле Magnum</div>
          </div>
          <div style={{
            fontSize: 32,
            fontWeight: 700,
            color: "#4A8B3A",
            fontFamily: "Georgia, serif",
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}>
            {formatPrice(cartSavings)}
          </div>
        </div>
      </div>

      {/* Delivery window picker */}
      <div style={{ padding: "4px 16px 10px" }}>
        <h2 style={{
          fontSize: 16,
          fontWeight: 700,
          color: "#3D2E1F",
          fontFamily: "var(--font-playfair, Georgia, serif)",
          letterSpacing: "-0.01em",
          marginBottom: 10,
        }}>
          🕐 Время доставки
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }} role="group">
          {DELIVERY_SLOTS.map((slot) => (
            <button
              key={slot.id}
              className={`delivery-slot${selectedSlot === slot.id ? " active" : ""}${!slot.available ? " unavailable" : ""}`}
              onClick={() => slot.available && setSelectedSlot(slot.id)}
              disabled={!slot.available}
              aria-pressed={selectedSlot === slot.id}
            >
              {slot.label}
            </button>
          ))}
        </div>
      </div>

      {/* Saved address display */}
      {user.isAuthenticated && user.address && (
        <div style={{ padding: "4px 16px 8px", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 12, color: "#9A9490" }}>
            📍 {user.address.street}{user.address.apartment ? `, ${user.address.apartment}` : ""}
          </span>
          <button
            onClick={() => setShowAddressEdit(true)}
            style={{
              background: "none",
              border: "none",
              color: "#D4853A",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              padding: 0,
              fontFamily: "inherit",
              minHeight: "unset",
              minWidth: "unset",
            }}
          >
            Изменить
          </button>
        </div>
      )}

      {/* Checkout button */}
      <div style={{ padding: "8px 16px 16px" }}>
        <button
          className="btn-primary"
          style={{
            width: "100%",
            height: 58,
            borderRadius: 16,
            fontSize: 16,
            fontWeight: 700,
            flexDirection: "column",
            gap: 3,
            opacity: canCheckout ? 1 : 0.55,
            letterSpacing: "-0.01em",
          }}
          onClick={onCheckout}
          disabled={!canCheckout}
          aria-label={canCheckout ? `Заказать на ${formatPrice(cartTotal)}` : `Минимальный заказ ${formatPrice(MIN_ORDER)}`}
        >
          {canCheckout ? (
            <>
              <span>Заказать · {formatPrice(cartTotal)}</span>
              <span style={{ fontSize: 11, fontWeight: 500, opacity: 0.8 }}>🔒 Бесплатная доставка</span>
            </>
          ) : (
            <span>Мин. {formatPrice(MIN_ORDER)}</span>
          )}
        </button>
      </div>

      {/* Address edit modal (inline, for logged-in users) */}
      {showAddressEdit && <AddressEntry />}
    </div>
  );
}
