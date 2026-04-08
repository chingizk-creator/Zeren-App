"use client";

import { useCallback } from "react";
import ProductVisual from "./ProductVisual";
import QuantityStepper from "@/components/ui/QuantityStepper";
import { useApp } from "@/context/AppContext";
import { formatPrice } from "@/utils/formatPrice";
import { productSavingsPercent } from "@/utils/calculateSavings";
import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
  onOpenDetail: (product: Product) => void;
  featured?: boolean;
}

export default function ProductCard({ product, onOpenDetail, featured = false }: ProductCardProps) {
  const { addToCart, removeFromCart, updateQuantity, getQuantityInCart } = useApp();
  const qty = getQuantityInCart(product.id);
  const savingsPct = productSavingsPercent(product.price, product.retailPrice);

  const handleAdd = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      addToCart(product);
    },
    [addToCart, product]
  );

  const handleIncrease = useCallback(() => {
    updateQuantity(product.id, qty + 1);
  }, [updateQuantity, product.id, qty]);

  const handleDecrease = useCallback(() => {
    if (qty <= 1) removeFromCart(product.id);
    else updateQuantity(product.id, qty - 1);
  }, [removeFromCart, updateQuantity, product.id, qty]);

  if (featured) {
    return (
      <div
        className="product-card"
        onClick={() => onOpenDetail(product)}
        role="button"
        tabIndex={0}
        aria-label={`${product.name}, ${formatPrice(product.price)} за ${product.unit}`}
        onKeyDown={(e) => e.key === "Enter" && onOpenDetail(product)}
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 16,
          padding: "16px",
          border: "1px solid rgba(212,120,58,0.2)",
          background: "rgba(212,120,58,0.03)",
          position: "relative",
        }}
      >
        {/* "Хит дня" badge */}
        <div
          style={{
            background: "#D4783A",
            color: "white",
            fontSize: 10,
            fontWeight: 700,
            padding: "3px 8px",
            borderRadius: 20,
            position: "absolute",
            top: 12,
            left: 12,
            fontFamily: "var(--font-jakarta, sans-serif)",
          }}
        >
          ★ Хит дня
        </div>

        {/* Visual */}
        <div style={{ flexShrink: 0 }}>
          <ProductVisual
            emoji={product.emoji}
            colorPalette={product.colorPalette}
            size={100}
            animate={qty === 0}
            borderRadius={16}
          />
        </div>

        {/* Content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#3D2E1F",
              lineHeight: 1.3,
              marginBottom: 4,
              fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)",
            }}
          >
            {product.name}
          </div>

          <div style={{ fontSize: 10, color: "#9A9490", marginBottom: 8 }}>
            {product.vendorName} · №{product.stallNumber}
          </div>

          <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 6 }}>
            <span
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: "#3D2E1F",
                fontFamily: "Georgia, serif",
                letterSpacing: "-0.02em",
              }}
            >
              {formatPrice(product.price)}
            </span>
            <span style={{ fontSize: 10, color: "#9A9490" }}>/{product.unit}</span>
          </div>

          <div style={{ marginBottom: 10 }}>
            <span
              className="savings-badge"
              style={{ letterSpacing: "-0.01em" }}
              aria-label={`Скидка ${savingsPct}%`}
            >
              −{savingsPct}%
            </span>
          </div>

          <div onClick={(e) => e.stopPropagation()}>
            {qty === 0 ? (
              <button
                className="btn-primary touchable"
                style={{ width: "100%", height: 38, fontSize: 13, borderRadius: 10, fontWeight: 700 }}
                onClick={handleAdd}
                aria-label={`Добавить ${product.name} в корзину`}
              >
                В корзину
              </button>
            ) : (
              <QuantityStepper
                quantity={qty}
                onIncrease={handleIncrease}
                onDecrease={handleDecrease}
                size="sm"
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  // Standard card (2-column grid)
  return (
    <div
      className="product-card"
      onClick={() => onOpenDetail(product)}
      role="button"
      tabIndex={0}
      aria-label={`${product.name}, ${formatPrice(product.price)} за ${product.unit}`}
      onKeyDown={(e) => e.key === "Enter" && onOpenDetail(product)}
      style={{ padding: 10 }}
    >
      {/* Visual row */}
      <div style={{ position: "relative", marginBottom: 8 }}>
        <div
          style={{
            background: `${product.colorPalette[0]}1A`,
            borderRadius: 12,
            display: "inline-block",
          }}
        >
          <ProductVisual
            emoji={product.emoji}
            colorPalette={product.colorPalette}
            size={88}
            animate={qty === 0}
            borderRadius={12}
          />
        </div>
        {/* Savings badge - top right */}
        <div
          className="savings-badge"
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            letterSpacing: "-0.01em",
          }}
          aria-label={`Скидка ${savingsPct}%`}
        >
          −{savingsPct}%
        </div>
        {/* Freshness time - top left overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            background: "rgba(255,255,255,0.7)",
            borderRadius: 8,
            padding: "2px 5px",
            fontSize: 9,
            fontWeight: 600,
            color: "#3D2E1F",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
          aria-label={`Привезено в ${product.procurementTime}`}
        >
          🕐 {product.procurementTime}
        </div>
      </div>

      {/* Product name */}
      <div style={{ minHeight: 30, marginBottom: 3 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#3D2E1F",
            lineHeight: 1.3,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)",
          }}
        >
          {product.name}
        </div>
      </div>

      {/* Vendor line with avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "#3D2E1F",
            color: "#E8D5A8",
            fontSize: 8,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            fontFamily: "var(--font-jakarta, sans-serif)",
          }}
        >
          {product.vendorName.charAt(0)}
        </div>
        <span style={{ fontSize: 10, color: "#9A9490", fontWeight: 500 }}>
          {product.vendorName} · №{product.stallNumber}
        </span>
      </div>

      {/* Prices */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
          <span
            style={{
              fontSize: 19,
              fontWeight: 700,
              color: "#3D2E1F",
              fontFamily: "Georgia, serif",
              letterSpacing: "-0.02em",
            }}
          >
            {formatPrice(product.price)}
          </span>
          <span style={{ fontSize: 10, color: "#9A9490" }}>/{product.unit}</span>
        </div>
        <div
          style={{
            fontSize: 11,
            color: "#C0392B",
            textDecoration: "line-through",
          }}
        >
          {formatPrice(product.retailPrice)}
        </div>
      </div>

      {/* Savings badge */}
      <div style={{ marginBottom: 8 }}>
        <span className="savings-badge" style={{ letterSpacing: "-0.01em" }}>
          −{savingsPct}%
        </span>
      </div>

      {/* Cart control */}
      <div onClick={(e) => e.stopPropagation()}>
        {qty === 0 ? (
          <button
            className="btn-primary touchable"
            style={{ width: "100%", height: 38, fontSize: 13, borderRadius: 10, fontWeight: 700 }}
            onClick={handleAdd}
            aria-label={`Добавить ${product.name} в корзину`}
          >
            В корзину
          </button>
        ) : (
          <QuantityStepper
            quantity={qty}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
            size="sm"
          />
        )}
      </div>
    </div>
  );
}
