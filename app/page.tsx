"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from "react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(n: number) {
  return "₸" + n.toLocaleString("ru-RU");
}

function useCountUp(target: number, durationMs: number, active: boolean) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);
  useEffect(() => {
    if (!active) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { setValue(target); return; }
    let startTs: number | null = null;
    const step = (ts: number) => {
      if (!startTs) startTs = ts;
      const p = Math.min((ts - startTs) / durationMs, 1);
      setValue(Math.round(p * target));
      if (p < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, target, durationMs]);
  return value;
}

function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const show = () => setInView(true);
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) show(); },
      { threshold: 0 }
    );
    obs.observe(el);
    // Fallback: show after 1.2s regardless (catches headless/reduced-motion edge cases)
    const t = setTimeout(show, 1200);
    return () => { obs.disconnect(); clearTimeout(t); };
  }, []);
  return { ref, inView };
}

// ─── FadeUp wrapper ───────────────────────────────────────────────────────────

function FadeUp({ children, delay = 0, style }: { children: ReactNode; delay?: number; style?: React.CSSProperties }) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── Floating emojis (hero background) ───────────────────────────────────────

interface HeroEmoji {
  emoji: string;
  top: string;
  left?: string;
  right?: string;
  size: number;
  delay: number;
}

const HERO_EMOJIS: HeroEmoji[] = [
  { emoji: "🍅", top: "14%", left: "6%", size: 36, delay: 0 },
  { emoji: "🥕", top: "22%", right: "8%", size: 32, delay: 0.6 },
  { emoji: "🍎", top: "58%", left: "4%", size: 40, delay: 1.1 },
  { emoji: "🥩", top: "50%", right: "5%", size: 34, delay: 0.3 },
  { emoji: "🍇", top: "78%", left: "10%", size: 30, delay: 0.8 },
  { emoji: "🧀", top: "72%", right: "12%", size: 36, delay: 0.4 },
];

function FloatingEmojis() {
  return (
    <>
      {HERO_EMOJIS.map((item, i) => (
        <div
          key={i}
          aria-hidden="true"
          style={{
            position: "absolute",
            top: item.top,
            left: item.left,
            right: item.right,
            fontSize: item.size,
            animation: `float-drop ${3.5 + i * 0.3}s ease-in-out infinite`,
            animationDelay: `${item.delay}s`,
            pointerEvents: "none",
            userSelect: "none",
            zIndex: 0,
          }}
        >
          {item.emoji}
        </div>
      ))}
    </>
  );
}

// ─── Waitlist form ────────────────────────────────────────────────────────────

function WaitlistForm({ onSuccess, successCount }: { onSuccess: (pos: number) => void; successCount: number | null }) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const digits = phone.replace(/\D/g, "").slice(0, 10);
  const formatted = formatPhoneInput(digits);
  const isReady = digits.length === 10;

  const handleSubmit = useCallback(async () => {
    if (!isReady) { setError("Введите номер телефона"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: "+7" + digits }),
      });
      const data = await res.json();
      if (data.success) {
        onSuccess(data.position);
        // Persist locally so second form also shows success
        localStorage.setItem("zeren_waitlist_pos", String(data.position));
      } else {
        setError("Ошибка. Попробуйте снова.");
      }
    } catch {
      setError("Ошибка сети. Попробуйте снова.");
    } finally {
      setLoading(false);
    }
  }, [isReady, digits, onSuccess]);

  if (successCount !== null) {
    return (
      <div
        style={{
          background: "white",
          border: "1.5px solid rgba(74,139,58,0.4)",
          borderRadius: 16,
          padding: "20px 24px",
          textAlign: "center",
          maxWidth: 360,
          width: "100%",
        }}
      >
        <div style={{ fontSize: 32, marginBottom: 8 }}>🦌</div>
        <div style={{ fontSize: 17, fontWeight: 700, color: "#3D2E1F", marginBottom: 4 }}>
          Добро пожаловать в стадо!
        </div>
        <div style={{ fontSize: 13, color: "#4A8B3A", fontWeight: 600 }}>
          Вы #{successCount.toLocaleString("ru-RU")} в листе ожидания
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", maxWidth: 360 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: error ? 6 : 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "white",
            border: `1.5px solid ${error ? "#C0392B" : "#EAE4D8"}`,
            borderRadius: 12,
            padding: "0 14px",
            flex: 1,
            height: 52,
            gap: 8,
          }}
        >
          <span style={{ fontSize: 15, fontWeight: 600, color: "#9A9490", flexShrink: 0 }}>+7</span>
          <div style={{ width: 1, height: 20, background: "#EAE4D8", flexShrink: 0 }} />
          <input
            type="tel"
            inputMode="numeric"
            value={formatted}
            onChange={(e) => {
              setPhone(e.target.value);
              setError("");
            }}
            placeholder="7XX XXX XXXX"
            aria-label="Номер телефона"
            style={{
              flex: 1,
              border: "none",
              background: "transparent",
              fontSize: 15,
              fontWeight: 600,
              color: "#3D2E1F",
              outline: "none",
              fontFamily: "inherit",
              minWidth: 0,
            }}
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            background: "#D4853A",
            color: "white",
            border: "none",
            borderRadius: 12,
            padding: "0 20px",
            fontSize: 15,
            fontWeight: 700,
            cursor: loading ? "wait" : "pointer",
            height: 52,
            whiteSpace: "nowrap",
            fontFamily: "inherit",
            boxShadow: "0 3px 12px rgba(212,133,58,0.35)",
            flexShrink: 0,
          }}
        >
          {loading ? "..." : "Вступить →"}
        </button>
      </div>
      {error && (
        <p role="alert" style={{ fontSize: 12, color: "#C0392B", marginTop: 4 }}>{error}</p>
      )}
    </div>
  );
}

function formatPhoneInput(digits: string): string {
  let out = "";
  for (let i = 0; i < digits.length; i++) {
    if (i === 3 || i === 6 || i === 8) out += " ";
    out += digits[i];
  }
  return out;
}

// ─── Price comparison row ─────────────────────────────────────────────────────

const PRICE_ROWS = [
  { name: "Помидоры узбекские", zeren: 480, magnum: 850 },
  { name: "Яблоки Апорт", zeren: 390, magnum: 650 },
  { name: "Говядина вырезка", zeren: 3200, magnum: 4800 },
  { name: "Виноград Кишмиш", zeren: 890, magnum: 1400 },
  { name: "Сыр домашний", zeren: 2200, magnum: 3500 },
  { name: "Мёд горный", zeren: 3000, magnum: 4500 },
];

// ─── Subscription plans data ──────────────────────────────────────────────────

const PLANS = [
  {
    id: "basic",
    name: "Basic",
    price: 2990,
    deliveries: "4/мес",
    minOrder: "₸5 000",
    sandyq: false,
    accent: "#6B8F5A",
    dark: false,
    popular: false,
  },
  {
    id: "plus",
    name: "Plus",
    price: 4990,
    deliveries: "8/мес",
    minOrder: "₸4 000",
    sandyq: true,
    accent: "#C8A96E",
    dark: true,
    popular: true,
  },
  {
    id: "family",
    name: "Family",
    price: 7990,
    deliveries: "Безлимит",
    minOrder: "Нет",
    sandyq: true,
    accent: "#4A6A8A",
    dark: false,
    popular: false,
  },
];

// ─── Nav ──────────────────────────────────────────────────────────────────────

function LandingNav({ onJoin }: { onJoin: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        background: scrolled ? "rgba(250,247,240,0.96)" : "rgba(250,247,240,0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(60,46,31,0.08)",
        transition: "background 0.25s",
        zIndex: 1000,
      }}
    >
      <span
        style={{
          fontFamily: "Georgia, serif",
          fontSize: 18,
          fontWeight: 700,
          color: "#3D2E1F",
          letterSpacing: "3px",
        }}
      >
        ZEREN
      </span>
      <button
        onClick={onJoin}
        style={{
          background: "#D4853A",
          color: "white",
          border: "none",
          borderRadius: 20,
          padding: "8px 18px",
          fontSize: 13,
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        Присоединиться
      </button>
    </nav>
  );
}

// ─── Section: Hero ────────────────────────────────────────────────────────────

function HeroSection({ successPos, onSuccess }: { successPos: number | null; onSuccess: (p: number) => void }) {
  const counterActive = true;
  const count = useCountUp(187340, 2000, counterActive);

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 24px 60px",
        textAlign: "center",
        background: "#FAF7F0",
        overflow: "hidden",
      }}
    >
      <FloatingEmojis />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 540, width: "100%" }}>
        {/* Headline */}
        <h1
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(32px, 7vw, 52px)",
            fontWeight: 700,
            color: "#3D2E1F",
            lineHeight: 1.2,
            marginBottom: 16,
          }}
        >
          Свежие продукты с базара{" "}
          <span style={{ color: "#D4853A", display: "block" }}>с доставкой на дом</span>
        </h1>

        {/* Subheadline */}
        <p
          style={{
            fontSize: "clamp(14px, 3vw, 17px)",
            color: "#9A9490",
            lineHeight: 1.65,
            marginBottom: 24,
            maxWidth: 460,
            margin: "0 auto 24px",
          }}
        >
          Zeren доставляет продукты напрямую с Алтын Орды по базарным ценам.
          На 20–40% дешевле супермаркетов.
        </p>

        {/* Savings counter badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 14,
            background: "#3D2E1F",
            borderRadius: 16,
            padding: "14px 24px",
            marginBottom: 28,
          }}
          aria-label={`Наши клиенты сэкономили ${formatPrice(187340)}`}
        >
          <span style={{ fontSize: 13, color: "#E8D5A8", fontWeight: 500 }}>
            Наши клиенты сэкономили
          </span>
          <span
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: "#C8A96E",
              fontFamily: "Georgia, serif",
              letterSpacing: 1,
            }}
          >
            {formatPrice(count)}
          </span>
        </div>

        {/* Waitlist form */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <WaitlistForm onSuccess={onSuccess} successCount={successPos} />
          <p style={{ fontSize: 12, color: "#B5B0A8" }}>
            Уже 1 847 в листе ожидания · Запуск скоро в Алматы
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Section: Problem ─────────────────────────────────────────────────────────

const PROBLEM_CARDS = [
  {
    bg: "#EDE0D5",
    icon: "🏪",
    title: "Супермаркет",
    pain: "Удобно, но дорого",
    detail: "Наценка 40–80% на свежие продукты. Помидоры лежат на полке 3 дня.",
  },
  {
    bg: "#D5E0E8",
    icon: "🧺",
    title: "Базар",
    pain: "Дёшево, но долго",
    detail: "Подъём в 5 утра, 3–4 часа, пробки, парковка, тяжёлые сумки.",
  },
  {
    bg: "#DCE8D5",
    icon: "📱",
    title: "Доставка",
    pain: "Быстро, но те же цены",
    detail: "Arbuz и Glovo берут со склада. Качество и цены как в супермаркете.",
  },
];

function ProblemSection() {
  return (
    <section style={{ background: "white", padding: "72px 24px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <FadeUp>
          <h2
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(24px, 5vw, 32px)",
              fontWeight: 700,
              color: "#3D2E1F",
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            Знакомая дилемма?
          </h2>
          <p style={{ fontSize: 15, color: "#9A9490", textAlign: "center", marginBottom: 36 }}>
            Каждая семья в Алматы выбирает между
          </p>
        </FadeUp>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
          }}
        >
          {PROBLEM_CARDS.map((card, i) => (
            <FadeUp key={i} delay={i * 80}>
              <div
                style={{
                  background: card.bg,
                  borderRadius: 20,
                  padding: "24px",
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 12 }} aria-hidden="true">{card.icon}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#3D2E1F", marginBottom: 4 }}>
                  {card.title}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#D4853A", marginBottom: 8 }}>
                  {card.pain}
                </div>
                <div style={{ fontSize: 13, color: "#666", lineHeight: 1.55 }}>{card.detail}</div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section: Solution ────────────────────────────────────────────────────────

const SOLUTION_CARDS = [
  {
    icon: "🌅",
    title: "С базара утром",
    desc: "Наши покупатели на Алтын Орде в 6 утра. К вечеру — у вашей двери.",
  },
  {
    icon: "🤖",
    title: "ИИ находит лучшие цены",
    desc: "Технология торгуется с продавцами, чтобы вы платили минимум.",
  },
  {
    icon: "📦",
    title: "Доставка в удобное окно",
    desc: "Выберите 2-часовое окно. Бесплатная доставка по подписке.",
  },
  {
    icon: "💰",
    title: "Видите экономию",
    desc: "Приложение показывает сколько вы сэкономили vs цен Magnum.",
  },
];

function SolutionSection() {
  return (
    <section style={{ background: "#3D2E1F", padding: "72px 24px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <FadeUp>
          <h2
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(24px, 5vw, 32px)",
              fontWeight: 700,
              color: "#C8A96E",
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            Zeren решает это
          </h2>
          <p style={{ fontSize: 15, color: "#E8D5A8", textAlign: "center", marginBottom: 36 }}>
            Базарная свежесть + базарные цены + доставка на дом
          </p>
        </FadeUp>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 14,
          }}
        >
          {SOLUTION_CARDS.map((card, i) => (
            <FadeUp key={i} delay={i * 70}>
              <div
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 16,
                  padding: "20px",
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 10 }} aria-hidden="true">{card.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#C8A96E", marginBottom: 6 }}>
                  {card.title}
                </div>
                <div style={{ fontSize: 12, color: "#E8D5A8", lineHeight: 1.6 }}>{card.desc}</div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section: Price comparison ────────────────────────────────────────────────

function PriceSection() {
  return (
    <section style={{ background: "white", padding: "72px 24px" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <FadeUp>
          <h2
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(24px, 5vw, 32px)",
              fontWeight: 700,
              color: "#3D2E1F",
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            Реальные цены. Без обмана.
          </h2>
          <p style={{ fontSize: 14, color: "#9A9490", textAlign: "center", marginBottom: 28 }}>
            Сравнение с Magnum на примере типичной корзины
          </p>
        </FadeUp>

        <FadeUp delay={80}>
          <div
            style={{
              background: "#FAF7F0",
              borderRadius: 20,
              border: "1px solid #EAE4D8",
              overflow: "hidden",
            }}
          >
            {/* Header row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto auto auto",
                gap: 8,
                padding: "10px 16px",
                borderBottom: "1px solid #EAE4D8",
                background: "white",
              }}
            >
              <span style={{ fontSize: 10, color: "#9A9490", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Продукт</span>
              <span style={{ fontSize: 10, color: "#9A9490", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, textAlign: "right" }}>Magnum</span>
              <span style={{ fontSize: 10, color: "#D4853A", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, textAlign: "right" }}>Zeren</span>
              <span style={{ fontSize: 10, color: "#4A8B3A", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, textAlign: "right" }}>Экономия</span>
            </div>

            {PRICE_ROWS.map((row, i) => {
              const pct = Math.round((1 - row.zeren / row.magnum) * 100);
              return (
                <div key={i}>
                  {i > 0 && <div style={{ height: 1, background: "#EAE4D8" }} />}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto auto auto",
                      gap: 8,
                      padding: "12px 16px",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 500, color: "#3D2E1F" }}>{row.name}</span>
                    <span
                      style={{
                        fontSize: 12,
                        color: "#B5B0A8",
                        textDecoration: "line-through",
                        fontFamily: "Georgia, serif",
                        textAlign: "right",
                      }}
                    >
                      {formatPrice(row.magnum)}
                    </span>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#3D2E1F",
                        fontFamily: "Georgia, serif",
                        textAlign: "right",
                      }}
                    >
                      {formatPrice(row.zeren)}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#4A8B3A",
                        background: "rgba(74,139,58,0.1)",
                        borderRadius: 6,
                        padding: "2px 6px",
                        textAlign: "center",
                        whiteSpace: "nowrap",
                      }}
                    >
                      −{pct}%
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Summary */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "14px 16px",
                borderTop: "2px solid #EAE4D8",
                background: "rgba(74,139,58,0.05)",
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 700, color: "#3D2E1F" }}>Средняя экономия</span>
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#4A8B3A",
                  fontFamily: "Georgia, serif",
                }}
              >
                35–40%
              </span>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── Section: How it works ────────────────────────────────────────────────────

const HOW_STEPS = [
  {
    icon: "📱",
    label: "ШАГ 1",
    title: "Выберите продукты",
    desc: "Листайте каталог с базарными ценами. Видите экономию на каждом товаре.",
    accent: "#3D2E1F",
  },
  {
    icon: "🌅",
    label: "ШАГ 2",
    title: "Мы закупаем на базаре",
    desc: "Наша команда на Алтын Орде в 6 утра. ИИ находит лучшие цены.",
    accent: "#3D2E1F",
  },
  {
    icon: "🦌",
    label: "ШАГ 3",
    title: "Доставляем к двери",
    desc: "Выберите удобное 2-часовое окно. Свежие продукты в холодильнике.",
    accent: "#D4853A",
  },
];

function HowSection() {
  return (
    <section style={{ background: "#FAF7F0", padding: "72px 24px" }}>
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <FadeUp>
          <h2
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(24px, 5vw, 32px)",
              fontWeight: 700,
              color: "#3D2E1F",
              textAlign: "center",
              marginBottom: 40,
            }}
          >
            Как это работает
          </h2>
        </FadeUp>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {HOW_STEPS.map((step, i) => (
            <FadeUp key={i} delay={i * 100}>
              <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: step.accent,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                    flexShrink: 0,
                  }}
                  aria-hidden="true"
                >
                  {step.icon}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#D4853A",
                      letterSpacing: "2px",
                      marginBottom: 4,
                    }}
                  >
                    {step.label}
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: "#3D2E1F", marginBottom: 6 }}>
                    {step.title}
                  </div>
                  <div style={{ fontSize: 13, color: "#9A9490", lineHeight: 1.6 }}>{step.desc}</div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section: Subscription plans ─────────────────────────────────────────────

function PlansSection() {
  return (
    <section style={{ background: "white", padding: "72px 24px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <FadeUp>
          <h2
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(24px, 5vw, 32px)",
              fontWeight: 700,
              color: "#3D2E1F",
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            Простые тарифы
          </h2>
          <p style={{ fontSize: 14, color: "#9A9490", textAlign: "center", marginBottom: 32 }}>
            Подписка окупается с первого заказа
          </p>
        </FadeUp>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
          }}
        >
          {PLANS.map((plan, i) => (
            <FadeUp key={plan.id} delay={i * 80}>
              <div
                style={{
                  background: plan.dark ? "#3D2E1F" : "white",
                  border: plan.dark ? "none" : `1.5px solid #EAE4D8`,
                  borderRadius: 20,
                  padding: "24px",
                  position: "relative",
                  boxShadow: plan.dark ? "0 8px 32px rgba(61,46,31,0.2)" : "none",
                }}
              >
                {plan.popular && (
                  <div
                    style={{
                      position: "absolute",
                      top: -1,
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "#D4853A",
                      color: "white",
                      fontSize: 9,
                      fontWeight: 700,
                      padding: "3px 12px",
                      borderRadius: "0 0 8px 8px",
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Популярный
                  </div>
                )}

                <div
                  style={{
                    fontSize: 17,
                    fontWeight: 700,
                    color: plan.dark ? "#C8A96E" : "#3D2E1F",
                    marginBottom: 4,
                    marginTop: plan.popular ? 8 : 0,
                  }}
                >
                  {plan.name}
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 3, marginBottom: 16 }}>
                  <span
                    style={{
                      fontFamily: "Georgia, serif",
                      fontSize: 28,
                      fontWeight: 700,
                      color: plan.dark ? "#C8A96E" : plan.accent,
                    }}
                  >
                    {formatPrice(plan.price)}
                  </span>
                  <span style={{ fontSize: 11, color: plan.dark ? "#E8D5A8" : "#9A9490" }}>/мес</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                  {[
                    ["📦", "Доставок", plan.deliveries],
                    ["🛒", "Мин. заказ", plan.minOrder],
                    ["📦", "Сандық", plan.sandyq ? "✓ Есть" : "Нет"],
                  ].map(([, label, val], j) => (
                    <div key={j} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 12, color: plan.dark ? "#E8D5A8" : "#9A9490" }}>{label}</span>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: plan.dark ? "#C8A96E" : plan.accent,
                        }}
                      >
                        {val}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  style={{
                    width: "100%",
                    height: 42,
                    background: "#D4853A",
                    color: "white",
                    border: "none",
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Выбрать
                </button>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section: Stats ───────────────────────────────────────────────────────────

const STATS = [
  { number: "1 847", label: "в листе ожидания" },
  { number: "35–40%", label: "средняя экономия" },
  { number: "30+", label: "товаров с базара" },
  { number: "2 часа", label: "окно доставки" },
];

function StatsSection() {
  return (
    <section style={{ background: "#FAF7F0", padding: "60px 24px" }}>
      <div
        style={{
          maxWidth: 600,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: 24,
          textAlign: "center",
        }}
      >
        {STATS.map((s, i) => (
          <FadeUp key={i} delay={i * 70}>
            <div>
              <div
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#3D2E1F",
                  marginBottom: 4,
                }}
              >
                {s.number}
              </div>
              <div style={{ fontSize: 11, color: "#9A9490" }}>{s.label}</div>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}

// ─── Section: Final CTA ───────────────────────────────────────────────────────

function FinalCTA({ successPos, onSuccess }: { successPos: number | null; onSuccess: (p: number) => void }) {
  return (
    <section id="waitlist" style={{ background: "#3D2E1F", padding: "72px 24px" }}>
      <div
        style={{
          maxWidth: 480,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 14,
        }}
      >
        <div style={{ fontSize: 48 }} aria-hidden="true">🦌</div>
        <h2
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(24px, 5vw, 30px)",
            fontWeight: 700,
            color: "#C8A96E",
            marginBottom: 4,
          }}
        >
          Присоединяйтесь к стаду
        </h2>
        <p style={{ fontSize: 14, color: "#E8D5A8", lineHeight: 1.65, maxWidth: 340 }}>
          Запуск скоро в Алматы. Оставьте номер — получите бесплатную первую доставку.
        </p>

        <WaitlistForm onSuccess={onSuccess} successCount={successPos} />

        {/* Social links */}
        <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
          <a
            href="#"
            aria-label="Instagram"
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              textDecoration: "none",
            }}
          >
            📸
          </a>
          <a
            href="#"
            aria-label="Telegram"
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              textDecoration: "none",
            }}
          >
            ✈️
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer
      style={{
        background: "#2A2119",
        padding: "24px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <span
        style={{
          fontFamily: "Georgia, serif",
          fontSize: 13,
          color: "#C8A96E",
          letterSpacing: "2px",
        }}
      >
        ZEREN
      </span>
      <span style={{ fontSize: 10, color: "#665E54" }}>
        Даланың дәмі — үйіңізге · © 2027
      </span>
    </footer>
  );
}

// ─── Root page ────────────────────────────────────────────────────────────────

export default function LandingPage() {
  // Shared waitlist success state across both forms
  const [successPos, setSuccessPos] = useState<number | null>(null);

  useEffect(() => {
    // Restore from localStorage if already submitted
    const saved = localStorage.getItem("zeren_waitlist_pos");
    if (saved) setSuccessPos(Number(saved));
  }, []);

  const handleSuccess = useCallback((pos: number) => {
    setSuccessPos(pos);
  }, []);

  const scrollToWaitlist = useCallback(() => {
    document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <>
      <LandingNav onJoin={scrollToWaitlist} />
      <HeroSection successPos={successPos} onSuccess={handleSuccess} />
      <ProblemSection />
      <SolutionSection />
      <PriceSection />
      <HowSection />
      <PlansSection />
      <StatsSection />
      <FinalCTA successPos={successPos} onSuccess={handleSuccess} />
      <Footer />
    </>
  );
}
