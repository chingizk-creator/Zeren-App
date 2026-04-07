"use client";

import { useSauda } from "@/sauda/context/SaudaContext";
import { TIER_LABELS, TIER_COLORS, formatPriceFull } from "@/sauda/data/mock";

export default function Header() {
  const { state } = useSauda();
  const { vendor, isOnline } = state;
  const { tier } = vendor;

  return (
    <header
      style={{
        backgroundColor: "#3D2E1F",
        padding: "16px",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 10,
        }}
      >
        {/* Left column */}
        <div>
          <div
            style={{
              fontSize: 9,
              color: "#E8D5A8",
              letterSpacing: 1,
              marginBottom: 3,
            }}
          >
            Добро пожаловать, {vendor.name}
          </div>
          <div
            style={{
              fontSize: 12,
              color: "#C8A96E",
              fontWeight: 600,
            }}
          >
            Прилавок №{vendor.stallNumber} · {vendor.bazaar}
          </div>
        </div>

        {/* Right column */}
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 18,
              fontWeight: 700,
              color: "#C8A96E",
            }}
          >
            {formatPriceFull(vendor.metrics.monthlyRevenue)}
          </div>
          <div
            style={{
              fontSize: 9,
              color: "#E8D5A8",
              marginTop: 2,
            }}
          >
            доход за месяц
          </div>
        </div>
      </div>

      {/* Bottom row: tier badge + online status */}
      <div
        style={{
          display: "inline-flex",
          gap: 6,
          alignItems: "center",
        }}
      >
        {/* Tier dot */}
        <span
          style={{
            display: "inline-block",
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: TIER_COLORS[tier],
            flexShrink: 0,
          }}
        />
        {/* Tier label */}
        <span
          style={{
            fontSize: 10,
            color: TIER_COLORS[tier],
            fontWeight: 600,
          }}
        >
          {TIER_LABELS[tier]} продавец
        </span>
        {/* Separator */}
        <span style={{ fontSize: 10, color: "#9A9490" }}>|</span>
        {/* Online indicator dot */}
        <span
          style={{
            display: "inline-block",
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: isOnline ? "#4A8B3A" : "#C0392B",
            flexShrink: 0,
          }}
        />
        {/* Online label */}
        <span
          style={{
            fontSize: 10,
            color: isOnline ? "#4A8B3A" : "#C0392B",
            fontWeight: 600,
          }}
        >
          {isOnline ? "Онлайн" : "Офлайн"}
        </span>
      </div>
    </header>
  );
}
