"use client";

import { useState, useCallback } from "react";
import { useSauda } from "@/sauda/context/SaudaContext";
import {
  formatPrice, formatPriceFull,
  MOCK_FORECAST, LOAN_OPTIONS,
  CONFIDENCE_LABELS, CONFIDENCE_COLORS, TREND_ICONS,
  type Settlement, type LoanOption,
} from "@/sauda/data/mock";
import LoanEligibility from "@/sauda/components/loan/LoanEligibility";
import { useOnboarding } from "@/sauda/context/OnboardingContext";

// ─── LoanModal ────────────────────────────────────────────────────────────────

function LoanModal({
  onClose,
  onApply,
}: {
  onClose: () => void;
  onApply: (amount: number, monthlyPayment: number) => void;
}) {
  const [selectedOption, setSelectedOption] = useState<number>(1);

  const handleApply = useCallback(() => {
    const opt = LOAN_OPTIONS[selectedOption];
    onApply(opt.amount, opt.monthlyPayment);
    onClose();
  }, [selectedOption, onApply, onClose]);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          zIndex: 600,
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
          zIndex: 601,
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

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 20,
            right: 20,
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

        {/* Title */}
        <div style={{ fontSize: 18, fontWeight: 700, color: "#3D2E1F", marginBottom: 4 }}>
          Выберите сумму кредита
        </div>
        <div style={{ fontSize: 12, color: "#9A9490", marginBottom: 20 }}>
          Автоматическое погашение с выплат
        </div>

        {/* Options */}
        {LOAN_OPTIONS.map((opt: LoanOption, idx: number) => {
          const isSelected = idx === selectedOption;
          return (
            <div
              key={idx}
              onClick={() => setSelectedOption(idx)}
              style={{
                background: isSelected ? "#FAF7F0" : "white",
                border: isSelected ? "2px solid #D4853A" : "1px solid #EAE4D8",
                borderRadius: 14,
                padding: 14,
                marginBottom: 10,
                cursor: "pointer",
              }}
            >
              {/* Top row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span
                  style={{
                    fontFamily: "Georgia, serif",
                    fontSize: 22,
                    fontWeight: 700,
                    color: isSelected ? "#D4853A" : "#3D2E1F",
                  }}
                >
                  ₸{opt.amount / 1000}K
                </span>
                <span style={{ fontSize: 12, color: "#9A9490" }}>
                  {opt.termMonths} мес.
                </span>
              </div>

              {/* Feature row */}
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  marginTop: 6,
                  flexWrap: "wrap",
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 700, color: "#3D2E1F" }}>
                  ₸{opt.monthlyPayment / 1000}K/мес
                </span>
                <span style={{ fontSize: 12, color: "#9A9490" }}>
                  {opt.interestRate}% год.
                </span>
                <span style={{ fontSize: 12, color: "#9A9490" }}>
                  {opt.autoDeductPercent}% автосписание
                </span>
              </div>
            </div>
          );
        })}

        {/* Confirm button */}
        <button
          onClick={handleApply}
          style={{
            background: "#D4853A",
            color: "white",
            width: "100%",
            height: 52,
            borderRadius: 14,
            fontSize: 15,
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
            marginTop: 4,
          }}
        >
          Получить ₸{LOAN_OPTIONS[selectedOption].amount / 1000}K сейчас
        </button>
      </div>
    </>
  );
}

// ─── InstantPayModal ──────────────────────────────────────────────────────────

function InstantPayModal({
  settlement,
  onClose,
  onConfirm,
}: {
  settlement: Settlement;
  onClose: () => void;
  onConfirm: (id: string) => void;
}) {
  const fee = Math.round(settlement.net * 0.005);
  const payout = Math.round(settlement.net * 0.995);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          zIndex: 700,
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
          zIndex: 701,
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

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 20,
            right: 20,
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

        {/* Title */}
        <div style={{ fontSize: 18, fontWeight: 700, color: "#3D2E1F", marginBottom: 16 }}>
          Мгновенная выплата
        </div>

        {/* Settlement details */}
        <div style={{ fontSize: 13, color: "#9A9490", marginBottom: 6 }}>
          Период: {settlement.period}
        </div>
        <div style={{ fontSize: 13, color: "#3D2E1F", marginBottom: 12 }}>
          Сумма: {formatPriceFull(settlement.gross)}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "#EAE4D8", marginBottom: 12 }} />

        {/* Fee */}
        <div style={{ fontSize: 12, color: "#9A9490", marginBottom: 8 }}>
          Комиссия 0.5% (−{formatPriceFull(fee)})
        </div>

        {/* Big payout number */}
        <div
          style={{
            background: "#FAF7F0",
            borderRadius: 12,
            padding: 12,
            textAlign: "center",
            marginTop: 8,
            marginBottom: 16,
          }}
        >
          <span
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 28,
              fontWeight: 700,
              color: "#3D2E1F",
            }}
          >
            Вы получите {formatPriceFull(payout)}
          </span>
        </div>

        {/* Confirm button */}
        <button
          onClick={() => onConfirm(settlement.id)}
          style={{
            background: "#4A8B3A",
            color: "white",
            width: "100%",
            height: 52,
            borderRadius: 14,
            fontSize: 15,
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
            marginBottom: 12,
          }}
        >
          Получить деньги сейчас
        </button>

        {/* Cancel */}
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "#9A9490",
            fontSize: 13,
            cursor: "pointer",
            width: "100%",
            padding: "4px 0",
          }}
        >
          Отмена
        </button>
      </div>
    </>
  );
}

// ─── FinanceScreen ────────────────────────────────────────────────────────────

export default function FinanceScreen() {
  const {
    state,
    openLoanModal,
    closeLoanModal,
    openInstantPay,
    closeInstantPay,
    completeInstantPay,
    applyLoan,
  } = useSauda();

  const { state: onboardingState, saveIIN, setLoanConsent } = useOnboarding();
  const [loanEligibilityOpen, setLoanEligibilityOpen] = useState(false);

  const { activeLoan, settlements, loanModalOpen, instantPayOrder } = state;

  function handleRequestLoan() {
    const { qualityScore, acceptanceRate } = state.vendor.metrics;
    if (qualityScore >= 0.75 && acceptanceRate >= 0.60) {
      openLoanModal();
    } else {
      setLoanEligibilityOpen(true);
    }
  }

  const hasActiveLoan =
    activeLoan.status === "active" || activeLoan.status === "repaying";

  const repaymentPct = Math.round(
    ((activeLoan.amount - activeLoan.remainingBalance) / activeLoan.amount) * 100,
  );

  return (
    <>
      {/* ── Main scrollable content ── */}
      <div style={{ padding: "16px 16px 80px", background: "#FAF7F0", minHeight: "100%" }}>

        {/* ── SECTION 1: Demand Forecast ── */}
        <div
          style={{
            background: "white",
            borderRadius: 16,
            padding: 16,
            border: "1px solid #EAE4D8",
            marginBottom: 16,
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 700, color: "#3D2E1F" }}>
            🔮 Прогноз на завтра
          </div>
          <div style={{ fontSize: 12, color: "#9A9490", marginBottom: 12 }}>
            Подготовьте товар заранее
          </div>

          {MOCK_FORECAST.map((item, idx) => {
            const isLast = idx === MOCK_FORECAST.length - 1;
            const trendColor =
              item.trend === "up"
                ? "#4A8B3A"
                : item.trend === "stable"
                ? "#C8A96E"
                : "#C0392B";

            return (
              <div
                key={item.product}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: 8,
                  paddingBottom: 8,
                  borderBottom: isLast ? "none" : "1px solid #EAE4D8",
                }}
              >
                {/* Left: emoji + name */}
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ fontSize: 22 }}>{item.emoji}</span>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#3D2E1F",
                      marginLeft: 8,
                    }}
                  >
                    {item.product}
                  </span>
                </div>

                {/* Right: predicted kg + confidence + trend */}
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#3D2E1F" }}>
                    ~{item.predictedKg} кг
                  </span>
                  {/* Confidence dot */}
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: CONFIDENCE_COLORS[item.confidence],
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: CONFIDENCE_COLORS[item.confidence],
                    }}
                  >
                    {CONFIDENCE_LABELS[item.confidence]}
                  </span>
                  {/* Trend arrow */}
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: trendColor,
                    }}
                  >
                    {TREND_ICONS[item.trend]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── SECTION 2: Working Capital (Loan) ── */}
        {!hasActiveLoan ? (
          /* No active loan — show available credit card */
          <div
            style={{
              background: "linear-gradient(135deg, #3D2E1F 0%, #5C4433 100%)",
              borderRadius: 16,
              padding: 20,
              marginBottom: 16,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, color: "#C8A96E", marginBottom: 4 }}>
              💳 Кредит для бизнеса
            </div>
            <div style={{ fontSize: 13, color: "#E8D5A8", marginBottom: 12 }}>
              Доступный лимит: ₸1,500,000
            </div>
            <div
              style={{
                fontFamily: "Georgia, serif",
                fontSize: 32,
                fontWeight: 700,
                color: "#C8A96E",
                marginBottom: 4,
              }}
            >
              ₸1,500,000
            </div>
            <div style={{ fontSize: 10, color: "#E8D5A8", marginBottom: 16 }}>
              Ставка 25-30% годовых · Автосписание с выплат
            </div>
            <button
              onClick={handleRequestLoan}
              style={{
                background: "#D4853A",
                color: "white",
                width: "100%",
                height: 48,
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
              }}
            >
              Запросить кредит
            </button>
          </div>
        ) : (
          /* Active loan card */
          <div
            style={{
              background: "linear-gradient(135deg, #3D2E1F 0%, #5C4433 100%)",
              borderRadius: 16,
              padding: 20,
              marginBottom: 16,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, color: "#C8A96E" }}>
              💳 Активный кредит
            </div>
            <div
              style={{
                fontFamily: "Georgia, serif",
                fontSize: 28,
                fontWeight: 700,
                color: "#C8A96E",
                marginBottom: 8,
              }}
            >
              ₸{(activeLoan.amount / 1000).toFixed(0)}K
            </div>

            {/* Two-column grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px 16px",
              }}
            >
              {/* Остаток */}
              <div>
                <div style={{ fontSize: 10, color: "#E8D5A8" }}>Остаток</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#C8A96E" }}>
                  {formatPriceFull(activeLoan.remainingBalance)}
                </div>
              </div>
              {/* Платёж/мес */}
              <div>
                <div style={{ fontSize: 10, color: "#E8D5A8" }}>Платёж/мес</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#C8A96E" }}>
                  {formatPriceFull(activeLoan.monthlyPayment)}
                </div>
              </div>
              {/* Ставка */}
              <div>
                <div style={{ fontSize: 10, color: "#E8D5A8" }}>Ставка</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#C8A96E" }}>
                  {activeLoan.interestRate}% год.
                </div>
              </div>
              {/* Автосписание */}
              <div>
                <div style={{ fontSize: 10, color: "#E8D5A8" }}>Автосписание</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#C8A96E" }}>
                  {activeLoan.autoDeductPercent}% от выплат
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div
              style={{
                background: "rgba(255,255,255,0.1)",
                height: 6,
                borderRadius: 3,
                marginTop: 12,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${repaymentPct}%`,
                  height: "100%",
                  background: "#C8A96E",
                  borderRadius: 3,
                }}
              />
            </div>
            <div style={{ fontSize: 11, color: "#E8D5A8", marginTop: 4 }}>
              {repaymentPct}% погашено
            </div>
          </div>
        )}

        {/* ── SECTION 3: Settlement History ── */}
        <div style={{ fontSize: 14, fontWeight: 700, color: "#3D2E1F", marginBottom: 12 }}>
          История выплат
        </div>

        {settlements.map((s: Settlement) => {
          const statusBadge = (() => {
            if (s.status === "paid") {
              return {
                bg: "rgba(74,139,58,0.1)",
                color: "#4A8B3A",
                label: "Выплачено ✓",
              };
            }
            if (s.status === "instant") {
              return {
                bg: "rgba(200,169,110,0.15)",
                color: "#C8A96E",
                label: "Мгновенно ✓",
              };
            }
            // pending
            return {
              bg: "rgba(212,133,58,0.1)",
              color: "#D4853A",
              label: "Ожидает",
            };
          })();

          return (
            <div
              key={s.id}
              style={{
                background: "white",
                borderRadius: 12,
                border: "1px solid #EAE4D8",
                padding: "14px 16px",
                marginBottom: 8,
              }}
            >
              {/* Top row: period + status badge */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#3D2E1F", flex: 1 }}>
                  {s.period}
                </span>
                <span
                  style={{
                    background: statusBadge.bg,
                    color: statusBadge.color,
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "3px 8px",
                    borderRadius: 6,
                    whiteSpace: "nowrap",
                  }}
                >
                  {statusBadge.label}
                </span>
              </div>

              {/* Financial details row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 8,
                  flexWrap: "wrap",
                  gap: 4,
                }}
              >
                <span style={{ fontSize: 13, color: "#3D2E1F" }}>
                  Начислено: {formatPriceFull(s.gross)}
                </span>
                {s.loanDeduction > 0 && (
                  <span style={{ fontSize: 12, color: "#C0392B" }}>
                    Кредит: −{formatPriceFull(s.loanDeduction)}
                  </span>
                )}
                <span style={{ fontSize: 14, fontWeight: 700, color: "#3D2E1F" }}>
                  Итого: {formatPriceFull(s.net)}
                </span>
              </div>

              {/* Instant pay button for pending settlements */}
              {s.status === "pending" && (
                <button
                  onClick={() => openInstantPay(s)}
                  style={{
                    background: "#FAF7F0",
                    border: "1px solid #D4853A",
                    color: "#D4853A",
                    borderRadius: 8,
                    padding: "8px 14px",
                    fontSize: 12,
                    fontWeight: 700,
                    marginTop: 8,
                    cursor: "pointer",
                    display: "block",
                  }}
                >
                  Мгновенная выплата
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* ── LOAN MODAL ── */}
      {loanModalOpen && (
        <LoanModal
          onClose={closeLoanModal}
          onApply={applyLoan}
        />
      )}

      {/* ── INSTANT PAY MODAL ── */}
      {instantPayOrder !== null && (
        <InstantPayModal
          settlement={instantPayOrder}
          onClose={closeInstantPay}
          onConfirm={completeInstantPay}
        />
      )}

      {/* ── LOAN ELIGIBILITY ── */}
      {loanEligibilityOpen && (
        <LoanEligibility
          monthsOnPlatform={12}
          qualityScore={state.vendor.metrics.qualityScore}
          acceptanceRate={state.vendor.metrics.acceptanceRate}
          hasActiveDisputes={false}
          hasIIN={!!onboardingState.iin}
          onIINSaved={saveIIN}
          onEligible={() => { setLoanEligibilityOpen(false); openLoanModal(); }}
          onClose={() => setLoanEligibilityOpen(false)}
        />
      )}
    </>
  );
}
