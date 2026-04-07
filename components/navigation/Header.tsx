"use client";

import { useAuth } from "@/context/AuthContext";
import { useApp } from "@/context/AppContext";

interface HeaderProps {
  title?: string;
}

export default function Header({ title }: HeaderProps) {
  const { authState } = useAuth();
  const { setScreen } = useApp();
  const { user } = authState;

  // Show last 2 digits of phone for avatar label
  const avatarLabel = user.isAuthenticated && user.phone
    ? user.phone.slice(-2)
    : null;

  return (
    <header
      style={{
        background: "#3D2E1F",
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
        minHeight: 52,
        zIndex: 50,
      }}
    >
      {/* Left spacer / back slot */}
      <div style={{ width: 36 }} />

      {/* Center: brand or screen title */}
      {title ? (
        <span style={{ fontSize: 16, fontWeight: 700, color: "#C8A96E", fontFamily: "Georgia, serif" }}>
          {title}
        </span>
      ) : (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 15, fontWeight: 700, color: "#C8A96E", letterSpacing: "2px" }}>
            ZEREN
          </div>
          <div style={{ fontSize: 9, color: "#E8D5A8", letterSpacing: "0.5px", marginTop: 1 }}>
            📍 Алматы
          </div>
        </div>
      )}

      {/* Right: user avatar when logged in */}
      <div style={{ width: 36, display: "flex", justifyContent: "flex-end" }}>
        {avatarLabel ? (
          <button
            onClick={() => setScreen("profile")}
            aria-label="Профиль"
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: "rgba(200,169,110,0.2)",
              border: "1.5px solid rgba(200,169,110,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: 10,
              fontWeight: 700,
              color: "#C8A96E",
              fontFamily: "inherit",
              minHeight: "unset",
              minWidth: "unset",
            }}
          >
            {avatarLabel}
          </button>
        ) : (
          <div style={{ width: 30 }} />
        )}
      </div>
    </header>
  );
}
