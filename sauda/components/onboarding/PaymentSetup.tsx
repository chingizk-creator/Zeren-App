"use client";

import { useState } from "react";

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
  fontSize: 16,
  fontFamily: "inherit",
  outline: "none",
  width: "100%",
  color: "#3D2E1F",
  background: "white",
  boxSizing: "border-box",
};

export default function PaymentSetup({ data, onUpdate, onNext, onBack }: StepProps) {
  const method = data.payment.method;

  const [kaspiPhone, setKaspiPhone] = useState(
    data.payment.kaspiPhone || data.phone || ""
  );
  const [bankIBAN, setBankIBAN] = useState(data.payment.bankIBAN || "");
  const [kaspiPhoneFocused, setKaspiPhoneFocused] = useState(false);
  const [ibanFocused, setIbanFocused] = useState(false);

  function selectMethod(m: "kaspi" | "bank") {
    onUpdate({ payment: { ...data.payment, method: m } });
  }

  function handleKaspiPhoneChange(val: string) {
    const digits = val.replace(/\D/g, "").slice(0, 10);
    setKaspiPhone(digits);
    onUpdate({ payment: { ...data.payment, kaspiPhone: digits } });
  }

  function handleIBANChange(val: string) {
    const upper = val.toUpperCase().slice(0, 20);
    setBankIBAN(upper);
    onUpdate({ payment: { ...data.payment, bankIBAN: upper } });
  }

  const kaspiValid = kaspiPhone.replace(/\D/g, "").length === 10;
  const bankValid = bankIBAN.length >= 20 && bankIBAN.startsWith("KZ");
  const canProceed = method === "kaspi" ? kaspiValid : bankValid;

  function cardStyle(selected: boolean): React.CSSProperties {
    return {
      border: selected ? "2px solid #D4853A" : "1.5px solid #EAE4D8",
      background: selected ? "rgba(212,133,58,0.05)" : "white",
      borderRadius: 16,
      padding: 16,
      cursor: "pointer",
      width: "100%",
      boxSizing: "border-box",
      transition: "border-color 200ms ease, background 200ms ease",
    };
  }

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
        onClick={onBack}
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

      {/* Heading */}
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontSize: 22,
            fontWeight: "bold",
            color: "#3D2E1F",
            margin: 0,
            fontFamily: "inherit",
          }}
        >
          Куда отправлять выплаты?
        </h1>
        <p
          style={{
            fontSize: 14,
            color: "#9A9490",
            margin: "6px 0 0",
            fontFamily: "inherit",
          }}
        >
          Мы платим еженедельно — каждую среду
        </p>
      </div>

      {/* Method cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Kaspi card */}
        <div style={cardStyle(method === "kaspi")} onClick={() => selectMethod("kaspi")}>
          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "#3D2E1F",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              gap: 8,
              minHeight: 28,
            }}
          >
            💳 Kaspi перевод
          </div>

          {method === "kaspi" && (
            <div
              style={{ marginTop: 16 }}
              onClick={(e) => e.stopPropagation()}
            >
              <label
                style={{
                  fontSize: 12,
                  color: "#9A9490",
                  display: "block",
                  marginBottom: 6,
                  fontFamily: "inherit",
                }}
              >
                Номер Kaspi
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
                  +7{" "}
                </span>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={kaspiPhone}
                  onChange={(e) => handleKaspiPhoneChange(e.target.value)}
                  onFocus={() => setKaspiPhoneFocused(true)}
                  onBlur={() => setKaspiPhoneFocused(false)}
                  placeholder="700 123 45 67"
                  style={{
                    ...inputBaseStyle,
                    paddingLeft: 48,
                    paddingRight: 16,
                    borderColor: kaspiPhoneFocused ? "#D4853A" : "#EAE4D8",
                  }}
                />
              </div>
              <p
                style={{
                  fontSize: 12,
                  color: "#9A9490",
                  margin: "6px 0 0",
                  fontFamily: "inherit",
                }}
              >
                Выплаты поступят на этот Kaspi аккаунт
              </p>
            </div>
          )}
        </div>

        {/* Bank card */}
        <div style={cardStyle(method === "bank")} onClick={() => selectMethod("bank")}>
          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "#3D2E1F",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              gap: 8,
              minHeight: 28,
            }}
          >
            🏦 Банковский перевод
          </div>

          {method === "bank" && (
            <div
              style={{ marginTop: 16 }}
              onClick={(e) => e.stopPropagation()}
            >
              <label
                style={{
                  fontSize: 12,
                  color: "#9A9490",
                  display: "block",
                  marginBottom: 6,
                  fontFamily: "inherit",
                }}
              >
                IBAN счёта
              </label>
              <input
                type="text"
                maxLength={20}
                value={bankIBAN}
                onChange={(e) => handleIBANChange(e.target.value)}
                onFocus={() => setIbanFocused(true)}
                onBlur={() => setIbanFocused(false)}
                placeholder="KZ + 18 цифр"
                style={{
                  ...inputBaseStyle,
                  padding: "0 16px",
                  borderColor: ibanFocused ? "#D4853A" : "#EAE4D8",
                }}
              />
              <p
                style={{
                  fontSize: 12,
                  color: "#9A9490",
                  margin: "6px 0 0",
                  fontFamily: "inherit",
                }}
              >
                Формат: KZ + 18 цифр
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Info box */}
      <div
        style={{
          marginTop: 16,
          background: "#FAF7F0",
          borderLeft: "3px solid #3D2E1F",
          padding: "12px 16px",
          borderRadius: 8,
          fontSize: 14,
          color: "#3D2E1F",
          fontFamily: "inherit",
          lineHeight: 1.5,
        }}
      >
        💰 Стандартная выплата — каждую среду. Мгновенная выплата доступна с комиссией 0.5%.
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* CTA */}
      <div style={{ marginTop: 24 }}>
        <button
          disabled={!canProceed}
          onClick={() => {
            if (!canProceed) return;
            onUpdate({
              payment: {
                ...data.payment,
                kaspiPhone,
                bankIBAN,
              },
            });
            onNext();
          }}
          style={{
            height: 56,
            width: "100%",
            backgroundColor: canProceed ? "#D4853A" : "#EAE4D8",
            color: canProceed ? "white" : "#9A9490",
            border: "none",
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 600,
            fontFamily: "inherit",
            cursor: canProceed ? "pointer" : "not-allowed",
            transition: "background-color 200ms ease",
          }}
        >
          Далее →
        </button>
      </div>
    </div>
  );
}
