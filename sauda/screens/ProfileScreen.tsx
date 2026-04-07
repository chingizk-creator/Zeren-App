"use client";

import { useState } from "react";
import { useSauda } from "@/sauda/context/SaudaContext";
import { TIER_LABELS, TIER_COLORS, formatPriceFull } from "@/sauda/data/mock";

const TIER_EMOJIS = { gold: "🥇", silver: "🥈", bronze: "🥉" } as const;

const FAKE_RETAIL_PRICES = [500, 750, 380, 500];

export default function ProfileScreen() {
  const { state } = useSauda();
  const { vendor } = state;
  const { name, stallNumber, bazaar, phone, tier, joinedDate, metrics, productCategories } = vendor;

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(false);

  const maskedPhone = `+7 ${phone.slice(2, 5)} *** **${phone.slice(-2)}`;
  const joinedLabel = new Date(joinedDate).toLocaleDateString("ru-RU", { month: "long", year: "numeric" });
  const initial = name.charAt(0);

  function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
    return (
      <button
        onClick={onToggle}
        style={{
          width: 42,
          height: 24,
          borderRadius: 12,
          background: enabled ? "#4A8B3A" : "#EAE4D8",
          position: "relative",
          cursor: "pointer",
          border: "none",
          padding: 0,
          flexShrink: 0,
          transition: "background 0.2s",
        }}
        aria-pressed={enabled}
      >
        <span
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "white",
            position: "absolute",
            top: 2,
            left: enabled ? 20 : 2,
            transition: "left 0.2s",
            display: "block",
          }}
        />
      </button>
    );
  }

  function SectionCard({ children, marginTop = 16 }: { children: React.ReactNode; marginTop?: number }) {
    return (
      <div
        style={{
          background: "white",
          borderRadius: 16,
          margin: `${marginTop}px 16px 0`,
          border: "1px solid #EAE4D8",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    );
  }

  function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
      <div
        style={{
          padding: "10px 16px 6px",
          fontSize: 11,
          fontWeight: 600,
          color: "#9A9490",
          textTransform: "uppercase" as const,
          letterSpacing: "0.05em",
        }}
      >
        {children}
      </div>
    );
  }

  function Row({
    children,
    isLast = false,
  }: {
    children: React.ReactNode;
    isLast?: boolean;
  }) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 16px",
          borderBottom: isLast ? "none" : "1px solid #EAE4D8",
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <div style={{ padding: "0 0 80px", background: "#FAF7F0", minHeight: "100%" }}>
      {/* Vendor Card */}
      <div
        style={{
          background: "#3D2E1F",
          padding: "24px 20px",
          textAlign: "center",
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "rgba(200,169,110,0.2)",
            border: "2px solid #C8A96E",
            margin: "0 auto 12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: 28,
              fontWeight: "bold",
              fontFamily: "Georgia, serif",
              color: "#C8A96E",
            }}
          >
            {initial}
          </span>
        </div>

        {/* Name */}
        <div
          style={{
            fontSize: 20,
            fontWeight: "bold",
            fontFamily: "Georgia, serif",
            color: "white",
            marginBottom: 2,
          }}
        >
          {name}
        </div>

        {/* Stall info */}
        <div style={{ fontSize: 13, color: "#E8D5A8", marginBottom: 12 }}>
          Прилавок №{stallNumber} · {bazaar}
        </div>

        {/* Tier badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 18 }}>{TIER_EMOJIS[tier]}</span>
          <span
            style={{
              fontSize: 13,
              fontWeight: "bold",
              color: TIER_COLORS[tier],
            }}
          >
            {TIER_LABELS[tier]} продавец
          </span>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 20,
            marginTop: 16,
            alignItems: "center",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 18,
                fontWeight: "bold",
                fontFamily: "Georgia, serif",
                color: "#C8A96E",
              }}
            >
              ₸{(metrics.monthlyRevenue / 1000).toFixed(0)}K
            </div>
            <div style={{ fontSize: 10, color: "#E8D5A8" }}>этот месяц</div>
          </div>

          <div style={{ color: "rgba(255,255,255,0.2)", fontSize: 20 }}>|</div>

          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 18,
                fontWeight: "bold",
                fontFamily: "Georgia, serif",
                color: "#C8A96E",
              }}
            >
              {(metrics.acceptanceRate * 100).toFixed(0)}%
            </div>
            <div style={{ fontSize: 10, color: "#E8D5A8" }}>принятие</div>
          </div>
        </div>

        {/* Phone */}
        <div style={{ fontSize: 12, color: "#9A9490", marginTop: 8 }}>
          {maskedPhone}
        </div>

        {/* Joined date */}
        <div style={{ fontSize: 11, color: "#9A9490" }}>
          Участник с {joinedLabel}
        </div>
      </div>

      {/* Section: Уведомления */}
      <SectionLabel>Уведомления</SectionLabel>
      <SectionCard marginTop={0}>
        <Row>
          <span style={{ fontSize: 14, color: "#3D2E1F" }}>🔔 Звук новых заказов</span>
          <Toggle enabled={soundEnabled} onToggle={() => setSoundEnabled(v => !v)} />
        </Row>
        <Row>
          <span style={{ fontSize: 14, color: "#3D2E1F" }}>📳 Вибрация</span>
          <Toggle enabled={vibrationEnabled} onToggle={() => setVibrationEnabled(v => !v)} />
        </Row>
        <Row isLast>
          <span style={{ fontSize: 14, color: "#3D2E1F" }}>🌙 Тихие часы (22:00–6:00)</span>
          <Toggle enabled={quietHoursEnabled} onToggle={() => setQuietHoursEnabled(v => !v)} />
        </Row>
      </SectionCard>

      {/* Section: Рабочие часы */}
      <SectionLabel>Рабочие часы</SectionLabel>
      <SectionCard marginTop={0}>
        <Row>
          <span style={{ fontSize: 14, color: "#3D2E1F" }}>Рабочее время</span>
          <span style={{ fontSize: 14, fontWeight: "bold", color: "#D4853A" }}>6:00 — 18:00</span>
        </Row>
        <Row isLast>
          <span style={{ fontSize: 14, color: "#3D2E1F" }}>Выходные дни</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14, color: "#9A9490" }}>Нет</span>
            <span style={{ fontSize: 11, color: "#C8A96E" }}>Изменить</span>
          </div>
        </Row>
      </SectionCard>

      {/* Section: Каталог товаров */}
      <SectionLabel>Каталог товаров</SectionLabel>
      <SectionCard marginTop={0}>
        {productCategories.map((product, i) => (
          <Row key={product} isLast={i === productCategories.length - 1}>
            <span style={{ fontSize: 14, color: "#3D2E1F" }}>{product}</span>
            <span style={{ fontSize: 13, color: "#9A9490" }}>
              ₸{FAKE_RETAIL_PRICES[i] ?? 500}
            </span>
          </Row>
        ))}
      </SectionCard>

      {/* Section: Дополнительно */}
      <SectionLabel>Дополнительно</SectionLabel>
      <SectionCard marginTop={0}>
        <Row>
          <span style={{ fontSize: 14, color: "#3D2E1F" }}>💬 Чат поддержки</span>
          <span style={{ fontSize: 16, color: "#9A9490" }}>›</span>
        </Row>
        <Row>
          <span style={{ fontSize: 14, color: "#3D2E1F" }}>📄 Договор</span>
          <span style={{ fontSize: 16, color: "#9A9490" }}>›</span>
        </Row>
        <Row isLast>
          <span style={{ fontSize: 14, color: "#3D2E1F" }}>🌐 Язык: Русский</span>
          <span style={{ fontSize: 16, color: "#9A9490" }}>›</span>
        </Row>
      </SectionCard>

      {/* Logout button */}
      <div style={{ margin: "20px 16px 0" }}>
        <button
          style={{
            width: "100%",
            height: 48,
            borderRadius: 12,
            background: "#FAF7F0",
            border: "1px solid #EAE4D8",
            color: "#C0392B",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Выйти из аккаунта
        </button>
      </div>
    </div>
  );
}
