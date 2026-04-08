"use client";

import { useState, useRef } from "react";

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

const CARDS = [
  {
    icon: "📋",
    title: "Получайте заказы",
    body: "Заказы приходят в приложение с уведомлением. У вас 5 минут, чтобы принять или предложить свою цену.",
  },
  {
    icon: "↕",
    title: "Торгуйтесь",
    body: "Если цена не устраивает — предложите встречную. Максимум 2 раунда переговоров. Как на базаре, только быстрее.",
  },
  {
    icon: "⭐",
    title: "Зарабатывайте больше",
    body: "Чем лучше ваши показатели — тем больше заказов и выгодных условий. Золотые продавцы получают премиальные заказы.",
  },
];

export default function WelcomeTutorial({ data, onUpdate, onNext }: StepProps) {
  const [cardIndex, setCardIndex] = useState<0 | 1 | 2>(0);
  const touchStartX = useRef<number | null>(null);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;

    if (delta > 50 && cardIndex > 0) {
      setCardIndex((cardIndex - 1) as 0 | 1 | 2);
    } else if (delta < -50 && cardIndex < 2) {
      setCardIndex((cardIndex + 1) as 0 | 1 | 2);
    }
  }

  function handleNext() {
    if (cardIndex < 2) {
      setCardIndex((cardIndex + 1) as 0 | 1 | 2);
    } else {
      onUpdate({ tutorialCompleted: true });
      onNext();
    }
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
        alignItems: "center",
      }}
    >
      {/* Top section */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          paddingTop: 32,
          marginBottom: 32,
        }}
      >
        <div style={{ fontSize: 48, lineHeight: 1, marginBottom: 12 }}>🦌</div>
        <p
          style={{
            fontSize: 18,
            color: "#9A9490",
            margin: 0,
            fontFamily: "inherit",
          }}
        >
          Добро пожаловать в Zeren Sauda,
        </p>
        <p
          style={{
            fontSize: 28,
            fontWeight: "bold",
            color: "#3D2E1F",
            margin: "4px 0 0",
            fontFamily: "Georgia, serif",
          }}
        >
          {data.profile.name || "Бахыт"}! 🎉
        </p>
        <p
          style={{
            fontSize: 14,
            color: "#9A9490",
            margin: "8px 0 0",
            fontFamily: "inherit",
          }}
        >
          Ваш аккаунт создан
        </p>
      </div>

      {/* Card carousel */}
      <div
        style={{
          width: "100%",
          overflow: "hidden",
          position: "relative",
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          style={{
            display: "flex",
            transform: `translateX(-${cardIndex * 100}%)`,
            transition: "transform 300ms ease",
            width: "100%",
          }}
        >
          {CARDS.map((card, index) => (
            <div
              key={index}
              style={{
                flexShrink: 0,
                width: "100%",
                padding: 24,
                textAlign: "center",
                background: "white",
                border: "1px solid #EAE4D8",
                borderRadius: 20,
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  fontSize: 56,
                  lineHeight: 1,
                  marginBottom: 16,
                }}
              >
                {card.icon}
              </div>
              <p
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#3D2E1F",
                  margin: 0,
                  fontFamily: "inherit",
                }}
              >
                {card.title}
              </p>
              <p
                style={{
                  fontSize: 15,
                  color: "#9A9490",
                  lineHeight: 1.6,
                  margin: "8px 0 0",
                  fontFamily: "inherit",
                }}
              >
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Dot indicators */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 8,
          marginTop: 20,
        }}
      >
        {CARDS.map((_, index) => (
          <div
            key={index}
            onClick={() => setCardIndex(index as 0 | 1 | 2)}
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: index === cardIndex ? "#D4853A" : "#EAE4D8",
              cursor: "pointer",
              transition: "background 200ms ease",
            }}
          />
        ))}
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* CTA button */}
      <div style={{ width: "100%", marginTop: 24 }}>
        <button
          onClick={handleNext}
          style={{
            height: 56,
            width: "100%",
            backgroundColor: "#D4853A",
            color: "white",
            border: "none",
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 600,
            fontFamily: "inherit",
            cursor: "pointer",
            transition: "background-color 200ms ease",
          }}
        >
          {cardIndex < 2 ? "Далее →" : "Начать работу"}
        </button>
      </div>
    </div>
  );
}
