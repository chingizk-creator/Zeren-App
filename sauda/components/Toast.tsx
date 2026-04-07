"use client";

import { useSauda } from "@/sauda/context/SaudaContext";

export default function Toast() {
  const { state } = useSauda();
  const { toastVisible, toastTitle, toastDesc, toastEmoji } = state;

  return (
    <div
      style={{
        position: "fixed",
        top: toastVisible ? 16 : -120,
        left: 16,
        right: 16,
        maxWidth: "calc(420px - 32px)",
        margin: "0 auto",
        transition: "top 0.35s cubic-bezier(0.34,1.56,0.64,1)",
        background: "#3D2E1F",
        borderRadius: 16,
        padding: "14px 16px",
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
        zIndex: 9999,
      }}
    >
      {/* Emoji */}
      <span style={{ fontSize: 28, lineHeight: 1, flexShrink: 0 }}>{toastEmoji}</span>

      {/* Text column */}
      <div>
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "#C8A96E",
          }}
        >
          {toastTitle}
        </div>
        <div
          style={{
            fontSize: 12,
            color: "#E8D5A8",
            marginTop: 2,
          }}
        >
          {toastDesc}
        </div>
      </div>
    </div>
  );
}
