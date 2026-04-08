"use client";

import { useState, useEffect, useRef } from "react";

interface OnboardingData {
  phone: string;
  smsVerified: boolean;
  profile: { name: string; stallNumber: string; stallPhoto: string | null; bazaar: string; city: string };
  products: { categories: string[]; prices: Record<string, number> };
  payment: { method: "kaspi" | "bank"; kaspiPhone: string; bankIBAN: string };
  agreement: { termsAccepted: boolean; dataConsentAccepted: boolean; digitalSignature: string; acceptedAt: string | null };
  tutorialCompleted: boolean;
}

interface StepProps {
  data: OnboardingData;
  onUpdate: (partial: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack?: () => void;
}

const inputBaseStyle: React.CSSProperties = {
  border: "1.5px solid #EAE4D8",
  borderRadius: 12,
  height: 56,
  padding: "0 16px",
  fontSize: 16,
  fontFamily: "inherit",
  outline: "none",
  width: "100%",
  color: "#3D2E1F",
  background: "white",
  boxSizing: "border-box",
};

export default function PhoneVerification({ data, onUpdate, onNext, onBack }: StepProps) {
  const [phase, setPhase] = useState<"phone" | "code">("phone");
  const [phoneRaw, setPhoneRaw] = useState(data.phone || "");
  const [code, setCode] = useState<string[]>(["", "", "", ""]);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);

  const codeRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const id = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(id);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [countdown]);

  // Auto-submit when all 4 digits filled
  useEffect(() => {
    const joined = code.join("");
    if (joined.length !== 4) return;
    if (joined === "1234") {
      setLoading(true);
      setTimeout(() => {
        onUpdate({ phone: phoneRaw, smsVerified: true });
        onNext();
        setLoading(false);
      }, 400);
    } else {
      setError("Неверный код. Попробуйте ещё раз.");
    }
  }, [code]);

  function handleSendSMS() {
    if (phoneRaw.length !== 10) return;
    setPhase("code");
    setCountdown(60);
    setError("");
    setCode(["", "", "", ""]);
    setTimeout(() => codeRefs[0].current?.focus(), 100);
  }

  function handleCodeChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);
    setError("");

    if (digit && index < 3) {
      codeRefs[index + 1].current?.focus();
    }
  }

  function handleCodeKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (code[index] === "" && index > 0) {
        const newCode = [...code];
        newCode[index - 1] = "";
        setCode(newCode);
        codeRefs[index - 1].current?.focus();
      } else {
        const newCode = [...code];
        newCode[index] = "";
        setCode(newCode);
      }
      setError("");
    }
  }

  function maskPhone(raw: string) {
    const part1 = raw.slice(0, 3);
    const part2 = raw.slice(3, 6);
    const part3 = raw.slice(6, 8);
    const part4 = raw.slice(8, 10);
    let result = "+7";
    if (part1) result += " " + part1;
    if (part2) result += " " + part2;
    if (part3) result += " " + part3;
    if (part4) result += " " + part4;
    return result;
  }

  if (phase === "phone") {
    return (
      <div
        style={{
          minHeight: "100dvh",
          background: "#FAF7F0",
          padding: 24,
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
        }}
      >
        {/* Header branding */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            paddingBottom: 32,
          }}
        >
          <div style={{ fontSize: 48, lineHeight: 1 }}>🦌</div>
          <div style={{ fontSize: 14, color: "#9A9490", textAlign: "center", marginTop: 8 }}>
            Добро пожаловать в
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: "#3D2E1F",
              textAlign: "center",
              fontFamily: "Georgia, serif",
            }}
          >
            Zeren Sauda
          </div>
          <div style={{ fontSize: 14, color: "#9A9490", textAlign: "center" }}>
            Регистрация займёт 5 минут
          </div>
        </div>

        {/* Phone input area */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <label
            style={{
              fontSize: 12,
              color: "#9A9490",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              fontWeight: 500,
            }}
          >
            Номер телефона
          </label>

          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <span
              style={{
                position: "absolute",
                left: 16,
                fontSize: 16,
                color: "#3D2E1F",
                pointerEvents: "none",
                zIndex: 1,
                userSelect: "none",
              }}
            >
              +7
            </span>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={phoneRaw}
              onChange={(e) => setPhoneRaw(e.target.value.replace(/\D/g, "").slice(0, 10))}
              onFocus={() => setPhoneFocused(true)}
              onBlur={() => setPhoneFocused(false)}
              placeholder="700 123 45 67"
              style={{
                ...inputBaseStyle,
                paddingLeft: 44,
                borderColor: phoneFocused ? "#D4853A" : "#EAE4D8",
              }}
            />
          </div>

          <div style={{ height: 16 }} />

          <button
            disabled={phoneRaw.length !== 10}
            onClick={handleSendSMS}
            style={{
              height: 56,
              width: "100%",
              backgroundColor: phoneRaw.length === 10 ? "#D4853A" : "#EAE4D8",
              color: phoneRaw.length === 10 ? "white" : "#9A9490",
              border: "none",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 600,
              fontFamily: "inherit",
              cursor: phoneRaw.length === 10 ? "pointer" : "not-allowed",
              transition: "background-color 200ms ease",
            }}
          >
            Получить SMS код
          </button>
        </div>

        <div style={{ height: 32 }} />
      </div>
    );
  }

  // Phase: "code"
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#FAF7F0",
        padding: 24,
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
      }}
    >
      {/* Back button */}
      <button
        onClick={() => {
          setPhase("phone");
          setCode(["", "", "", ""]);
          setError("");
        }}
        style={{
          background: "none",
          border: "none",
          fontSize: 14,
          color: "#9A9490",
          cursor: "pointer",
          padding: "8px 0",
          alignSelf: "flex-start",
          fontFamily: "inherit",
          minHeight: 48,
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        ← Назад
      </button>

      {/* Center content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
        }}
      >
        <div style={{ fontSize: 14, color: "#9A9490", textAlign: "center" }}>
          Код отправлен на
        </div>
        <div
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: "#3D2E1F",
            textAlign: "center",
            marginTop: 4,
          }}
        >
          {maskPhone(phoneRaw)}
        </div>

        <div style={{ height: 24 }} />

        {/* 4 code boxes */}
        <div style={{ display: "flex", gap: 12 }}>
          {code.map((digit, i) => (
            <div key={i} style={{ position: "relative" }}>
              <input
                ref={codeRefs[i]}
                type="tel"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(i, e.target.value)}
                onKeyDown={(e) => handleCodeKeyDown(i, e)}
                disabled={loading}
                style={{
                  width: 64,
                  height: 64,
                  border: `2px solid ${digit ? "#D4853A" : "#EAE4D8"}`,
                  borderRadius: 12,
                  fontSize: 28,
                  fontWeight: "bold",
                  color: "#3D2E1F",
                  textAlign: "center",
                  background: "white",
                  fontFamily: "inherit",
                  outline: "none",
                  boxSizing: "border-box",
                  caretColor: "#D4853A",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#D4853A";
                }}
                onBlur={(e) => {
                  if (!code[i]) e.currentTarget.style.borderColor = "#EAE4D8";
                }}
              />
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              marginTop: 16,
              fontSize: 14,
              color: "#C0392B",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        <div style={{ height: 16 }} />

        {/* Resend */}
        {countdown > 0 ? (
          <div style={{ fontSize: 14, color: "#9A9490", textAlign: "center" }}>
            Отправить повторно через {countdown} с
          </div>
        ) : (
          <button
            onClick={() => {
              setCountdown(60);
              setCode(["", "", "", ""]);
              setError("");
              setTimeout(() => codeRefs[0].current?.focus(), 50);
            }}
            style={{
              background: "none",
              border: "none",
              fontSize: 14,
              color: "#D4853A",
              cursor: "pointer",
              fontFamily: "inherit",
              minHeight: 48,
              display: "flex",
              alignItems: "center",
            }}
          >
            Отправить повторно
          </button>
        )}
      </div>
    </div>
  );
}
