"use client";

import { useState } from "react";
import { PRODUCT_CATALOG } from "@/sauda/data/productCatalog";

interface OnboardingData {
  phone: string;
  smsVerified: boolean;
  profile: { name: string; stallNumber: string; stallPhoto: string | null; bazaar: string; city: string };
  products: { categories: string[]; prices: Record<string, number> };
  payment: { method: "kaspi" | "bank"; kaspiPhone: string; bankIBAN: string };
  agreement: { termsAccepted: boolean; dataConsentAccepted: boolean; digitalSignature: string; acceptedAt: string | null };
  tutorialCompleted: boolean;
}

interface StepProps {
  data: OnboardingData;
  onUpdate: (partial: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack?: () => void;
}

export default function ProductCategories({ data, onUpdate, onNext, onBack }: StepProps) {
  // Track order in which categories were selected for display ordering
  const [selectionOrder, setSelectionOrder] = useState<string[]>(
    data.products.categories
  );

  const selectedCategories = data.products.categories;
  const prices = data.products.prices;

  function toggleCategory(categoryId: string) {
    const isSelected = selectedCategories.includes(categoryId);

    if (isSelected) {
      const newCategories = selectedCategories.filter((c) => c !== categoryId);
      setSelectionOrder((prev) => prev.filter((c) => c !== categoryId));
      onUpdate({ products: { categories: newCategories, prices } });
    } else {
      const newCategories = [...selectedCategories, categoryId];
      setSelectionOrder((prev) => [...prev, categoryId]);
      onUpdate({ products: { categories: newCategories, prices } });
    }
  }

  function updatePrice(productName: string, value: string) {
    const parsed = parseInt(value, 10);
    const newPrices = {
      ...prices,
      [productName]: isNaN(parsed) ? 0 : parsed,
    };
    onUpdate({ products: { categories: selectedCategories, prices: newPrices } });
  }

  const canProceed = selectedCategories.length > 0;

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#FAF7F0",
        padding: 24,
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
      }}
    >
      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          background: "none",
          border: "none",
          fontSize: 14,
          color: "#9A9490",
          cursor: "pointer",
          padding: "8px 0",
          alignSelf: "flex-start",
          fontFamily: "inherit",
          minHeight: 48,
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        ← Назад
      </button>

      {/* Heading */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 22, fontWeight: "bold", color: "#3D2E1F", marginBottom: 4 }}>
          Что вы продаёте?
        </div>
        <div style={{ fontSize: 14, color: "#9A9490" }}>
          Выберите категории и укажите примерные цены
        </div>
      </div>

      {/* Category chips */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: 16,
        }}
      >
        {PRODUCT_CATALOG.map((cat) => {
          const isSelected = selectedCategories.includes(cat.id);
          return (
            <button
              key={cat.id}
              onClick={() => toggleCategory(cat.id)}
              style={{
                minHeight: 44,
                padding: "8px 14px",
                borderRadius: 20,
                border: `1.5px solid ${isSelected ? "#3D2E1F" : "#EAE4D8"}`,
                backgroundColor: isSelected ? "#3D2E1F" : "white",
                color: isSelected ? "white" : "#3D2E1F",
                fontSize: 14,
                fontWeight: 500,
                fontFamily: "inherit",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "background-color 200ms ease, border-color 200ms ease, color 200ms ease",
              }}
            >
              {cat.emoji} {cat.label}
            </button>
          );
        })}
      </div>

      {/* Price sections for selected categories, in selection order */}
      {selectionOrder
        .filter((id) => selectedCategories.includes(id))
        .map((catId) => {
          const cat = PRODUCT_CATALOG.find((c) => c.id === catId);
          if (!cat) return null;
          const isExpanded = selectedCategories.includes(catId);

          return (
            <div
              key={catId}
              style={{
                maxHeight: isExpanded ? 1000 : 0,
                overflow: "hidden",
                transition: "max-height 300ms ease",
                marginBottom: isExpanded ? 16 : 0,
              }}
            >
              <div
                style={{
                  background: "white",
                  borderRadius: 12,
                  border: "1px solid #EAE4D8",
                  overflow: "hidden",
                }}
              >
                {/* Category header */}
                <div
                  style={{
                    padding: "12px 16px",
                    fontSize: 14,
                    fontWeight: "bold",
                    color: "#9A9490",
                    borderBottom: cat.products.length > 0 ? "1px solid #EAE4D8" : "none",
                    background: "#FAF7F0",
                  }}
                >
                  {cat.emoji} {cat.label}
                </div>

                {/* Products */}
                {cat.products.length === 0 && (
                  <div
                    style={{
                      padding: "16px",
                      fontSize: 14,
                      color: "#9A9490",
                      fontStyle: "italic",
                    }}
                  >
                    Укажите товары позже в настройках
                  </div>
                )}

                {cat.products.map((product, idx) => (
                  <div
                    key={product.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0 16px",
                      minHeight: 48,
                      borderBottom:
                        idx < cat.products.length - 1 ? "1px solid #EAE4D8" : "none",
                      gap: 12,
                    }}
                  >
                    {/* Product name */}
                    <span
                      style={{
                        fontSize: 15,
                        color: "#3D2E1F",
                        flex: 1,
                      }}
                    >
                      {product.name}
                    </span>

                    {/* Price input + unit */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        flexShrink: 0,
                      }}
                    >
                      <input
                        type="number"
                        inputMode="numeric"
                        placeholder={`~${product.hint}`}
                        value={prices[product.name] || ""}
                        onChange={(e) => updatePrice(product.name, e.target.value)}
                        style={{
                          width: 80,
                          height: 40,
                          border: "1px solid #EAE4D8",
                          borderRadius: 8,
                          fontSize: 15,
                          fontFamily: "inherit",
                          textAlign: "right",
                          padding: "0 8px",
                          color: "#3D2E1F",
                          background: "white",
                          outline: "none",
                          boxSizing: "border-box",
                          // Remove number input spinners
                          MozAppearance: "textfield",
                        } as React.CSSProperties}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "#D4853A";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "#EAE4D8";
                        }}
                      />
                      <span
                        style={{
                          fontSize: 13,
                          color: "#9A9490",
                          whiteSpace: "nowrap",
                        }}
                      >
                        ₸/{product.unit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

      <div style={{ flex: 1 }} />

      {/* Helper text + CTA */}
      <div style={{ marginTop: 24 }}>
        {!canProceed && (
          <div
            style={{
              fontSize: 13,
              color: "#9A9490",
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            Выберите хотя бы одну категорию
          </div>
        )}

        <button
          disabled={!canProceed}
          onClick={onNext}
          style={{
            height: 56,
            width: "100%",
            backgroundColor: canProceed ? "#D4853A" : "#EAE4D8",
            color: canProceed ? "white" : "#9A9490",
            border: "none",
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 600,
            fontFamily: "inherit",
            cursor: canProceed ? "pointer" : "not-allowed",
            transition: "background-color 200ms ease",
          }}
        >
          Далее →
        </button>
      </div>

      <div style={{ height: 32 }} />
    </div>
  );
}
