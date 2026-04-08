"use client";

export type VendorStatus = "registered" | "verified" | "active" | "suspended" | "terminated";

interface Props {
  status: VendorStatus;
}

interface BannerConfig {
  background: string;
  color: string;
  borderBottom: string;
  icon: string;
  text: string;
}

const BANNER_CONFIG: Record<Exclude<VendorStatus, "active">, BannerConfig> = {
  registered: {
    background: "#FFF9E6",
    color: "#7A5F00",
    borderBottom: "1px solid #F0D070",
    icon: "⏳",
    text: "Проверка аккаунта — обычно занимает до 48 часов",
  },
  verified: {
    background: "#EDF7EA",
    color: "#2D6A1F",
    borderBottom: "1px solid #B5DDA8",
    icon: "✅",
    text: "Аккаунт подтверждён! Ожидайте первый заказ.",
  },
  suspended: {
    background: "#FDECEA",
    color: "#8B1A1A",
    borderBottom: "1px solid #F5A8A0",
    icon: "⚠️",
    text: "Аккаунт приостановлен. Свяжитесь с поддержкой.",
  },
  terminated: {
    background: "#3D2E1F",
    color: "white",
    borderBottom: "none",
    icon: "🚫",
    text: "Аккаунт закрыт.",
  },
};

export default function VerificationBanner({ status }: Props) {
  if (status === "active") return null;

  const config = BANNER_CONFIG[status];

  return (
    <div
      style={{
        padding: "10px 16px",
        fontSize: 13,
        fontWeight: 500,
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: config.background,
        color: config.color,
        borderBottom: config.borderBottom,
      }}
    >
      <span>{config.icon}</span>
      <span>{config.text}</span>
    </div>
  );
}
