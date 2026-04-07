"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface OnboardingScreenProps {
  onComplete: () => void;
}

const STORAGE_KEY = "zeren_onboarded";

// ─── Count-up hook ────────────────────────────────────────────────────────────

function useCountUp(target: number, durationMs: number, active: boolean, reduced: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    if (reduced) { setValue(target); return; }
    let startTs: number | null = null;
    const step = (ts: number) => {
      if (!startTs) startTs = ts;
      const p = Math.min((ts - startTs) / durationMs, 1);
      setValue(Math.round(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    const id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [active, target, durationMs, reduced]);
  return value;
}

// ─── Screen 2: Price animation ────────────────────────────────────────────────

function PriceComparison({ active, reduced }: { active: boolean; reduced: boolean }) {
  const [phase, setPhase] = useState(0); // 0=retail shown, 1=transition, 2=bazaar shown

  useEffect(() => {
    if (!active) { setPhase(0); return; }
    if (reduced) { setPhase(2); return; }
    const t1 = setTimeout(() => setPhase(1), 600);
    const t2 = setTimeout(() => setPhase(2), 1400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [active, reduced]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      {/* Product label */}
      <div style={{ fontSize: 13, color: "#9A9490", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>
        Помидоры узбекские · 1 кг
      </div>

      {/* Price row */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, height: 56 }}>
        {/* Retail price */}
        <div
          style={{
            fontSize: 26,
            fontWeight: 700,
            color: "#C0392B",
            fontFamily: "Georgia, serif",
            textDecoration: "line-through",
            opacity: phase >= 1 ? 0.3 : 1,
            transition: "opacity 0.5s ease",
          }}
        >
          ₸850
        </div>

        <div style={{ fontSize: 20, color: "#EAE4D8" }}>→</div>

        {/* Bazaar price */}
        <div
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: "#4A8B3A",
            fontFamily: "Georgia, serif",
            opacity: phase >= 1 ? 1 : 0,
            transform: phase >= 1 ? "scale(1)" : "scale(0.7)",
            transition: "opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s",
            textShadow: phase >= 2 ? "0 0 20px rgba(74,139,58,0.4)" : "none",
          }}
        >
          ₸480
        </div>
      </div>

      {/* Savings badge */}
      <div
        style={{
          background: "rgba(74,139,58,0.12)",
          border: "1px solid rgba(74,139,58,0.3)",
          borderRadius: 20,
          padding: "5px 14px",
          opacity: phase >= 2 ? 1 : 0,
          transform: phase >= 2 ? "translateY(0) scale(1)" : "translateY(8px) scale(0.85)",
          transition: "opacity 0.4s ease 0.3s, transform 0.4s ease 0.3s",
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 700, color: "#4A8B3A" }}>−44% от Magnum</span>
      </div>
    </div>
  );
}

// ─── Floating emojis ─────────────────────────────────────────────────────────

const EMOJI_LIST = ["🍅", "🥕", "🍎", "🥩", "🍇", "🧀"];
const EMOJI_POSITIONS = [
  { top: "12%", left: "8%" },
  { top: "18%", right: "10%" },
  { top: "42%", left: "5%" },
  { top: "38%", right: "6%" },
  { top: "65%", left: "12%" },
  { top: "60%", right: "14%" },
];

function FloatingEmojis({ reduced }: { reduced: boolean }) {
  if (reduced) return null;
  return (
    <>
      {EMOJI_LIST.map((emoji, i) => (
        <div
          key={i}
          aria-hidden="true"
          style={{
            position: "absolute",
            ...EMOJI_POSITIONS[i],
            fontSize: 28 + (i % 3) * 6,
            animation: `float-drop ${3.5 + i * 0.4}s ease-in-out infinite`,
            animationDelay: `${i * 0.45}s`,
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          {emoji}
        </div>
      ))}
    </>
  );
}

// ─── Screen definitions ───────────────────────────────────────────────────────

interface ScreenDef {
  id: number;
  headline: string;
  desc: string;
  visual: (active: boolean, reduced: boolean) => React.ReactNode;
}

function Screen1Visual({ reduced }: { active: boolean; reduced: boolean }) {
  return (
    <div style={{ position: "relative", width: 220, height: 160, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {!reduced && EMOJI_LIST.map((emoji, i) => {
        const angle = (i / EMOJI_LIST.length) * Math.PI * 2;
        const r = 72;
        return (
          <div
            key={i}
            aria-hidden="true"
            style={{
              position: "absolute",
              fontSize: 32 + (i % 2) * 8,
              left: `calc(50% + ${Math.cos(angle) * r}px - 20px)`,
              top: `calc(50% + ${Math.sin(angle) * r * 0.6}px - 20px)`,
              animation: `float-drop ${3 + i * 0.3}s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`,
            }}
          >
            {emoji}
          </div>
        );
      })}
      {reduced && (
        <div style={{ fontSize: 64 }}>🛒</div>
      )}
    </div>
  );
}

function Screen3Visual({ active, reduced }: { active: boolean; reduced: boolean }) {
  const count = useCountUp(187340, 1500, active, reduced);
  const fmt = (n: number) => "₸" + n.toLocaleString("ru-RU");

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <div style={{ fontSize: 64, animation: reduced ? "none" : "breathe 2.5s ease-in-out infinite" }} aria-hidden="true">🦌</div>
      <div
        style={{
          fontFamily: "Georgia, serif",
          fontSize: 36,
          fontWeight: 700,
          color: "#C8A96E",
          letterSpacing: 1,
        }}
        aria-label={`Сэкономлено ${fmt(187340)}`}
      >
        {fmt(count)}
      </div>
      <div style={{ fontSize: 12, color: "#9A9490" }}>сэкономлено жителями Алматы</div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const [reduced, setReduced] = useState(false);
  const TOTAL = 3;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const finish = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "true");
    onComplete();
  }, [onComplete]);

  const next = useCallback(() => {
    if (current < TOTAL - 1) setCurrent((c) => c + 1);
    else finish();
  }, [current, finish]);

  const prev = useCallback(() => {
    if (current > 0) setCurrent((c) => c - 1);
  }, [current]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (delta > 50) next();
    else if (delta < -50) prev();
    touchStartX.current = null;
  }, [next, prev]);

  const screens: ScreenDef[] = [
    {
      id: 0,
      headline: "Свежие продукты с базара",
      desc: "Мы закупаем на Алтын Орде каждое утро и доставляем к вашей двери в тот же день",
      visual: (active, red) => <Screen1Visual active={active} reduced={red} />,
    },
    {
      id: 1,
      headline: "На 25–40% дешевле супермаркетов",
      desc: "Базарные цены без поездки на базар. Видите экономию на каждом товаре.",
      visual: (active, red) => <PriceComparison active={active} reduced={red} />,
    },
    {
      id: 2,
      headline: "Алматинцы уже экономят",
      desc: "2 147 семей в листе ожидания. Запуск скоро — будьте в числе первых.",
      visual: (active, red) => <Screen3Visual active={active} reduced={red} />,
    },
  ];

  const isLast = current === TOTAL - 1;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#FAF7F0",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
        zIndex: 9999,
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Skip button */}
      <button
        onClick={finish}
        aria-label="Пропустить"
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          background: "none",
          border: "none",
          fontSize: 14,
          color: "#9A9490",
          cursor: "pointer",
          fontFamily: "inherit",
          fontWeight: 500,
          minHeight: "unset",
          padding: "8px 4px",
          zIndex: 10,
        }}
      >
        Пропустить
      </button>

      {/* Slides container */}
      <div
        style={{
          flex: 1,
          display: "flex",
          transition: reduced ? "none" : "transform 0.3s ease-out",
          transform: `translateX(-${current * 100}%)`,
          willChange: "transform",
        }}
      >
        {screens.map((screen, idx) => (
          <div
            key={screen.id}
            style={{
              minWidth: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "80px 32px 48px",
              textAlign: "center",
              gap: 24,
            }}
          >
            {/* Visual */}
            <div style={{ minHeight: 180, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {screen.visual(idx === current, reduced)}
            </div>

            {/* Text */}
            <div style={{ maxWidth: 300 }}>
              <h1
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: 26,
                  fontWeight: 700,
                  color: "#3D2E1F",
                  marginBottom: 12,
                  lineHeight: 1.25,
                }}
              >
                {screen.headline}
              </h1>
              <p
                style={{
                  fontSize: 15,
                  color: "#9A9490",
                  lineHeight: 1.65,
                }}
              >
                {screen.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom area */}
      <div style={{ padding: "0 32px 48px", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        {/* Dots */}
        <div style={{ display: "flex", gap: 8 }} role="tablist" aria-label="Прогресс">
          {Array.from({ length: TOTAL }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              role="tab"
              aria-selected={i === current}
              aria-label={`Экран ${i + 1}`}
              style={{
                width: i === current ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: i === current ? "#D4853A" : "#EAE4D8",
                border: "none",
                cursor: "pointer",
                padding: 0,
                minHeight: "unset",
                minWidth: "unset",
                transition: "width 0.25s ease, background 0.25s ease",
              }}
            />
          ))}
        </div>

        {/* CTA button */}
        <button
          className="btn-primary"
          onClick={next}
          style={{
            width: "100%",
            maxWidth: 300,
            height: 52,
            fontSize: 16,
            borderRadius: 14,
            boxShadow: isLast ? "0 4px 20px rgba(212,133,58,0.35)" : "none",
          }}
        >
          {isLast ? "Начать экономить 🦌" : "Далее →"}
        </button>
      </div>
    </div>
  );
}
