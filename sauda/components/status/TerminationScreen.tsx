"use client";

interface Props {
  reason?: string;
}

export default function TerminationScreen({ reason }: Props) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#3D2E1F",
        zIndex: 600,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 56 }}>🚫</div>

      <div
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: "white",
          marginTop: 20,
        }}
      >
        Аккаунт закрыт
      </div>

      <div
        style={{
          fontSize: 15,
          color: "rgba(255,255,255,0.8)",
          marginTop: 12,
          lineHeight: 1.6,
        }}
      >
        {reason || "Ваше сотрудничество с Zeren Sauda завершено."}
      </div>

      <div
        style={{
          fontSize: 14,
          color: "rgba(255,255,255,0.7)",
          marginTop: 8,
        }}
      >
        Невыплаченные суммы будут перечислены в течение 5 рабочих дней.
      </div>

      <div style={{ height: 20 }} />

      <div
        style={{
          borderRadius: 16,
          padding: 20,
          background: "white",
          width: "100%",
          maxWidth: 320,
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#3D2E1F",
          }}
        >
          📞 Поддержка
        </div>
        <div
          style={{
            fontSize: 16,
            color: "#D4853A",
            marginTop: 6,
          }}
        >
          +7 700 000 0000
        </div>
        <div
          style={{
            fontSize: 14,
            color: "#9A9490",
            marginTop: 4,
          }}
        >
          support@zeren.kz
        </div>
      </div>

      <div style={{ height: 16 }} />

      <div
        style={{
          fontSize: 12,
          color: "rgba(255,255,255,0.5)",
          lineHeight: 1.5,
          maxWidth: 320,
        }}
      >
        После 30 дней ваши персональные данные будут удалены в соответствии с Законом РК №94-V.
      </div>
    </div>
  );
}
