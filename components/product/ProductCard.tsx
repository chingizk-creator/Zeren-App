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
}

export default function ProductCard({ product, onOpenDetail }: ProductCardProps) {
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
        <ProductVisual
          emoji={product.emoji}
          colorPalette={product.colorPalette}
          size={72}
          animate={qty === 0}
          borderRadius={12}
        />
        {/* Savings badge - top right */}
        <div
          className="savings-badge"
          style={{
            position: "absolute",
            top: 0,
            right: 0,
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
            background: "rgba(0,0,0,0.48)",
            borderRadius: 6,
            padding: "2px 5px",
            fontSize: 8,
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
          aria-label={`Привезено в ${product.procurementTime}`}
        >
          🕐 {product.procurementTime}
        </div>
      </div>

      {/* Product info */}
      <div style={{ minHeight: 30, marginBottom: 3 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "#3D2E1F",
            lineHeight: 1.3,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {product.name}
        </div>
      </div>

      <div
        style={{
          fontSize: 9,
          color: "#9A9490",
          marginBottom: 6,
        }}
      >
        {product.vendorName} · №{product.stallNumber}
      </div>

      {/* Prices */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
          <span
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: "#3D2E1F",
              fontFamily: "Georgia, serif",
            }}
          >
            {formatPrice(product.price)}
          </span>
          <span style={{ fontSize: 10, color: "#9A9490" }}>/{product.unit}</span>
        </div>
        <div
          style={{
            fontSize: 10,
            color: "#C5C0B8",
            textDecoration: "line-through",
          }}
        >
          {formatPrice(product.retailPrice)}
        </div>
      </div>

      {/* Cart control */}
      <div onClick={(e) => e.stopPropagation()}>
        {qty === 0 ? (
          <button
            className="btn-primary touchable"
            style={{ width: "100%", height: 36, fontSize: 12, borderRadius: 8 }}
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
