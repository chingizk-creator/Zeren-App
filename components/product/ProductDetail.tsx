"use client";

import { useCallback } from "react";
import ProductVisual from "./ProductVisual";
import QuantityStepper from "@/components/ui/QuantityStepper";
import { useApp } from "@/context/AppContext";
import { formatPrice } from "@/utils/formatPrice";
import { productSavingsPercent } from "@/utils/calculateSavings";
import type { Product } from "@/data/products";

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
}

export default function ProductDetail({ product, onClose }: ProductDetailProps) {
  const { addToCart, removeFromCart, updateQuantity, getQuantityInCart } = useApp();
  const qty = getQuantityInCart(product.id);
  const savingsPct = productSavingsPercent(product.price, product.retailPrice);

  const handleAdd = useCallback(() => addToCart(product), [addToCart, product]);
  const handleIncrease = useCallback(() => updateQuantity(product.id, qty + 1), [updateQuantity, product.id, qty]);
  const handleDecrease = useCallback(() => {
    if (qty <= 1) removeFromCart(product.id);
    else updateQuantity(product.id, qty - 1);
  }, [removeFromCart, updateQuantity, product.id, qty]);

  return (
    <>
      {/* Overlay */}
      <div
        className="bottom-sheet-overlay"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Sheet */}
      <div
        className="bottom-sheet"
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
        style={{ maxHeight: "85dvh" }}
      >
        {/* Visual section — top ~30% of modal */}
        <div
          style={{
            background: `linear-gradient(160deg, ${product.colorPalette[0]}22 0%, ${product.colorPalette[1] || product.colorPalette[0]}11 100%)`,
            padding: "28px 20px 20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "24px 24px 0 0",
            minHeight: 160,
            position: "relative",
          }}
        >
          <div
            className="drag-handle"
            style={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)" }}
          />
          <ProductVisual
            emoji={product.emoji}
            colorPalette={product.colorPalette}
            size={120}
            animate
            borderRadius={24}
          />
          {/* Savings badge positioned top-right of visual area */}
          <div
            className="savings-badge"
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              fontSize: 13,
              padding: "4px 10px",
            }}
          >
            −{savingsPct}%
          </div>
        </div>

        {/* Name section */}
        <div style={{ textAlign: "center", padding: "16px 20px 8px" }}>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#3D2E1F",
              marginBottom: 4,
              fontFamily: "var(--font-playfair, Georgia, serif)",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            {product.name}
          </h2>
          <div style={{ fontSize: 12, color: "#9A9490", fontWeight: 500 }}>{product.origin}</div>
        </div>

        {/* Price block */}
        <div style={{ textAlign: "center", padding: "8px 20px 16px" }}>
          <div
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: "#3D2E1F",
              fontFamily: "Georgia, serif",
              letterSpacing: "-0.02em",
              lineHeight: 1,
              marginBottom: 6,
            }}
          >
            {formatPrice(product.price)}
            <span style={{ fontSize: 14, fontWeight: 400, color: "#9A9490", marginLeft: 4 }}>
              /{product.unit}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <span style={{ fontSize: 14, color: "#C0392B", textDecoration: "line-through", fontWeight: 500 }}>
              {formatPrice(product.retailPrice)}
            </span>
            <span style={{ fontSize: 12, color: "#9A9490" }}>в Magnum</span>
          </div>
        </div>

        {/* Vendor "business card" */}
        <div
          style={{
            margin: "0 20px 16px",
            background: "#FAF7F0",
            borderRadius: 16,
            border: "1px solid #EAE4D8",
            borderLeft: "3px solid #C8A96E",
            padding: "14px 16px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Subtle diagonal pattern */}
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: 80,
              opacity: 0.04,
              backgroundImage:
                "repeating-linear-gradient(45deg, #3D2E1F 0px, #3D2E1F 1px, transparent 1px, transparent 8px)",
              pointerEvents: "none",
            }}
            aria-hidden="true"
          />

          {/* Header row */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "#3D2E1F",
                color: "#E8D5A8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {product.vendorName.charAt(0)}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#3D2E1F" }}>{product.vendorName}</div>
              <div style={{ fontSize: 10, color: "#9A9490" }}>Стол №{product.stallNumber} · Алтын Орда</div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}>
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#4ADE80",
                  animation: "pulse-dot 1.8s ease-in-out infinite",
                }}
              />
              <span style={{ fontSize: 10, color: "#4ADE80", fontWeight: 600 }}>Онлайн</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px" }}>
            <InfoRow label="Базар" value="Алтын Орда" />
            <InfoRow label="Привезено" value={`в ${product.procurementTime}`} />
            <InfoRow
              label="Качество"
              value={`${"★".repeat(
                Math.round(
                  product.qualityGrade === "A+" ? 5 : product.qualityGrade === "A" ? 4 : 3
                )
              )} ${product.qualityGrade}`}
            />
            <InfoRow label="Страна" value={product.origin} />
          </div>
        </div>

        {/* Cart button area */}
        <div style={{ padding: "0 20px 32px" }}>
          {qty === 0 ? (
            <button
              className="btn-primary"
              style={{ width: "100%", height: 56, fontSize: 16, borderRadius: 14, fontWeight: 700 }}
              onClick={handleAdd}
            >
              В корзину
            </button>
          ) : (
            <div>
              <QuantityStepper
                quantity={qty}
                onIncrease={handleIncrease}
                onDecrease={handleDecrease}
                size="md"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        style={{
          fontSize: 10,
          color: "#9A9490",
          marginBottom: 2,
          fontWeight: 500,
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: "#3D2E1F" }}>{value}</div>
    </div>
  );
}
