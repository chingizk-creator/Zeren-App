"use client";

import type { VendorStatus } from "@/sauda/context/OnboardingContext";

interface AdminPanelProps {
  show: boolean;
  currentStatus: VendorStatus;
  onStatusChange: (s: VendorStatus) => void;
  onClose: () => void;
}

const STATUS_OPTIONS: { value: VendorStatus; label: string }[] = [
  { value: "registered", label: "В ожидании проверки" },
  { value: "verified",   label: "Подтверждён" },
  { value: "active",     label: "Активный" },
  { value: "suspended",  label: "Приостановлен" },
  { value: "terminated", label: "Закрыт" },
];

export default function AdminPanel({ show, currentStatus, onStatusChange, onClose }: AdminPanelProps) {
  if (!show) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          zIndex: 800,
        }}
      />

      {/* Sheet */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          maxWidth: 420,
          margin: "0 auto",
          background: "white",
          borderRadius: "20px 20px 0 0",
          padding: "20px 20px 40px",
          zIndex: 801,
          animation: "slideUp 0.25s ease-out",
        }}
      >
        {/* Drag handle */}
        <div
          style={{
            width: 36,
            height: 4,
            background: "#EAE4D8",
            borderRadius: 2,
            margin: "0 auto 16px",
          }}
        />

        {/* Header row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#3D2E1F" }}>
            🔧 Панель администратора
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: 20,
              color: "#9A9490",
              cursor: "pointer",
              padding: 0,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* Status label */}
        <div style={{ fontSize: 12, color: "#9A9490", marginBottom: 8 }}>
          Статус аккаунта
        </div>

        {/* Status options */}
        {STATUS_OPTIONS.map(({ value, label }) => {
          const isCurrent = value === currentStatus;
          return (
            <div
              key={value}
              onClick={() => { onStatusChange(value); onClose(); }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                height: 48,
                padding: "0 4px",
                borderBottom: "1px solid #EAE4D8",
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  color: isCurrent ? "#D4853A" : "#3D2E1F",
                  fontWeight: isCurrent ? 700 : 400,
                }}
              >
                {label}
              </span>
              {isCurrent && (
                <span style={{ fontSize: 16, color: "#D4853A" }}>✓</span>
              )}
            </div>
          );
        })}

        {/* Footer note */}
        <div style={{ fontSize: 11, color: "#9A9490", marginTop: 16, textAlign: "center" }}>
          Имитирует верификацию полевым представителем
        </div>
      </div>
    </>
  );
}
