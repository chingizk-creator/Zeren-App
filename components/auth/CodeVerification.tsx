"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";

const CODE_LENGTH = 4;
const RESEND_SECONDS = 30;

export default function CodeVerification() {
  const { authState, verifyCode, setAuthStep, closeAuth } = useAuth();
  const { pendingPhone, isVerifying } = authState;
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [poppedIdx, setPoppedIdx] = useState<number | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const displayPhone = formatDisplayPhone(pendingPhone);

  // Auto-focus first box
  useEffect(() => {
    const t = setTimeout(() => inputRefs.current[0]?.focus(), 100);
    return () => clearTimeout(t);
  }, []);

  // Resend countdown
  useEffect(() => {
    if (countdown <= 0) return;
    const id = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [countdown]);

  // Auto-submit when all 4 digits filled
  useEffect(() => {
    if (digits.every((d) => d !== "") && !isVerifying) {
      verifyCode();
    }
  }, [digits, isVerifying, verifyCode]);

  const handleKey = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
      if (e.key === "Backspace") {
        e.preventDefault();
        const newDigits = [...digits];
        if (digits[idx]) {
          newDigits[idx] = "";
          setDigits(newDigits);
        } else if (idx > 0) {
          newDigits[idx - 1] = "";
          setDigits(newDigits);
          inputRefs.current[idx - 1]?.focus();
        }
        return;
      }
      if (e.key.length === 1 && /\d/.test(e.key)) {
        e.preventDefault();
        const newDigits = [...digits];
        newDigits[idx] = e.key;
        setDigits(newDigits);
        // Pop animation
        setPoppedIdx(idx);
        setTimeout(() => setPoppedIdx(null), 150);
        // Advance focus
        if (idx < CODE_LENGTH - 1) {
          inputRefs.current[idx + 1]?.focus();
        }
      }
    },
    [digits]
  );

  // Handle paste
  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
      if (!text) return;
      const newDigits = [...digits];
      for (let i = 0; i < text.length; i++) newDigits[i] = text[i];
      setDigits(newDigits);
      const focusIdx = Math.min(text.length, CODE_LENGTH - 1);
      inputRefs.current[focusIdx]?.focus();
    },
    [digits]
  );

  const handleResend = useCallback(() => {
    if (countdown > 0) return;
    setDigits(Array(CODE_LENGTH).fill(""));
    setCountdown(RESEND_SECONDS);
    inputRefs.current[0]?.focus();
  }, [countdown]);

  return (
    <>
      <div className="bottom-sheet-overlay" onClick={closeAuth} aria-hidden="true" />
      <div
        className="bottom-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Подтверждение кода"
      >
        <div className="drag-handle" />

        {/* Back button */}
        <button
          onClick={() => setAuthStep("phone")}
          aria-label="Назад"
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            background: "none",
            border: "none",
            fontSize: 20,
            color: "#9A9490",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            minHeight: "unset",
            minWidth: "unset",
          }}
        >
          ←
        </button>

        <div style={{ padding: "20px 24px 36px", textAlign: "center" }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#3D2E1F", marginBottom: 6 }}>
            Код подтверждения
          </h2>
          <p style={{ fontSize: 13, color: "#9A9490", marginBottom: 28 }}>
            Отправлен на +7 {displayPhone}
          </p>

          {/* 4-digit code boxes */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 12,
              marginBottom: 28,
            }}
            role="group"
            aria-label="Введите 4-значный код"
          >
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => { inputRefs.current[idx] = el; }}
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={() => {}} // handled via onKeyDown
                onKeyDown={(e) => handleKey(e, idx)}
                onPaste={handlePaste}
                onClick={() => inputRefs.current[idx]?.select()}
                aria-label={`Цифра ${idx + 1}`}
                disabled={isVerifying}
                style={{
                  width: 52,
                  height: 56,
                  borderRadius: 14,
                  border: `2px solid ${digit ? "#D4853A" : document.activeElement === inputRefs.current[idx] ? "#D4853A" : "#EAE4D8"}`,
                  background: "white",
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#3D2E1F",
                  textAlign: "center",
                  outline: "none",
                  fontFamily: "inherit",
                  cursor: "text",
                  transition: "border-color 0.15s, transform 0.15s",
                  transform: poppedIdx === idx ? "scale(1.12)" : "scale(1)",
                  boxShadow: digit ? "0 2px 8px rgba(212,133,58,0.15)" : "none",
                }}
              />
            ))}
          </div>

          {/* Loading state */}
          {isVerifying ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                height: 32,
                marginBottom: 8,
              }}
              aria-live="polite"
              aria-label="Проверяем код..."
            >
              <SpinnerIcon />
              <span style={{ fontSize: 13, color: "#9A9490" }}>Проверяем...</span>
            </div>
          ) : (
            <button
              onClick={handleResend}
              disabled={countdown > 0}
              style={{
                background: "none",
                border: "none",
                fontSize: 12,
                color: countdown > 0 ? "#9A9490" : "#D4853A",
                cursor: countdown > 0 ? "default" : "pointer",
                fontFamily: "inherit",
                fontWeight: 500,
                minHeight: "unset",
                minWidth: "unset",
                padding: "4px 8px",
              }}
              aria-label={countdown > 0 ? `Повторная отправка через ${countdown} секунд` : "Отправить код повторно"}
            >
              {countdown > 0
                ? `Повторно через 0:${String(countdown).padStart(2, "0")}`
                : "Отправить повторно"}
            </button>
          )}
        </div>
      </div>
    </>
  );
}

function formatDisplayPhone(raw: string): string {
  // raw = "7001234567" (10 digits) → "7XX XXX XX XX"
  if (!raw || raw.length < 10) return raw;
  const d = raw;
  return `${d.slice(0,3)} ${d.slice(3,6)} ${d.slice(6,8)} ${d.slice(8,10)}`;
}

function SpinnerIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      style={{ animation: "glow-ring-spin 0.8s linear infinite" }}
      aria-hidden="true"
    >
      <circle cx="9" cy="9" r="7" stroke="#EAE4D8" strokeWidth="2.5" />
      <path
        d="M9 2a7 7 0 0 1 7 7"
        stroke="#D4853A"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
