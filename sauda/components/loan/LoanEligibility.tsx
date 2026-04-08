"use client";

import { useState } from "react";

export interface LoanEligibilityProps {
  monthsOnPlatform: number;
  qualityScore: number;
  acceptanceRate: number;
  hasActiveDisputes: boolean;
  hasIIN: boolean;
  onIINSaved: (iin: string) => void;
  onEligible: () => void;
  onClose: () => void;
}

interface Criterion {
  label: string;
  detail: string;
  met: boolean;
}

export default function LoanEligibility({
  monthsOnPlatform,
  qualityScore,
  acceptanceRate,
  hasActiveDisputes,
  hasIIN,
  onIINSaved,
  onEligible,
  onClose,
}: LoanEligibilityProps) {
  const [iin, setIIN] = useState("");
  const [iinError, setIINError] = useState("");
  const [loanConsentAccepted, setLoanConsentAccepted] = useState(false);

  const criteria: Criterion[] = [
    {
      label: "Минимум 3 месяца на платформе",
      detail: `Вы: ${monthsOnPlatform} мес.`,
      met: monthsOnPlatform >= 3,
    },
    {
      label: "Оценка качества ≥ 75%",
      detail: `Ваша оценка: ${Math.round(qualityScore * 100)}%`,
      met: qualityScore >= 0.75,
    },
    {
      label: "Принятие заказов ≥ 60%",
      detail: `Ваш показатель: ${Math.round(acceptanceRate * 100)}%`,
      met: acceptanceRate >= 0.60,
    },
    {
      label: "Нет активных споров",
      detail: hasActiveDisputes ? "Есть активные споры" : "Споров нет",
      met: !hasActiveDisputes,
    },
    {
      label: "ИИН подтверждён",
      detail: hasIIN ? "ИИН на файле" : "ИИН не указан",
      met: hasIIN,
    },
  ];

  const allMetExceptIIN = criteria.slice(0, 4).every((c) => c.met);
  const iinOk = hasIIN || iin.length === 12;
  const allMet = allMetExceptIIN && iinOk && loanConsentAccepted;

  const failedHelpers: { key: number; text: string }[] = [];
  if (!criteria[0].met) failedHelpers.push({ key: 0, text: "Продолжайте работать на платформе." });
  if (!criteria[1].met) failedHelpers.push({ key: 1, text: "Улучшите оценку качества. Нужно: 75+." });
  if (!criteria[2].met) failedHelpers.push({ key: 2, text: "Повысьте процент принятия заказов." });
  if (!criteria[3].met) failedHelpers.push({ key: 3, text: "Разрешите текущие споры через поддержку." });
  if (!criteria[4].met) failedHelpers.push({ key: 4, text: "Введите ИИН выше." });

  function handleIINChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.replace(/\D/g, "").slice(0, 12);
    setIIN(value);
    if (iinError) setIINError("");
  }

  function handleCTAClick() {
    if (!allMet) return;

    if (!hasIIN && iin.length === 12) {
      onIINSaved(iin);
    }
    onEligible();
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          zIndex: 400,
        }}
      />

      {/* Bottom sheet */}
      <div
        className="animate-slide-up"
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: 420,
          background: "white",
          borderRadius: "24px 24px 0 0",
          zIndex: 401,
          maxHeight: "90dvh",
          overflowY: "auto",
          padding: "0 0 32px",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "12px 20px 0",
            position: "sticky",
            top: 0,
            background: "white",
            zIndex: 1,
          }}
        >
          {/* Drag handle */}
          <div
            style={{
              width: 36,
              height: 4,
              borderRadius: 2,
              background: "#EAE4D8",
              marginBottom: 16,
            }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              paddingBottom: 16,
              borderBottom: "1px solid #EAE4D8",
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 600, color: "#3D2E1F" }}>
              Проверка кредитоспособности
            </div>
            <button
              onClick={onClose}
              style={{
                width: 36,
                height: 36,
                minWidth: 48,
                minHeight: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 18,
                color: "#9A9490",
                borderRadius: 8,
                padding: 0,
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "0 20px" }}>
          {/* Criteria list */}
          <div style={{ marginTop: 8 }}>
            {criteria.map((criterion, index) => (
              <div key={index}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 0",
                    borderBottom: "1px solid #EAE4D8",
                  }}
                >
                  <span style={{ fontSize: 20, flexShrink: 0, width: 20, textAlign: "center" }}>
                    {criterion.met ? "✅" : "❌"}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#3D2E1F" }}>
                      {criterion.label}
                    </div>
                    <div style={{ fontSize: 13, color: "#9A9490", marginTop: 2 }}>
                      {criterion.detail}
                    </div>
                  </div>
                </div>

                {/* IIN input section — only for the last criterion when !hasIIN */}
                {index === 4 && !hasIIN && (
                  <div style={{ padding: "12px 0 4px" }}>
                    <div style={{ fontSize: 12, color: "#9A9490", marginBottom: 6 }}>
                      Введите ваш ИИН
                    </div>
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={12}
                      value={iin}
                      onChange={handleIINChange}
                      placeholder="000000000000 (12 цифр)"
                      style={{
                        width: "100%",
                        height: 56,
                        borderRadius: 12,
                        border: `1.5px solid ${iinError ? "#C0392B" : "#EAE4D8"}`,
                        padding: "0 14px",
                        fontSize: 16,
                        color: "#3D2E1F",
                        background: "#FAF7F0",
                        boxSizing: "border-box",
                        outline: "none",
                        fontFamily: "inherit",
                      }}
                    />
                    {iinError && (
                      <div style={{ fontSize: 13, color: "#C0392B", marginTop: 4 }}>
                        {iinError}
                      </div>
                    )}
                    <div style={{ fontSize: 12, color: "#9A9490", marginTop: 8 }}>
                      ИИН нужен для проверки кредитной истории нашим финансовым партнёром
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Loan consent checkbox */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              padding: "12px 0",
            }}
          >
            <button
              onClick={() => setLoanConsentAccepted((v) => !v)}
              style={{
                width: 22,
                height: 22,
                minWidth: 48,
                minHeight: 48,
                flexShrink: 0,
                borderRadius: 6,
                border: `2px solid ${loanConsentAccepted ? "#D4853A" : "#EAE4D8"}`,
                background: loanConsentAccepted ? "#D4853A" : "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: 14,
                color: "white",
                padding: 0,
                marginTop: 1,
              }}
              aria-pressed={loanConsentAccepted}
              aria-label="Согласие на передачу данных"
            >
              {loanConsentAccepted ? "✓" : null}
            </button>
            <div
              style={{
                fontSize: 14,
                color: "#3D2E1F",
                lineHeight: 1.5,
                paddingTop: 2,
              }}
            >
              Я даю согласие на передачу данных о моих продажах финансовому партнёру Zeren для
              оценки кредитоспособности
            </div>
          </div>

          {/* CTA */}
          <div style={{ marginTop: 8 }}>
            <button
              onClick={handleCTAClick}
              disabled={!allMet}
              style={{
                width: "100%",
                height: 56,
                minHeight: 48,
                borderRadius: 14,
                border: "none",
                fontSize: 16,
                fontWeight: 600,
                cursor: allMet ? "pointer" : "default",
                background: allMet ? "#D4853A" : "#C5C0B8",
                color: allMet ? "white" : "#9A9490",
                transition: "background 0.15s",
              }}
            >
              {allMet ? "Перейти к выбору кредита →" : "Условия пока не выполнены"}
            </button>

            {/* Helper texts for failed criteria */}
            {!allMet && failedHelpers.length > 0 && (
              <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 4 }}>
                {failedHelpers.map(({ key, text }) => (
                  <div
                    key={key}
                    style={{
                      fontSize: 13,
                      color: "#9A9490",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 6,
                    }}
                  >
                    <span style={{ color: "#C0392B", flexShrink: 0 }}>·</span>
                    {text}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
