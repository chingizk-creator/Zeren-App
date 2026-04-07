"use client";

interface QuantityStepperProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  size?: "sm" | "md";
}

export default function QuantityStepper({
  quantity,
  onIncrease,
  onDecrease,
  size = "md",
}: QuantityStepperProps) {
  const btnSize = size === "sm" ? 30 : 34;
  const fontSize = size === "sm" ? 17 : 18;
  const countSize = size === "sm" ? 13 : 15;

  return (
    <div className="qty-stepper" style={{ padding: size === "sm" ? 2 : 3 }}>
      <button
        className="qty-btn-minus"
        style={{ width: btnSize, height: btnSize, fontSize }}
        onClick={(e) => { e.stopPropagation(); onDecrease(); }}
        aria-label="Убрать"
      >
        −
      </button>
      <span
        className="qty-count"
        style={{ fontSize: countSize }}
        aria-label={`${quantity} в корзине`}
      >
        {quantity}
      </span>
      <button
        className="qty-btn-plus"
        style={{ width: btnSize, height: btnSize, fontSize }}
        onClick={(e) => { e.stopPropagation(); onIncrease(); }}
        aria-label="Добавить"
      >
        +
      </button>
    </div>
  );
}
