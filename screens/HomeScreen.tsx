"use client";

import { useState, useMemo, useEffect } from "react";
import ProductCard from "@/components/product/ProductCard";
import ProductDetail from "@/components/product/ProductDetail";
import { useApp } from "@/context/AppContext";
import { PRODUCTS, type Product } from "@/data/products";
import { CATEGORIES } from "@/data/categories";
import { formatPrice } from "@/utils/formatPrice";

export default function HomeScreen() {
  const { state } = useApp();
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [savingsDisplayed, setSavingsDisplayed] = useState(0);

  // Animate savings counter on mount
  useEffect(() => {
    const target = state.lifetimeSavings;
    const duration = 1200;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), target);
      setSavingsDisplayed(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [state.lifetimeSavings]);

  const filteredProducts = useMemo(() => {
    let list = PRODUCTS;

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.vendorName.toLowerCase().includes(q)
      );
    } else if (activeCategory === "popular") {
      list = list.filter((p) => p.isPopular);
    } else if (activeCategory !== "all") {
      list = list.filter((p) => p.category === activeCategory);
    }

    return list;
  }, [activeCategory, search]);

  const showBanner = activeCategory === "all" && !search.trim();

  return (
    <div className="screen" style={{ paddingBottom: 130 }}>
      {/* Savings hero */}
      <div className="savings-hero">
        <div>
          <div style={{ fontSize: 10, color: "#E8D5A8", letterSpacing: "1.5px", marginBottom: 4 }}>
            Ваша экономия
          </div>
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 30,
              fontWeight: 700,
              color: "#C8A96E",
              lineHeight: 1,
              animation: "count-up 0.6s ease forwards",
            }}
            aria-live="polite"
          >
            {formatPrice(savingsDisplayed)}
          </div>
        </div>
        <div
          style={{
            background: "rgba(200,169,110,0.12)",
            border: "1px solid rgba(200,169,110,0.3)",
            borderRadius: 12,
            padding: "8px 12px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 22, marginBottom: 2 }}>🦌</div>
          <div style={{ fontSize: 10, color: "#E8D5A8", fontWeight: 600 }}>
            Топ 12%
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div style={{ padding: "12px 16px 8px" }}>
        <div
          style={{
            background: "white",
            borderRadius: 12,
            border: "1.5px solid #EAE4D8",
            display: "flex",
            alignItems: "center",
            padding: "0 12px",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 16, opacity: 0.35 }}>🔍</span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск продуктов..."
            aria-label="Поиск продуктов"
            style={{
              flex: 1,
              border: "none",
              background: "transparent",
              fontSize: 14,
              color: "#3D2E1F",
              outline: "none",
              padding: "12px 0",
              fontFamily: "inherit",
            }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                background: "none",
                border: "none",
                color: "#9A9490",
                fontSize: 16,
                cursor: "pointer",
                padding: 0,
                minHeight: "auto",
                minWidth: "auto",
              }}
              aria-label="Очистить поиск"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Category filters */}
      <div className="scroll-x" style={{ padding: "4px 16px 12px" }}>
        <div style={{ display: "flex", gap: 8, width: "max-content" }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`category-pill${activeCategory === cat.id && !search ? " active" : ""}`}
              onClick={() => {
                setActiveCategory(cat.id);
                setSearch("");
              }}
              aria-pressed={activeCategory === cat.id && !search}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sandyq banner */}
      {showBanner && (
        <div style={{ padding: "0 16px 12px" }}>
          <div
            style={{
              background: "linear-gradient(135deg, #3D2E1F 0%, #5C4433 100%)",
              borderRadius: 16,
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#C8A96E",
                  marginBottom: 4,
                }}
              >
                📦 Сандық недели
              </div>
              <div style={{ fontSize: 11, color: "#E8D5A8", lineHeight: 1.4 }}>
                Лучшее с сегодняшнего базара — отборное
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#C8A96E",
                  fontFamily: "Georgia, serif",
                  marginBottom: 6,
                }}
              >
                ₸3,500
              </div>
              <button
                className="btn-primary"
                style={{ height: 30, fontSize: 12, padding: "0 14px", borderRadius: 8 }}
              >
                Хочу
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live bazaar indicator */}
      {showBanner && (
        <div
          style={{
            padding: "0 16px 12px",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#4ADE80",
              flexShrink: 0,
              animation: "pulse-dot 1.8s ease-in-out infinite",
            }}
            aria-hidden="true"
          />
          <span style={{ fontSize: 11, color: "#9A9490" }}>
            С сегодняшнего базара · Алтын Орда · 8:30
          </span>
        </div>
      )}

      {/* Product grid */}
      <div style={{ padding: "0 16px" }}>
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#9A9490" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Ничего не найдено</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>
              Попробуйте другой запрос
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
            }}
            role="list"
            aria-label="Список продуктов"
          >
            {filteredProducts.map((product) => (
              <div key={product.id} role="listitem">
                <ProductCard
                  product={product}
                  onOpenDetail={setSelectedProduct}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product detail modal */}
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
