"use client";

interface ProgressBarProps {
  currentStep: 1 | 2 | 3 | 4 | 5 | 6;
}

const TOTAL_STEPS = 6;

export default function ProgressBar({ currentStep }: ProgressBarProps) {
  return (
    <div
      style={{
        padding: "16px 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        position: "relative",
      }}
    >
      {/* Background connector line */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: `${(TOTAL_STEPS - 1) * 22}px`,
          height: "2px",
          backgroundColor: "#EAE4D8",
          zIndex: 0,
        }}
      />

      {/* Terracotta fill line */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          // line spans between first and last dot center
          // each dot+gap unit ≈ 22px; fill covers from dot 1 to currentStep
          width:
            currentStep === 1
              ? "0px"
              : `${(currentStep - 1) * 22}px`,
          height: "2px",
          backgroundColor: "#D4853A",
          zIndex: 0,
          // anchor from the left edge of the connector line
          marginLeft: `-${((TOTAL_STEPS - 1) * 22) / 2}px`,
          transition: "width 300ms ease",
        }}
      />

      {/* Dots */}
      {Array.from({ length: TOTAL_STEPS }, (_, i) => {
        const step = (i + 1) as 1 | 2 | 3 | 4 | 5 | 6;
        const isCompleted = step <= currentStep;
        const isActive = step === currentStep;
        const size = isActive ? 12 : 10;

        return (
          <div
            key={step}
            style={{
              width: size,
              height: size,
              borderRadius: "50%",
              backgroundColor: isCompleted ? "#D4853A" : "#EAE4D8",
              flexShrink: 0,
              zIndex: 1,
              transition: "background-color 300ms ease, width 300ms ease, height 300ms ease",
            }}
          />
        );
      })}
    </div>
  );
}
