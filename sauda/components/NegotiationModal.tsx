"use client";

import { useState, useEffect, useCallback } from "react";
import { useSauda } from "@/sauda/context/SaudaContext";
import { formatPriceFull } from "@/sauda/data/mock";

function getSecondsRemaining(expiresAt: string): number {
  return Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000));
}

function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function timerColor(seconds: number): string {
  if (seconds > 60) return "#4A8B3A";
  if (seconds > 30) return "#C8A96E";
  return "#C0392B";
}

function discountBadgeColor(pct: number): { bg: string; color: string } {
  if (pct > 0.2) return { bg: "rgba(192,57,43,0.12)", color: "#C0392B" };
  if (pct > 0.1) return { bg: "rgba(200,169,110,0.15)", color: "#A07830" };
  return { bg: "rgba(74,139,58,0.12)", color: "#4A8B3A" };
}

export default function NegotiationModal() {
  const {
    state,
    acceptOrder,
    rejectOrder,
    closeNegotiation,
    submitCounter,
    acceptZerenCounter,
  } = useSauda();

  const {
    activeOrder,
    negotiationWaiting,
    negotiationResolved,
    negotiationAccepted,
    zerenCounterPrice,
  } = state;

  const zerenOfferPrice = activeOrder?.zerenOfferPrice ?? 0;
  const vendorRetailPrice = activeOrder?.vendorRetailPrice ?? 0;

  const initCounter = useCallback(
    () => Math.round(((zerenOfferPrice + vendorRetailPrice) / 2) / 10) * 10,
    [zerenOfferPrice, vendorRetailPrice]
  );

  const [counterPrice, setCounterPrice] = useState<number>(initCounter);
  const [secondsLeft, setSecondsLeft] = useState<number>(
    activeOrder ? getSecondsRemaining(activeOrder.expiresAt) : 0
  );

  // Re-init counter when order changes
  useEffect(() => {
    if (!activeOrder) return;
    setCounterPrice(initCounter());
    setSecondsLeft(getSecondsRemaining(activeOrder.expiresAt));
  }, [activeOrder?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Timer tick
  useEffect(() => {
    if (!activeOrder) return;
    const id = setInterval(() => {
      setSecondsLeft(getSecondsRemaining(activeOrder.expiresAt));
    }, 1000);
    return () => clearInterval(id);
  }, [activeOrder]);

  if (!activeOrder) return null;

  const discountPct = vendorRetailPrice > 0
    ? (vendorRetailPrice - zerenOfferPrice) / vendorRetailPrice
    : 0;
  const badgeColors = discountBadgeColor(discountPct);
  const discountLabel = `−${Math.round(discountPct * 100)}%`;

  const handleOverlayClick = () => {
    if (!negotiationWaiting) closeNegotiation();
  };

  const handleAcceptOriginal = () => {
    acceptOrder(activeOrder.id);
    closeNegotiation();
  };

  const handleSubmitCounter = () => {
    submitCounter(activeOrder.id, counterPrice);
  };

  const handleAcceptZerenCounter = () => {
    acceptZerenCounter(activeOrder.id);
  };

  const handleReject = () => {
    if (window.confirm("Отклонить заказ?")) {
      rejectOrder(activeOrder.id);
      closeNegotiation();
    }
  };

  const handleClose = () => {
    if (!negotiationWaiting) closeNegotiation();
  };

  const sheetBorder = activeOrder.isSelectOrder
    ? "2px solid #C8A96E"
    : "none";

  return (
    <>
      {/* Overlay */}
      <div
        onClick={handleOverlayClick}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          zIndex: 500,
        }}
      />

      {/* Sheet */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          maxWidth: 420,
          margin: "0 auto",
          background: "white",
          borderRadius: "20px 20px 0 0",
          zIndex: 501,
          padding: "20px 20px 40px",
          border: sheetBorder,
          borderBottom: "none",
          boxSizing: "border-box",
        }}
      >
        {/* Drag handle */}
        <div
          style={{
            width: 40,
            height: 4,
            background: "#EAE4D8",
            borderRadius: 2,
            margin: "0 auto 16px",
          }}
        />

        {/* SELECT badge */}
        {activeOrder.isSelectOrder && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              background: "rgba(200,169,110,0.15)",
              border: "1px solid rgba(200,169,110,0.3)",
              borderRadius: 8,
              padding: "4px 10px",
              fontSize: 11,
              color: "#C8A96E",
              fontWeight: 600,
              marginBottom: 12,
            }}
          >
            ⭐ SELECT — Только Grade A
          </div>
        )}

        {/* Timer */}
        <div
          style={{
            fontSize: 13,
            color: timerColor(secondsLeft),
            marginBottom: 14,
            fontWeight: 500,
          }}
        >
          Осталось {formatTimer(secondsLeft)}
        </div>

        {/* ── Section 1: Product info ── */}
        <div style={{ marginBottom: 18 }}>
          {/* Product row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontWeight: 700,
              fontSize: 16,
              color: "#3D2E1F",
              marginBottom: 12,
            }}
          >
            <span style={{ fontSize: 24 }}>{activeOrder.emoji}</span>
            <span>{activeOrder.product}</span>
            <span style={{ color: "#8A7B6E", fontWeight: 500 }}>
              {activeOrder.quantity} {activeOrder.unit}
            </span>
          </div>

          {/* Price comparison row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* Vendor retail price */}
            <div>
              <div style={{ fontSize: 10, color: "#8A7B6E", marginBottom: 2 }}>
                Ваша цена
              </div>
              <div
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: 22,
                  color: "#5C4A2A",
                  fontWeight: 400,
                }}
              >
                {formatPriceFull(vendorRetailPrice)}
              </div>
            </div>

            {/* Discount badge */}
            <div
              style={{
                background: badgeColors.bg,
                color: badgeColors.color,
                borderRadius: 8,
                padding: "4px 10px",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              {discountLabel}
            </div>

            {/* Zeren offer price */}
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontSize: 10,
                  color: "#8A7B6E",
                  marginBottom: 2,
                  textAlign: "right",
                }}
              >
                Предложение Zeren
              </div>
              <div
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: 22,
                  color: "#9B4A2A",
                  fontWeight: 400,
                }}
              >
                {formatPriceFull(zerenOfferPrice)}
              </div>
            </div>
          </div>
        </div>

        {/* ── Section 2: Counter-offer stepper ── */}
        {!negotiationWaiting && !negotiationResolved && (
          <div style={{ marginBottom: 18 }}>
            <div
              style={{
                fontSize: 12,
                color: "#8A7B6E",
                marginBottom: 8,
              }}
            >
              Ваше встречное предложение
            </div>

            {/* Quick buttons */}
            <div
              style={{
                display: "flex",
                gap: 6,
                marginBottom: 10,
              }}
            >
              {[20, 50, 100].map((bump) => (
                <button
                  key={bump}
                  onClick={() =>
                    setCounterPrice((p) => Math.min(vendorRetailPrice, p + bump))
                  }
                  style={{
                    height: 32,
                    borderRadius: 8,
                    background: "#FAF7F0",
                    border: "1px solid #EAE4D8",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#3D2E1F",
                    padding: "0 10px",
                    cursor: "pointer",
                  }}
                >
                  +₸{bump}
                </button>
              ))}
            </div>

            {/* Stepper row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <button
                onClick={() =>
                  setCounterPrice((p) => Math.max(zerenOfferPrice, p - 10))
                }
                disabled={counterPrice <= zerenOfferPrice}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 12,
                  background: "#FAF7F0",
                  border: "1px solid #EAE4D8",
                  fontSize: 24,
                  cursor: counterPrice <= zerenOfferPrice ? "not-allowed" : "pointer",
                  opacity: counterPrice <= zerenOfferPrice ? 0.4 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                −
              </button>

              <div
                style={{
                  flex: 1,
                  textAlign: "center",
                  fontSize: 28,
                  fontWeight: 700,
                  fontFamily: "Georgia, serif",
                  color: "#3D2E1F",
                }}
              >
                ₸{counterPrice}
              </div>

              <button
                onClick={() =>
                  setCounterPrice((p) => Math.min(vendorRetailPrice, p + 10))
                }
                disabled={counterPrice >= vendorRetailPrice}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 12,
                  background: "#FAF7F0",
                  border: "1px solid #EAE4D8",
                  fontSize: 24,
                  cursor: counterPrice >= vendorRetailPrice ? "not-allowed" : "pointer",
                  opacity: counterPrice >= vendorRetailPrice ? 0.4 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                +
              </button>
            </div>

            {/* Total */}
            <div
              style={{
                fontSize: 13,
                color: "#8A7B6E",
                textAlign: "center",
                marginTop: 4,
              }}
            >
              Итого: {formatPriceFull(counterPrice * activeOrder.quantity)}
            </div>
          </div>
        )}

        {/* ── Section 3: Negotiation states ── */}

        {/* Waiting */}
        {negotiationWaiting && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              padding: "16px 0 24px",
            }}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              style={{ animation: "spin 1s linear infinite" }}
            >
              <circle
                cx="20"
                cy="20"
                r="16"
                fill="none"
                stroke="#EAE4D8"
                strokeWidth="4"
              />
              <path
                d="M 20 4 A 16 16 0 0 1 36 20"
                fill="none"
                stroke="#C8A96E"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
            <div style={{ fontSize: 14, color: "#8A7B6E" }}>
              Ожидаем ответ Zeren...
            </div>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Zeren countered */}
        {negotiationResolved && !negotiationAccepted && zerenCounterPrice && (
          <div style={{ marginBottom: 8 }}>
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#5C4A2A",
                marginBottom: 4,
              }}
            >
              Zeren предлагает {formatPriceFull(zerenCounterPrice)}/кг
            </div>
            <div
              style={{
                fontSize: 12,
                color: "#8A7B6E",
                marginBottom: 16,
              }}
            >
              Это финальное предложение
            </div>

            <button
              onClick={handleAcceptZerenCounter}
              style={{
                width: "100%",
                height: 52,
                borderRadius: 14,
                background: "#4A8B3A",
                color: "white",
                border: "none",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                marginBottom: 8,
              }}
            >
              ✓ Принять ₸{zerenCounterPrice}
            </button>

            <button
              onClick={handleReject}
              style={{
                width: "100%",
                height: 44,
                borderRadius: 14,
                background: "transparent",
                color: "#C0392B",
                border: "1.5px solid #C0392B",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              ✕ Отклонить
            </button>
          </div>
        )}

        {/* Deal accepted */}
        {negotiationResolved && negotiationAccepted && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              padding: "8px 0 16px",
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "rgba(74,139,58,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                color: "#4A8B3A",
              }}
            >
              ✓
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#3D2E1F" }}>
              Сделка принята!
            </div>
            <div style={{ fontSize: 13, color: "#8A7B6E", textAlign: "center" }}>
              Заказ добавлен в выполненные
            </div>
            <button
              onClick={handleClose}
              style={{
                marginTop: 8,
                height: 48,
                borderRadius: 14,
                background: "#FAF7F0",
                border: "1px solid #EAE4D8",
                fontSize: 14,
                fontWeight: 600,
                color: "#3D2E1F",
                padding: "0 32px",
                cursor: "pointer",
              }}
            >
              Закрыть
            </button>
          </div>
        )}

        {/* Default action buttons */}
        {!negotiationWaiting && !negotiationResolved && (
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <button
                onClick={handleAcceptOriginal}
                style={{
                  flex: 1,
                  height: 52,
                  borderRadius: 14,
                  background: "#4A8B3A",
                  color: "white",
                  border: "none",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                ✓ Принять ₸{zerenOfferPrice}
              </button>

              <button
                onClick={handleSubmitCounter}
                style={{
                  flex: 1,
                  height: 52,
                  borderRadius: 14,
                  background: "#C8A96E",
                  color: "#3D2E1F",
                  border: "none",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                ↕ Предложить ₸{counterPrice}
              </button>
            </div>

            <div
              style={{
                marginTop: 8,
                textAlign: "center",
              }}
            >
              <button
                onClick={handleReject}
                style={{
                  background: "none",
                  border: "none",
                  color: "#C0392B",
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                  padding: "4px 16px",
                }}
              >
                ✕ Отклонить
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
