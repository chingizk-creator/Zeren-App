"use client";

import { useSauda } from "@/sauda/context/SaudaContext";
import {
  formatPrice,
  formatPriceFull,
  TIER_LABELS,
  TIER_COLORS,
  MOCK_WEEKLY_REVENUE,
  type VendorTier,
} from "@/sauda/data/mock";

// ─── Tier benefits ────────────────────────────────────────────────────────────

const TIER_BENEFITS: Record<VendorTier, string[]> = {
  gold: [
    "Доступ к SELECT заказам",
    "Ежедневные выплаты",
    "Кредитный лимит ₸1.5M",
    "Приоритетная поддержка",
  ],
  silver: [
    "Двухнедельные выплаты",
    "Кредитный лимит ₸750K",
    "Стандартная поддержка",
  ],
  bronze: ["Еженедельные выплаты", "Кредитный лимит ₸250K"],
};

const TIER_EMOJI: Record<VendorTier, string> = {
  gold: "🥇",
  silver: "🥈",
  bronze: "🥉",
};

// ─── Upgrade criteria ─────────────────────────────────────────────────────────

interface Criterion {
  label: string;
  currentValue: string;
  requiredValue: string;
  met: boolean;
}

function getUpgradeCriteria(
  tier: VendorTier,
  metrics: {
    acceptanceRate: number;
    qualityScore: number;
    avgResponseTime: number;
    monthlyVolume: number;
  }
): Criterion[] {
  if (tier === "silver") {
    return [
      {
        label: "Принятие заказов",
        currentValue: `${(metrics.acceptanceRate * 100).toFixed(0)}%`,
        requiredValue: "≥ 85%",
        met: metrics.acceptanceRate >= 0.85,
      },
      {
        label: "Качество",
        currentValue: `${(metrics.qualityScore * 100).toFixed(0)}%`,
        requiredValue: "≥ 90%",
        met: metrics.qualityScore >= 0.9,
      },
      {
        label: "Скорость ответа",
        currentValue: `${(metrics.avgResponseTime / 60).toFixed(1)} мин`,
        requiredValue: "≤ 3 мин",
        met: metrics.avgResponseTime <= 180,
      },
      {
        label: "Объём",
        currentValue: `${metrics.monthlyVolume.toLocaleString("ru-RU")} кг`,
        requiredValue: "≥ 1000 кг",
        met: metrics.monthlyVolume >= 1000,
      },
    ];
  }
  // bronze → silver
  return [
    {
      label: "Принятие заказов",
      currentValue: `${(metrics.acceptanceRate * 100).toFixed(0)}%`,
      requiredValue: "≥ 70%",
      met: metrics.acceptanceRate >= 0.7,
    },
    {
      label: "Качество",
      currentValue: `${(metrics.qualityScore * 100).toFixed(0)}%`,
      requiredValue: "≥ 80%",
      met: metrics.qualityScore >= 0.8,
    },
  ];
}

// ─── Metric colour helper ─────────────────────────────────────────────────────

function rateColor(value: number, thresholdHigh: number, thresholdMid: number): string {
  if (value >= thresholdHigh) return "#4A8B3A";
  if (value >= thresholdMid) return "#C8A96E";
  return "#C0392B";
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AnalyticsScreen() {
  const { state } = useSauda();
  const { vendor } = state;
  const metrics = vendor.metrics;
  const tier = vendor.tier;
  const tierColor = TIER_COLORS[tier];
  const tierLabel = TIER_LABELS[tier];

  const data = MOCK_WEEKLY_REVENUE;
  const maxAmount = Math.max(...data.map((d) => d.amount), 1);

  const avgPricePerKg =
    metrics.monthlyVolume > 0
      ? Math.round(metrics.monthlyRevenue / metrics.monthlyVolume)
      : 0;

  const acceptanceColor = rateColor(metrics.acceptanceRate, 0.8, 0.6);
  const qualityColor = rateColor(metrics.qualityScore, 0.8, 0.6);
  const responseColor =
    metrics.avgResponseTime < 180
      ? "#4A8B3A"
      : metrics.avgResponseTime < 300
      ? "#C8A96E"
      : "#C0392B";
  const repeatColor = metrics.repeatCustomerRate >= 0.7 ? "#4A8B3A" : "#C8A96E";

  const upgradeCriteria =
    tier !== "gold" ? getUpgradeCriteria(tier, metrics) : [];

  const nextTierLabel =
    tier === "bronze" ? TIER_LABELS.silver : TIER_LABELS.gold;

  // ─── Card label style ────────────────────────────────────────────────────────

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 11,
    fontWeight: 600,
    color: "#9A9490",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  };

  const valueStyle: React.CSSProperties = {
    fontFamily: "Georgia, serif",
    fontSize: 24,
    fontWeight: 700,
    color: "#3D2E1F",
    marginBottom: 2,
    lineHeight: 1.1,
  };

  const subtextStyle: React.CSSProperties = {
    fontSize: 11,
    color: "#4A8B3A",
  };

  const metricCardStyle: React.CSSProperties = {
    background: "white",
    borderRadius: 16,
    padding: 16,
    border: "1px solid #EAE4D8",
  };

  return (
    <div style={{ padding: "16px 16px 80px", background: "#FAF7F0", minHeight: "100%" }}>
      {/* ── Section 1: Monthly stats hero ──────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginBottom: 20,
        }}
      >
        {/* Card 1 — Monthly revenue */}
        <div style={metricCardStyle}>
          <span style={labelStyle}>Доход за месяц</span>
          <div style={valueStyle}>{formatPrice(metrics.monthlyRevenue)}</div>
          <div style={subtextStyle}>↑ +12% vs прошлый месяц</div>
        </div>

        {/* Card 2 — Orders */}
        <div style={metricCardStyle}>
          <span style={labelStyle}>Заказов</span>
          <div style={valueStyle}>{metrics.monthlyOrders.toString()}</div>
          <div style={{ ...subtextStyle, color: "#9A9490" }}>за месяц</div>
        </div>

        {/* Card 3 — Volume */}
        <div style={metricCardStyle}>
          <span style={labelStyle}>Объём</span>
          <div style={valueStyle}>
            {metrics.monthlyVolume.toLocaleString("ru-RU")} кг
          </div>
          <div style={{ ...subtextStyle, color: "#9A9490" }}>продано</div>
        </div>

        {/* Card 4 — Average price */}
        <div style={metricCardStyle}>
          <span style={labelStyle}>Средняя цена</span>
          <div style={valueStyle}>₸{avgPricePerKg}/кг</div>
          <div style={{ ...subtextStyle, color: "#9A9490" }}>за месяц</div>
        </div>
      </div>

      {/* ── Section 2: Performance metrics ─────────────────────────────────────── */}
      <div style={{ fontSize: 14, fontWeight: 700, color: "#3D2E1F", marginBottom: 12 }}>
        Показатели
      </div>
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: 16,
          border: "1px solid #EAE4D8",
          marginBottom: 20,
        }}
      >
        {/* Acceptance rate */}
        <div style={{ paddingBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#3D2E1F" }}>
              Принятие заказов
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: acceptanceColor }}>
              {(metrics.acceptanceRate * 100).toFixed(0)}%
            </span>
          </div>
          <div
            style={{
              height: 6,
              borderRadius: 3,
              background: "#EAE4D8",
              marginTop: 8,
            }}
          >
            <div
              style={{
                width: `${metrics.acceptanceRate * 100}%`,
                height: "100%",
                borderRadius: 3,
                background: acceptanceColor,
                transition: "width 0.8s ease",
              }}
            />
          </div>
        </div>

        <div style={{ height: 1, background: "#EAE4D8" }} />

        {/* Quality score */}
        <div style={{ padding: "12px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#3D2E1F" }}>
              Оценка качества
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: qualityColor }}>
              {(metrics.qualityScore * 100).toFixed(0)}%
            </span>
          </div>
          <div
            style={{
              height: 6,
              borderRadius: 3,
              background: "#EAE4D8",
              marginTop: 8,
            }}
          >
            <div
              style={{
                width: `${metrics.qualityScore * 100}%`,
                height: "100%",
                borderRadius: 3,
                background: qualityColor,
                transition: "width 0.8s ease",
              }}
            />
          </div>
        </div>

        <div style={{ height: 1, background: "#EAE4D8" }} />

        {/* Response time */}
        <div style={{ padding: "12px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#3D2E1F" }}>
              Скорость ответа
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: responseColor }}>
              {(metrics.avgResponseTime / 60).toFixed(1)} мин
            </span>
          </div>
        </div>

        <div style={{ height: 1, background: "#EAE4D8" }} />

        {/* Repeat customers */}
        <div style={{ paddingTop: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#3D2E1F" }}>
              Повторные клиенты
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: repeatColor }}>
              {(metrics.repeatCustomerRate * 100).toFixed(0)}%
            </span>
          </div>
          <div
            style={{
              height: 6,
              borderRadius: 3,
              background: "#EAE4D8",
              marginTop: 8,
            }}
          >
            <div
              style={{
                width: `${metrics.repeatCustomerRate * 100}%`,
                height: "100%",
                borderRadius: 3,
                background: repeatColor,
                transition: "width 0.8s ease",
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Section 3: Weekly revenue chart ────────────────────────────────────── */}
      <div style={{ fontSize: 14, fontWeight: 700, color: "#3D2E1F", marginBottom: 12 }}>
        Выручка за неделю
      </div>
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: "16px 16px 8px",
          border: "1px solid #EAE4D8",
          marginBottom: 20,
        }}
      >
        {/* Bars area */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 8,
            height: 100,
            marginBottom: 8,
          }}
        >
          {data.map((d) => {
            const barHeight = d.amount > 0 ? Math.max((d.amount / maxAmount) * 80, 4) : 0;
            return (
              <div
                key={d.day}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  justifyContent: "flex-end",
                  height: "100%",
                }}
              >
                {/* Amount label above bar */}
                {d.amount > 0 && (
                  <span style={{ fontSize: 9, color: "#9A9490", whiteSpace: "nowrap" }}>
                    {formatPrice(d.amount)}
                  </span>
                )}
                {/* Bar */}
                <div
                  style={{
                    width: "100%",
                    height: barHeight,
                    borderRadius: "4px 4px 0 0",
                    background: d.isToday ? "#D4853A" : "#EAE4D8",
                    boxShadow:
                      d.amount > 0 && d.isToday
                        ? "0 2px 8px rgba(212,133,58,0.35)"
                        : "none",
                    transition: "height 0.6s ease",
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Day labels below bars */}
        <div style={{ display: "flex", gap: 8 }}>
          {data.map((d) => (
            <div
              key={d.day}
              style={{
                flex: 1,
                textAlign: "center",
                fontSize: 11,
                fontWeight: d.isToday ? 700 : 400,
                color: d.isToday ? "#D4853A" : "#9A9490",
              }}
            >
              {d.day}
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 4: Tier status card ─────────────────────────────────────────── */}
      <div
        style={{
          background: "#3D2E1F",
          borderRadius: 16,
          padding: 20,
          marginBottom: 20,
        }}
      >
        {/* Top row */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <span style={{ fontSize: 32, lineHeight: 1 }}>{TIER_EMOJI[tier]}</span>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: tierColor, lineHeight: 1.2 }}>
              {tierLabel} продавец
            </div>
            <div
              style={{
                marginTop: 2,
                height: 3,
                width: 40,
                borderRadius: 2,
                background: tierColor,
              }}
            />
          </div>
        </div>

        {/* Benefits */}
        <div>
          {TIER_BENEFITS[tier].map((benefit) => (
            <div
              key={benefit}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
                marginBottom: 4,
              }}
            >
              <span style={{ color: tierColor, fontSize: 13, lineHeight: 1.5 }}>✓</span>
              <span style={{ color: "#E8D5A8", fontSize: 13, lineHeight: 1.5 }}>{benefit}</span>
            </div>
          ))}
        </div>

        {/* Upgrade section */}
        {tier !== "gold" && (
          <>
            <div
              style={{
                height: 1,
                background: "rgba(255,255,255,0.1)",
                margin: "16px 0 12px",
              }}
            />
            <div style={{ fontSize: 11, color: "#C8A96E", fontWeight: 600, marginBottom: 8 }}>
              До следующего уровня: {nextTierLabel}
            </div>
            {upgradeCriteria.map((c) => (
              <div
                key={c.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 6,
                }}
              >
                <span style={{ fontSize: 12, color: "#9A9490" }}>{c.label}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: c.met ? "#4A8B3A" : "#C0392B",
                    }}
                  >
                    {c.currentValue}
                  </span>
                  <span style={{ fontSize: 11, color: "#9A9490" }}>→</span>
                  <span style={{ fontSize: 12, color: "#9A9490" }}>{c.requiredValue}</span>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
