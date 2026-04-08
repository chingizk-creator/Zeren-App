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
  const [searchFocused, setSearchFocused] = useState(false);

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
      {/* Savings hero — full-bleed immersive */}
      <div style={{
        background: "linear-gradient(145deg, #2C2016 0%, #3D2E1F 60%, #4A3525 100%)",
        padding: "24px 20px 20px",
        position: "relative",
        overflow: "hidden",
        minHeight: 180,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}>
        {/* Gazelle watermark */}
        <div style={{
          position: "absolute",
          right: -10,
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: 120,
          opacity: 0.07,
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
        }} aria-hidden="true">🦌</div>

        {/* Subtle grid texture */}
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "linear-gradient(rgba(200,169,110,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(200,169,110,0.04) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          pointerEvents: "none",
        }} aria-hidden="true" />

        {/* Label */}
        <div style={{
          fontSize: 10,
          color: "#E8D5A8",
          letterSpacing: "3px",
          fontWeight: 600,
          marginBottom: 8,
          textTransform: "uppercase",
          fontFamily: "var(--font-jakarta, sans-serif)",
          opacity: 0.8,
        }}>
          Ваша экономия
        </div>

        {/* Main savings number */}
        <div
          className="animate-shimmer"
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 48,
            fontWeight: 700,
            lineHeight: 1,
            marginBottom: 10,
            letterSpacing: "-0.02em",
          }}
          aria-live="polite"
          aria-label={`Ваша экономия ${formatPrice(savingsDisplayed)}`}
        >
          {formatPrice(savingsDisplayed)}
        </div>

        {/* Bottom row: tagline + leaderboard badge */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 12, color: "#E8D5A8", opacity: 0.7, letterSpacing: "0.5px" }}>
            с базара Алтын Орда
          </div>
          <div style={{
            background: "rgba(74,139,58,0.2)",
            border: "1px solid rgba(74,139,58,0.4)",
            borderRadius: 20,
            padding: "4px 12px",
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}>
            <span style={{ fontSize: 12 }}>🏆</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#4ADE80" }}>Топ 12%</span>
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div style={{ padding: "12px 16px 8px" }}>
        <div
          style={{
            background: "white",
            borderRadius: 14,
            border: `1.5px solid ${searchFocused ? "#D4783A" : "#EAE4D8"}`,
            boxShadow: "0 1px 4px rgba(61,46,31,0.06)",
            display: "flex",
            alignItems: "center",
            padding: "0 12px",
            gap: 8,
            height: 46,
            transition: "border-color 0.15s ease",
          }}
        >
          <span style={{ fontSize: 16, opacity: 0.35 }}>🔍</span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Поиск продуктов..."
            aria-label="Поиск продуктов"
            style={{
              flex: 1,
              border: "none",
              background: "transparent",
              fontSize: 14,
              color: "#3D2E1F",
              outline: "none",
              padding: "0",
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

      {/* Category filters — with right fade */}
      <div style={{ position: "relative" }}>
        <div className="scroll-x" style={{ padding: "4px 16px 14px" }}>
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
        {/* Right fade */}
        <div style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 32,
          background: "linear-gradient(to left, #FAF7F0, transparent)",
          pointerEvents: "none",
        }} />
      </div>

      {/* Sandyq banner — showpiece */}
      {showBanner && (
        <div style={{ padding: "0 16px 14px" }}>
          <div style={{
            background: "linear-gradient(135deg, #2C2016 0%, #4A3020 40%, #3D2E1F 100%)",
            borderRadius: 20,
            padding: "18px 18px",
            position: "relative",
            overflow: "hidden",
            border: "1px solid rgba(200,169,110,0.2)",
          }}>
            {/* Kazakh geometric pattern background */}
            <div style={{
              position: "absolute",
              inset: 0,
              opacity: 0.06,
              backgroundImage: `repeating-linear-gradient(45deg, #C8A96E 0px, #C8A96E 1px, transparent 1px, transparent 12px),
                repeating-linear-gradient(-45deg, #C8A96E 0px, #C8A96E 1px, transparent 1px, transparent 12px)`,
              pointerEvents: "none",
            }} aria-hidden="true" />

            {/* Floating sparkle particles */}
            {[
              { top: "20%", left: "60%", delay: "0s" },
              { top: "60%", left: "75%", delay: "0.7s" },
              { top: "35%", left: "85%", delay: "1.4s" },
            ].map((pos, i) => (
              <div key={i} style={{
                position: "absolute",
                top: pos.top,
                left: pos.left,
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: "#C8A96E",
                opacity: 0.6,
                animation: `float-drop 2.2s ease-in-out ${pos.delay} infinite`,
                pointerEvents: "none",
              }} aria-hidden="true" />
            ))}

            <div style={{ display: "flex", alignItems: "flex-start", gap: 14, position: "relative" }}>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 11,
                  color: "rgba(232,213,168,0.7)",
                  letterSpacing: "2px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  marginBottom: 6,
                  fontFamily: "var(--font-jakarta, sans-serif)",
                }}>
                  Специальное предложение
                </div>
                <div style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#C8A96E",
                  marginBottom: 4,
                  fontFamily: "var(--font-playfair, Georgia, serif)",
                  letterSpacing: "-0.01em",
                }}>
                  📦 Сандық недели
                </div>
                <div style={{ fontSize: 12, color: "rgba(232,213,168,0.75)", lineHeight: 1.5 }}>
                  Лучшее с сегодняшнего базара — отборное
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{
                  background: "rgba(200,169,110,0.15)",
                  border: "1px solid rgba(200,169,110,0.4)",
                  borderRadius: 20,
                  padding: "4px 12px",
                  marginBottom: 10,
                }}>
                  <span style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#C8A96E",
                    fontFamily: "Georgia, serif",
                  }}>₸3,500</span>
                </div>
                <button
                  className="btn-primary"
                  style={{ height: 34, fontSize: 13, padding: "0 16px", borderRadius: 10 }}
                >
                  Хочу
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live bazaar indicator */}
      {showBanner && (
        <div style={{ padding: "0 16px 14px", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%", background: "#4ADE80",
            flexShrink: 0, animation: "pulse-dot 1.8s ease-in-out infinite",
          }} aria-hidden="true" />
          <span style={{ fontSize: 12, color: "#9A9490", fontWeight: 500 }}>
            С сегодняшнего базара · <span style={{ color: "#3D2E1F", fontWeight: 600 }}>Алтын Орда</span> · 8:30
          </span>
        </div>
      )}

      {/* Section header */}
      {showBanner && filteredProducts.length > 0 && (
        <div style={{ padding: "4px 16px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#3D2E1F",
            fontFamily: "var(--font-playfair, Georgia, serif)",
            letterSpacing: "-0.02em",
          }}>
            Сегодня на базаре
          </div>
          <div style={{ fontSize: 12, color: "#9A9490", fontWeight: 500 }}>
            {filteredProducts.length} товаров
          </div>
        </div>
      )}

      {/* Product grid — staggered layout */}
      <div style={{ padding: "0 16px" }}>
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 20px", color: "#9A9490" }}>
            <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.5 }}>🔍</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#3D2E1F", fontFamily: "var(--font-playfair, Georgia, serif)" }}>
              Ничего не найдено
            </div>
            <div style={{ fontSize: 13, marginTop: 6, lineHeight: 1.5 }}>
              Попробуйте другой запрос
            </div>
          </div>
        ) : (
          <div>
            {/* Featured first product (full width) — only on "all" tab with no search */}
            {showBanner && filteredProducts.length > 0 && (
              <div style={{ marginBottom: 10 }}>
                <ProductCard
                  product={filteredProducts[0]}
                  onOpenDetail={setSelectedProduct}
                  featured
                />
              </div>
            )}

            {/* Ornamental divider between featured and grid */}
            {showBanner && filteredProducts.length > 1 && (
              <div style={{ marginBottom: 10 }}>
                <div style={{
                  height: 1,
                  background: "repeating-linear-gradient(90deg, #EAE4D8 0px, #EAE4D8 6px, transparent 6px, transparent 12px)",
                  opacity: 0.8,
                }} aria-hidden="true" />
              </div>
            )}

            {/* Regular 2-column grid */}
            <div
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
              role="list"
              aria-label="Список продуктов"
            >
              {(showBanner ? filteredProducts.slice(1) : filteredProducts).map((product, idx) => (
                <div
                  key={product.id}
                  role="listitem"
                  style={{
                    animationName: "stagger-in",
                    animationDuration: "0.4s",
                    animationTimingFunction: "ease",
                    animationDelay: `${Math.min(idx, 6) * 60}ms`,
                    animationFillMode: "both",
                  }}
                >
                  <ProductCard product={product} onOpenDetail={setSelectedProduct} />
                </div>
              ))}
            </div>
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
