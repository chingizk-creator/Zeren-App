"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth, type UserAddress } from "@/context/AuthContext";

export default function AddressEntry() {
  const { setAddress, closeAuth, authState } = useAuth();
  const [street, setStreet] = useState("");
  const [apartment, setApartment] = useState("");
  const [entrance, setEntrance] = useState("");
  const [comment, setComment] = useState("");
  const [streetError, setStreetError] = useState("");
  const [saving, setSaving] = useState(false);
  const streetRef = useRef<HTMLInputElement>(null);

  // Pre-fill if editing existing address
  useEffect(() => {
    const addr = authState.user.address;
    if (addr) {
      setStreet(addr.street);
      setApartment(addr.apartment ?? "");
      setEntrance(addr.entrance ?? "");
      setComment(addr.comment ?? "");
    }
    const t = setTimeout(() => streetRef.current?.focus(), 350);
    return () => clearTimeout(t);
  }, [authState.user.address]);

  const canSave = street.trim().length > 0;

  const handleSave = useCallback(() => {
    if (!canSave) {
      setStreetError("Укажите адрес");
      streetRef.current?.focus();
      return;
    }
    setSaving(true);
    // Brief checkmark animation (250ms) then proceed
    setTimeout(() => {
      const address: UserAddress = {
        street: street.trim(),
        apartment: apartment.trim() || null,
        entrance: entrance.trim() || null,
        comment: comment.trim() || null,
      };
      setAddress(address);
      setSaving(false);
    }, 250);
  }, [canSave, street, apartment, entrance, comment, setAddress]);

  return (
    <>
      <div className="bottom-sheet-overlay" onClick={closeAuth} aria-hidden="true" />
      <div
        className="bottom-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Адрес доставки"
      >
        <div className="drag-handle" />

        {/* Close */}
        <button
          onClick={closeAuth}
          aria-label="Закрыть"
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "none",
            border: "none",
            fontSize: 20,
            color: "#9A9490",
            cursor: "pointer",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "unset",
            minWidth: "unset",
          }}
        >
          ×
        </button>

        <div style={{ padding: "20px 24px 36px" }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#3D2E1F", marginBottom: 4 }}>
            Куда доставить?
          </h2>
          <p style={{ fontSize: 12, color: "#9A9490", marginBottom: 22 }}>
            Адрес можно изменить позже
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Street */}
            <div>
              <label
                htmlFor="addr-street"
                style={{ fontSize: 11, color: "#9A9490", display: "block", marginBottom: 4 }}
              >
                Улица и дом *
              </label>
              <input
                id="addr-street"
                ref={streetRef}
                type="text"
                value={street}
                onChange={(e) => { setStreet(e.target.value); setStreetError(""); }}
                placeholder="Абая 150"
                aria-required="true"
                aria-invalid={!!streetError}
                aria-describedby={streetError ? "street-error" : undefined}
                style={inputStyle(!!streetError)}
              />
              {streetError && (
                <p
                  id="street-error"
                  role="alert"
                  style={{ fontSize: 11, color: "#C0392B", marginTop: 4 }}
                >
                  {streetError}
                </p>
              )}
            </div>

            {/* Apartment */}
            <div>
              <label
                htmlFor="addr-apt"
                style={{ fontSize: 11, color: "#9A9490", display: "block", marginBottom: 4 }}
              >
                Квартира / офис
              </label>
              <input
                id="addr-apt"
                type="text"
                value={apartment}
                onChange={(e) => setApartment(e.target.value)}
                placeholder="кв 42"
                style={inputStyle(false)}
              />
            </div>

            {/* Entrance */}
            <div>
              <label
                htmlFor="addr-entrance"
                style={{ fontSize: 11, color: "#9A9490", display: "block", marginBottom: 4 }}
              >
                Подъезд / этаж
              </label>
              <input
                id="addr-entrance"
                type="text"
                value={entrance}
                onChange={(e) => setEntrance(e.target.value)}
                placeholder="2 подъезд, 5 этаж"
                style={inputStyle(false)}
              />
            </div>

            {/* Comment */}
            <div>
              <label
                htmlFor="addr-comment"
                style={{ fontSize: 11, color: "#9A9490", display: "block", marginBottom: 4 }}
              >
                Комментарий курьеру
              </label>
              <input
                id="addr-comment"
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Домофон 42, черная дверь"
                style={inputStyle(false)}
              />
            </div>
          </div>

          {/* Save button */}
          <button
            className="btn-primary"
            style={{
              width: "100%",
              height: 50,
              fontSize: 15,
              borderRadius: 14,
              marginTop: 20,
              opacity: canSave ? 1 : 0.45,
              gap: 8,
            }}
            onClick={handleSave}
            disabled={!canSave || saving}
            aria-disabled={!canSave}
          >
            {saving ? (
              <>
                <span style={{ fontSize: 16 }}>✓</span>
                Сохраняем...
              </>
            ) : (
              "Сохранить и заказать"
            )}
          </button>
        </div>
      </div>
    </>
  );
}

function inputStyle(hasError: boolean): React.CSSProperties {
  return {
    width: "100%",
    height: 46,
    background: "white",
    border: `1.5px solid ${hasError ? "#C0392B" : "#EAE4D8"}`,
    borderRadius: 12,
    padding: "0 14px",
    fontSize: 14,
    color: "#3D2E1F",
    outline: "none",
    fontFamily: "inherit",
    transition: "border-color 0.15s",
    boxSizing: "border-box",
  };
}
