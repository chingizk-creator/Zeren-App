"use client";

interface Props {
  reason?: string;
  onContactSupport: () => void;
}

export default function SuspensionOverlay({ reason, onContactSupport }: Props) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(192,57,43,0.92)",
        zIndex: 500,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 56 }}>⚠️</div>

      <div
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: "white",
          marginTop: 20,
        }}
      >
        Аккаунт приостановлен
      </div>

      <div
        style={{
          fontSize: 15,
          color: "rgba(255,255,255,0.85)",
          marginTop: 12,
          lineHeight: 1.6,
        }}
      >
        {reason || "Ваш аккаунт временно приостановлен из-за проблем с качеством."}
      </div>

      <div
        style={{
          fontSize: 14,
          color: "rgba(255,255,255,0.7)",
          marginTop: 8,
        }}
      >
        Аналитика и история выплат по-прежнему доступны.
      </div>

      <button
        onClick={onContactSupport}
        style={{
          marginTop: 32,
          background: "white",
          color: "#C0392B",
          border: "none",
          borderRadius: 12,
          padding: "0 32px",
          height: 56,
          fontSize: 16,
          fontWeight: 600,
          cursor: "pointer",
          width: "100%",
          maxWidth: 320,
        }}
      >
        Написать в поддержку
      </button>

      <div
        style={{
          fontSize: 12,
          color: "rgba(255,255,255,0.6)",
          marginTop: 16,
        }}
      >
        Действующие выплаты продолжают обрабатываться в обычном режиме.
      </div>
    </div>
  );
}
