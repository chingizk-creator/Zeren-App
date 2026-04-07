"use client";

interface HeaderProps {
  showBack?: boolean;
  onBack?: () => void;
  title?: string;
}

export default function Header({ showBack, onBack, title }: HeaderProps) {
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
      {showBack ? (
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            color: "#C8A96E",
            fontSize: 20,
            cursor: "pointer",
            padding: "0 8px 0 0",
            display: "flex",
            alignItems: "center",
          }}
          aria-label="Назад"
        >
          ←
        </button>
      ) : (
        <div style={{ width: 32 }} />
      )}

      {title ? (
        <span
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "#C8A96E",
            fontFamily: "Georgia, serif",
          }}
        >
          {title}
        </span>
      ) : (
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 15,
              fontWeight: 700,
              color: "#C8A96E",
              letterSpacing: "2px",
            }}
          >
            ZEREN
          </div>
          <div style={{ fontSize: 9, color: "#E8D5A8", letterSpacing: "0.5px", marginTop: 1 }}>
            📍 Алматы
          </div>
        </div>
      )}

      <div style={{ width: 32 }} />
    </header>
  );
}
