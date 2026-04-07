"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";

export default function PhoneEntry() {
  const { setPendingPhone, setAuthStep, closeAuth, authState } = useAuth();
  const [digits, setDigits] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus with small delay for slide-up animation
    const t = setTimeout(() => inputRef.current?.focus(), 350);
    return () => clearTimeout(t);
  }, []);

  // Format: 7XX XXX XX XX
  const formatted = formatPhone(digits);
  const isReady = digits.length === 10;

  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 10);
    setDigits(raw);
    setError("");
  }, []);

  const handleSubmit = useCallback(() => {
    if (!isReady) {
      setError("Введите 10 цифр");
      return;
    }
    setPendingPhone(digits);
    setAuthStep("code");
  }, [isReady, digits, setPendingPhone, setAuthStep]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isReady) handleSubmit();
  }, [isReady, handleSubmit]);

  return (
    <>
      <div className="bottom-sheet-overlay" onClick={closeAuth} aria-hidden="true" />
      <div
        className="bottom-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Вход в Zeren"
      >
        <div className="drag-handle" />

        {/* Close button */}
        <button
          onClick={closeAuth}
          aria-label="Закрыть"
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "none",
            border: "none",
            fontSize: 20,
            color: "#9A9490",
            cursor: "pointer",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            minHeight: "unset",
            minWidth: "unset",
          }}
        >
          ×
        </button>

        <div style={{ padding: "20px 24px 36px", textAlign: "center" }}>
          {/* Icon */}
          <div style={{ fontSize: 48, marginBottom: 14, lineHeight: 1 }} aria-hidden="true">
            🦌
          </div>

          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#3D2E1F", marginBottom: 6 }}>
            Войти в Zeren
          </h2>
          <p style={{ fontSize: 13, color: "#9A9490", marginBottom: 24 }}>
            Введите номер телефона
          </p>

          {/* Phone input */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "white",
              border: `1.5px solid ${error ? "#C0392B" : digits.length > 0 ? "#D4853A" : "#EAE4D8"}`,
              borderRadius: 12,
              padding: "0 16px",
              marginBottom: error ? 6 : 20,
              transition: "border-color 0.15s",
            }}
          >
            <span
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "#3D2E1F",
                letterSpacing: 1,
                paddingRight: 8,
                borderRight: "1.5px solid #EAE4D8",
                marginRight: 10,
                userSelect: "none",
                flexShrink: 0,
                lineHeight: "56px",
              }}
            >
              +7
            </span>
            <input
              ref={inputRef}
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              value={formatted}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="7XX XXX XX XX"
              aria-label="Номер телефона"
              aria-invalid={!!error}
              aria-describedby={error ? "phone-error" : undefined}
              style={{
                flex: 1,
                border: "none",
                background: "transparent",
                fontSize: 18,
                fontWeight: 600,
                color: "#3D2E1F",
                letterSpacing: 1,
                outline: "none",
                fontFamily: "inherit",
                height: 56,
                minWidth: 0,
              }}
            />
          </div>

          {error && (
            <p
              id="phone-error"
              role="alert"
              style={{ fontSize: 12, color: "#C0392B", marginBottom: 14, textAlign: "left" }}
            >
              {error}
            </p>
          )}

          <button
            className="btn-primary"
            style={{
              width: "100%",
              height: 50,
              fontSize: 15,
              borderRadius: 14,
              opacity: isReady ? 1 : 0.45,
              marginBottom: 14,
            }}
            onClick={handleSubmit}
            disabled={!isReady}
            aria-disabled={!isReady}
          >
            Получить код
          </button>

          <p style={{ fontSize: 9, color: "#C5C0B8", lineHeight: 1.5 }}>
            Нажимая кнопку, вы соглашаетесь с условиями сервиса
          </p>
        </div>
      </div>
    </>
  );
}

// Format 10 raw digits as: 7XX XXX XX XX
function formatPhone(digits: string): string {
  if (!digits) return "";
  const d = digits.slice(0, 10);
  let out = "";
  for (let i = 0; i < d.length; i++) {
    if (i === 3 || i === 6 || i === 8) out += " ";
    out += d[i];
  }
  return out;
}
