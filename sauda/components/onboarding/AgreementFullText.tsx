"use client";

import { AGREEMENT_SECTIONS } from "@/sauda/data/agreementText";

interface AgreementFullTextProps {
  show: boolean;
  onClose: () => void;
}

export default function AgreementFullText({ show, onClose }: AgreementFullTextProps) {
  if (!show) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          zIndex: 300,
        }}
      />

      {/* Sheet */}
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
          zIndex: 301,
          maxHeight: "88dvh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Drag handle */}
        <div
          style={{
            width: 40,
            height: 4,
            background: "#EAE4D8",
            borderRadius: 2,
            margin: "12px auto 0",
            flexShrink: 0,
          }}
        />

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 20px 0",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "#3D2E1F",
              fontFamily: "inherit",
            }}
          >
            Договор поставщика Zeren
          </span>
          <button
            onClick={onClose}
            style={{
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 18,
              color: "#9A9490",
              fontFamily: "inherit",
              flexShrink: 0,
            }}
            aria-label="Закрыть"
          >
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <div
          style={{
            overflowY: "auto",
            flex: 1,
            padding: "0 20px 32px",
            scrollbarWidth: "none",
          }}
        >
          <p
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#3D2E1F",
              textAlign: "center",
              margin: "16px 0",
              fontFamily: "inherit",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            ДОГОВОР ПОСТАВЩИКА ZEREN SAUDA
          </p>

          {AGREEMENT_SECTIONS.map((section) => (
            <div key={section.number}>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#3D2E1F",
                  marginTop: 20,
                  marginBottom: 0,
                  fontFamily: "inherit",
                }}
              >
                {section.number}. {section.title}
              </p>
              <p
                style={{
                  fontSize: 14,
                  color: "#555",
                  lineHeight: 1.6,
                  marginTop: 6,
                  marginBottom: 0,
                  fontFamily: "inherit",
                }}
              >
                {section.body}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            flexShrink: 0,
            padding: "0 20px 24px",
          }}
        >
          <button
            onClick={onClose}
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
            }}
          >
            Закрыть
          </button>
        </div>
      </div>
    </>
  );
}
