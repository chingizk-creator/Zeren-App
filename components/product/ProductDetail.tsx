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
      >
        <div className="drag-handle" />

        <div style={{ padding: "16px 20px 32px" }}>
          {/* Visual */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16, marginTop: 8 }}>
            <ProductVisual
              emoji={product.emoji}
              colorPalette={product.colorPalette}
              size={96}
              animate
              borderRadius={18}
            />
          </div>

          {/* Name & origin */}
          <div style={{ textAlign: "center", marginBottom: 12 }}>
            <h2 style={{ fontSize: 19, fontWeight: 700, color: "#3D2E1F", marginBottom: 4 }}>
              {product.name}
            </h2>
            <div style={{ fontSize: 12, color: "#9A9490" }}>
              {product.origin}
            </div>
          </div>

          {/* Price block */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            marginBottom: 16,
          }}>
            <span style={{ fontSize: 32, fontWeight: 700, color: "#3D2E1F", fontFamily: "Georgia, serif" }}>
              {formatPrice(product.price)}
            </span>
            <span style={{ fontSize: 13, color: "#9A9490" }}>/{product.unit}</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 20 }}>
            <span style={{ fontSize: 13, color: "#C5C0B8", textDecoration: "line-through" }}>
              {formatPrice(product.retailPrice)}
            </span>
            <div className="savings-badge" style={{ fontSize: 12, padding: "3px 8px" }}>
              −{savingsPct}%
            </div>
          </div>

          {/* Vendor card */}
          <div style={{
            background: "#FAF7F0",
            borderRadius: 12,
            padding: "12px 14px",
            marginBottom: 20,
            border: "1px solid #EAE4D8",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#4ADE80",
                  animation: "pulse-dot 1.8s ease-in-out infinite",
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 12, fontWeight: 600, color: "#3D2E1F" }}>
                С сегодняшнего базара
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 12px" }}>
              <InfoRow label="Продавец" value={product.vendorName} />
              <InfoRow label="Место" value={`Стол №${product.stallNumber}`} />
              <InfoRow label="Базар" value="Алтын Орда" />
              <InfoRow label="Привезено" value={`в ${product.procurementTime}`} />
              <InfoRow label="Качество" value={`⭐ ${product.qualityGrade}`} />
              <InfoRow label="Страна" value={product.origin} />
            </div>
          </div>

          {/* Cart control */}
          {qty === 0 ? (
            <button
              className="btn-primary"
              style={{ width: "100%", height: 50, fontSize: 15, borderRadius: 12 }}
              onClick={handleAdd}
            >
              В корзину
            </button>
          ) : (
            <div style={{ display: "flex", justifyContent: "center" }}>
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
      <div style={{ fontSize: 9, color: "#9A9490", marginBottom: 1 }}>{label}</div>
      <div style={{ fontSize: 12, fontWeight: 500, color: "#3D2E1F" }}>{value}</div>
    </div>
  );
}
