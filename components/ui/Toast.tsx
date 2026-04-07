"use client";

import { useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";

export default function Toast() {
  const { state, hideToast } = useApp();
  const { toastVisible, toastTitle, toastDesc, toastEmoji } = state;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (toastVisible) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        hideToast();
      }, 4000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [toastVisible, hideToast]);

  if (!toastVisible) return null;

  return (
    <div className="toast-container">
      <div
        className="toast animate-toast-enter"
        onClick={hideToast}
        role="alert"
        aria-live="polite"
      >
        <span style={{ fontSize: 20, flexShrink: 0 }}>{toastEmoji}</span>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#C8A96E",
              marginBottom: 2,
            }}
          >
            {toastTitle}
          </div>
          <div style={{ fontSize: 10, color: "#E8D5A8", lineHeight: 1.4 }}>
            {toastDesc}
          </div>
        </div>
        <button
          onClick={hideToast}
          aria-label="Закрыть"
          style={{
            background: "none",
            border: "none",
            color: "#9A9490",
            fontSize: 16,
            padding: 0,
            cursor: "pointer",
            minHeight: "auto",
            minWidth: "auto",
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}
