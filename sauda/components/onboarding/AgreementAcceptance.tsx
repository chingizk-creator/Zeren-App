"use client";

import { useState, useEffect } from "react";
import AgreementFullText from "./AgreementFullText";
import { KEY_TERMS } from "@/sauda/data/agreementText";

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

function Checkbox({
  checked,
  onToggle,
}: {
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      onClick={onToggle}
      style={{
        width: 22,
        height: 22,
        minWidth: 22,
        border: checked ? "2px solid #D4853A" : "2px solid #EAE4D8",
        borderRadius: 6,
        background: checked ? "#D4853A" : "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "background 200ms ease, border-color 200ms ease",
        flexShrink: 0,
      }}
      role="checkbox"
      aria-checked={checked}
    >
      {checked && (
        <span
          style={{
            color: "white",
            fontSize: 14,
            fontWeight: 700,
            lineHeight: 1,
            fontFamily: "inherit",
          }}
        >
          ✓
        </span>
      )}
    </div>
  );
}

export default function AgreementAcceptance({ data, onUpdate, onNext, onBack }: StepProps) {
  const [showFullAgreement, setShowFullAgreement] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(data.agreement.termsAccepted);
  const [dataConsentAccepted, setDataConsentAccepted] = useState(data.agreement.dataConsentAccepted);
  const [signature, setSignature] = useState(data.agreement.digitalSignature || "");

  useEffect(() => {
    if (!signature && data.profile.name) {
      setSignature(data.profile.name);
    }
  }, [data.profile.name]);

  const canProceed = termsAccepted && dataConsentAccepted && signature.trim().length >= 2;

  function handleAccept() {
    if (!canProceed) return;
    onUpdate({
      agreement: {
        termsAccepted: true,
        dataConsentAccepted: true,
        digitalSignature: signature,
        acceptedAt: new Date().toISOString(),
      },
    });
    onNext();
  }

  return (
    <>
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
        <div style={{ marginBottom: 20 }}>
          <h1
            style={{
              fontSize: 22,
              fontWeight: "bold",
              color: "#3D2E1F",
              margin: 0,
              fontFamily: "inherit",
            }}
          >
            Договор поставщика
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "#9A9490",
              margin: "6px 0 0",
              fontFamily: "inherit",
            }}
          >
            Пожалуйста, ознакомьтесь с условиями
          </p>
        </div>

        {/* Summary card */}
        <div
          style={{
            background: "white",
            border: "1px solid #EAE4D8",
            borderRadius: 16,
            padding: 20,
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            marginBottom: 20,
          }}
        >
          {KEY_TERMS.map((term, index) => (
            <div key={index}>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#3D2E1F",
                  margin: 0,
                  fontFamily: "inherit",
                }}
              >
                {term.title}
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "#9A9490",
                  margin: "2px 0 0",
                  fontFamily: "inherit",
                  lineHeight: 1.5,
                }}
              >
                {term.body}
              </p>
              {index < KEY_TERMS.length - 1 && (
                <div
                  style={{
                    height: 1,
                    background: "#EAE4D8",
                    margin: "12px 0",
                  }}
                />
              )}
            </div>
          ))}

          <div style={{ marginTop: 16 }}>
            <span
              onClick={() => setShowFullAgreement(true)}
              style={{
                fontSize: 14,
                color: "#9A9490",
                cursor: "pointer",
                textDecoration: "underline",
                fontFamily: "inherit",
              }}
            >
              Читать полный текст договора →
            </span>
          </div>
        </div>

        {/* Checkbox 1 — Terms */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            minHeight: 48,
            cursor: "pointer",
          }}
          onClick={() => setTermsAccepted((v) => !v)}
        >
          <div style={{ paddingTop: 2 }}>
            <Checkbox checked={termsAccepted} onToggle={() => setTermsAccepted((v) => !v)} />
          </div>
          <p
            style={{
              fontSize: 14,
              color: "#3D2E1F",
              margin: 0,
              flex: 1,
              fontFamily: "inherit",
              lineHeight: 1.5,
            }}
          >
            Я принимаю условия{" "}
            <strong
              onClick={(e) => {
                e.stopPropagation();
                setShowFullAgreement(true);
              }}
              style={{
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Договора поставщика Zeren
            </strong>{" "}
            (нажмите, чтобы прочитать)
          </p>
        </div>

        <div style={{ height: 16 }} />

        {/* Checkbox 2 — Data consent */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            minHeight: 48,
            cursor: "pointer",
          }}
          onClick={() => setDataConsentAccepted((v) => !v)}
        >
          <div style={{ paddingTop: 2 }}>
            <Checkbox
              checked={dataConsentAccepted}
              onToggle={() => setDataConsentAccepted((v) => !v)}
            />
          </div>
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontSize: 14,
                color: "#3D2E1F",
                margin: 0,
                fontFamily: "inherit",
                lineHeight: 1.5,
              }}
            >
              Я даю согласие на сбор и обработку персональных данных в соответствии с Законом РК №94-V
            </p>
            <p
              style={{
                fontSize: 12,
                color: "#9A9490",
                margin: "6px 0 0",
                fontFamily: "inherit",
                lineHeight: 1.5,
              }}
            >
              Собираемые данные: имя, телефон, платёжные реквизиты, история транзакций. Используются для: работы платформы, аналитики, услуг финансовых партнёров.
            </p>
          </div>
        </div>

        <div style={{ height: 20 }} />

        {/* Digital signature */}
        <div>
          <label
            style={{
              fontSize: 12,
              color: "#9A9490",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              fontWeight: 500,
              display: "block",
              marginBottom: 6,
              fontFamily: "inherit",
            }}
          >
            Ваша электронная подпись
          </label>
          <input
            type="text"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            placeholder="Введите ваше полное имя"
            style={{
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
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#D4853A";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#EAE4D8";
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
            Ввод имени подтверждает ваше согласие с договором
          </p>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* CTA */}
        <div style={{ marginTop: 24 }}>
          <button
            disabled={!canProceed}
            onClick={handleAccept}
            style={{
              height: 56,
              width: "100%",
              backgroundColor: canProceed ? "#D4853A" : "#C5C0B8",
              color: "white",
              border: "none",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 600,
              fontFamily: "inherit",
              cursor: canProceed ? "pointer" : "not-allowed",
              transition: "background-color 200ms ease",
            }}
          >
            Принять и завершить регистрацию
          </button>
        </div>
      </div>

      {/* Full agreement bottom sheet */}
      <AgreementFullText
        show={showFullAgreement}
        onClose={() => setShowFullAgreement(false)}
      />
    </>
  );
}
