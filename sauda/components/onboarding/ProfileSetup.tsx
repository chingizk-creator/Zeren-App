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

const BAZAARS = ["Алтын Орда", "Зелёный базар", "Самал базар", "Барахолка", "Другой"];
const CITIES = ["Алматы", "Астана", "Шымкент", "Актобе"];

const inputBase: React.CSSProperties = {
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

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#9A9490",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  fontWeight: 500,
  marginBottom: 6,
  display: "block",
};

interface FocusedField {
  name?: boolean;
  stallNumber?: boolean;
  customBazaar?: boolean;
}

export default function ProfileSetup({ data, onUpdate, onNext, onBack }: StepProps) {
  const [openSelect, setOpenSelect] = useState<"bazaar" | "city" | null>(null);
  const [customBazaar, setCustomBazaar] = useState(
    data.profile.bazaar && !BAZAARS.slice(0, -1).includes(data.profile.bazaar)
      ? data.profile.bazaar
      : ""
  );
  const [focused, setFocused] = useState<FocusedField>({});

  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    if (!openSelect) return;
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenSelect(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [openSelect]);

  const profile = data.profile;

  function updateProfile(patch: Partial<typeof profile>) {
    onUpdate({ profile: { ...profile, ...patch } });
  }

  function selectBazaar(value: string) {
    if (value === "Другой") {
      updateProfile({ bazaar: customBazaar || "" });
    } else {
      updateProfile({ bazaar: value });
      setCustomBazaar("");
    }
    setOpenSelect(null);
  }

  function selectCity(value: string) {
    updateProfile({ city: value });
    setOpenSelect(null);
  }

  const isOtherBazaar = profile.bazaar === "" || (profile.bazaar !== "" && !BAZAARS.slice(0, -1).includes(profile.bazaar));
  const displayBazaar =
    BAZAARS.slice(0, -1).includes(profile.bazaar)
      ? profile.bazaar
      : profile.bazaar
      ? profile.bazaar
      : null;

  const currentBazaarChoice = BAZAARS.slice(0, -1).includes(profile.bazaar)
    ? profile.bazaar
    : profile.bazaar
    ? "Другой"
    : null;

  const canProceed =
    profile.name.length >= 2 &&
    profile.stallNumber.trim().length > 0 &&
    profile.bazaar.trim().length > 0 &&
    profile.city.trim().length > 0;

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: "100dvh",
        background: "#FAF7F0",
        padding: 24,
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
      }}
    >
      {/* Back */}
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
        <div style={{ fontSize: 22, fontWeight: "bold", color: "#3D2E1F", marginBottom: 4 }}>
          Расскажите о себе
        </div>
        <div style={{ fontSize: 12, color: "#9A9490" }}>Шаг 2 из 6</div>
      </div>

      {/* Form fields */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Name */}
        <div>
          <label style={labelStyle}>Имя</label>
          <input
            type="text"
            value={profile.name}
            placeholder="Как вас зовут?"
            onChange={(e) => updateProfile({ name: e.target.value })}
            onFocus={() => setFocused((f) => ({ ...f, name: true }))}
            onBlur={() => setFocused((f) => ({ ...f, name: false }))}
            style={{
              ...inputBase,
              borderColor: focused.name ? "#D4853A" : "#EAE4D8",
            }}
          />
        </div>

        {/* Stall number */}
        <div>
          <label style={labelStyle}>Прилавок / место</label>
          <input
            type="text"
            value={profile.stallNumber}
            placeholder="Например: Ряд 3, место 47"
            onChange={(e) => updateProfile({ stallNumber: e.target.value })}
            onFocus={() => setFocused((f) => ({ ...f, stallNumber: true }))}
            onBlur={() => setFocused((f) => ({ ...f, stallNumber: false }))}
            style={{
              ...inputBase,
              borderColor: focused.stallNumber ? "#D4853A" : "#EAE4D8",
            }}
          />
        </div>

        {/* Bazaar select */}
        <div style={{ position: "relative" }}>
          <label style={labelStyle}>Базар</label>
          <div
            onClick={() => setOpenSelect(openSelect === "bazaar" ? null : "bazaar")}
            style={{
              ...inputBase,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              borderColor: openSelect === "bazaar" ? "#D4853A" : "#EAE4D8",
              userSelect: "none",
            }}
          >
            <span style={{ color: displayBazaar ? "#3D2E1F" : "#9A9490" }}>
              {displayBazaar || "Выберите базар"}
            </span>
            <span style={{ color: "#9A9490", fontSize: 12 }}>
              {openSelect === "bazaar" ? "▲" : "▼"}
            </span>
          </div>

          {openSelect === "bazaar" && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 4px)",
                left: 0,
                right: 0,
                background: "white",
                border: "1.5px solid #EAE4D8",
                borderRadius: 12,
                overflow: "hidden",
                zIndex: 50,
                boxShadow: "0 4px 16px rgba(61,46,31,0.1)",
              }}
            >
              {BAZAARS.map((b) => (
                <div
                  key={b}
                  onClick={() => selectBazaar(b)}
                  style={{
                    padding: "14px 16px",
                    fontSize: 16,
                    color: currentBazaarChoice === b ? "#D4853A" : "#3D2E1F",
                    fontWeight: currentBazaarChoice === b ? 600 : 400,
                    cursor: "pointer",
                    background: currentBazaarChoice === b ? "#FAF7F0" : "white",
                    borderBottom: b !== BAZAARS[BAZAARS.length - 1] ? "1px solid #EAE4D8" : "none",
                    minHeight: 48,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {b}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Custom bazaar text input (when "Другой" selected) */}
        {currentBazaarChoice === "Другой" && (
          <div>
            <input
              type="text"
              value={customBazaar}
              placeholder="Введите название базара"
              onChange={(e) => {
                setCustomBazaar(e.target.value);
                updateProfile({ bazaar: e.target.value });
              }}
              onFocus={() => setFocused((f) => ({ ...f, customBazaar: true }))}
              onBlur={() => setFocused((f) => ({ ...f, customBazaar: false }))}
              style={{
                ...inputBase,
                borderColor: focused.customBazaar ? "#D4853A" : "#EAE4D8",
              }}
            />
          </div>
        )}

        {/* City select */}
        <div style={{ position: "relative" }}>
          <label style={labelStyle}>Город</label>
          <div
            onClick={() => setOpenSelect(openSelect === "city" ? null : "city")}
            style={{
              ...inputBase,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              borderColor: openSelect === "city" ? "#D4853A" : "#EAE4D8",
              userSelect: "none",
            }}
          >
            <span style={{ color: profile.city ? "#3D2E1F" : "#9A9490" }}>
              {profile.city || "Выберите город"}
            </span>
            <span style={{ color: "#9A9490", fontSize: 12 }}>
              {openSelect === "city" ? "▲" : "▼"}
            </span>
          </div>

          {openSelect === "city" && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 4px)",
                left: 0,
                right: 0,
                background: "white",
                border: "1.5px solid #EAE4D8",
                borderRadius: 12,
                overflow: "hidden",
                zIndex: 50,
                boxShadow: "0 4px 16px rgba(61,46,31,0.1)",
              }}
            >
              {CITIES.map((c) => (
                <div
                  key={c}
                  onClick={() => selectCity(c)}
                  style={{
                    padding: "14px 16px",
                    fontSize: 16,
                    color: profile.city === c ? "#D4853A" : "#3D2E1F",
                    fontWeight: profile.city === c ? 600 : 400,
                    cursor: "pointer",
                    background: profile.city === c ? "#FAF7F0" : "white",
                    borderBottom: c !== CITIES[CITIES.length - 1] ? "1px solid #EAE4D8" : "none",
                    minHeight: 48,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {c}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ flex: 1 }} />

      {/* CTA */}
      <div style={{ marginTop: 24 }}>
        <button
          disabled={!canProceed}
          onClick={onNext}
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

      <div style={{ height: 32 }} />
    </div>
  );
}
