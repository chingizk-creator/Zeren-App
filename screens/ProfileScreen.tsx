"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useApp } from "@/context/AppContext";
import { SUBSCRIPTION_PLANS } from "@/data/subscriptions";
import { formatPrice } from "@/utils/formatPrice";
import AddressEntry from "@/components/auth/AddressEntry";

export default function ProfileScreen() {
  const { authState, logout, setUserSubscription } = useAuth();
  const { state } = useApp();
  const { user } = authState;
  const [showAddressEdit, setShowAddressEdit] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const maskedPhone = maskPhone(user.phone ?? "");
  const memberSince = formatMemberSince(user.memberSince);
  const activePlan = SUBSCRIPTION_PLANS.find((p) => p.id === user.subscriptionPlan) ?? SUBSCRIPTION_PLANS[1];
  const totalSavings = state.lifetimeSavings;

  return (
    <div className="screen" style={{ paddingBottom: 24 }}>
      {/* Profile hero */}
      <div
        style={{
          background: "#3D2E1F",
          padding: "20px 16px 24px",
          textAlign: "center",
        }}
      >
        {/* Avatar circle */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "rgba(200,169,110,0.2)",
            border: "2px solid rgba(200,169,110,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 10px",
            fontSize: 22,
          }}
          aria-hidden="true"
        >
          🦌
        </div>
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#C8A96E",
            marginBottom: 4,
            fontFamily: "Georgia, serif",
          }}
        >
          {maskedPhone}
        </div>
        <div style={{ fontSize: 11, color: "#E8D5A8" }}>
          {memberSince}
        </div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            marginTop: 10,
            background: `${activePlan.accentColor}22`,
            border: `1px solid ${activePlan.accentColor}44`,
            borderRadius: 20,
            padding: "4px 12px",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: activePlan.accentColor,
              display: "inline-block",
            }}
          />
          <span
            style={{ fontSize: 11, fontWeight: 600, color: activePlan.accentColor }}
          >
            {activePlan.name}
          </span>
        </div>
      </div>

      <div style={{ padding: "16px 16px 0", display: "flex", flexDirection: "column", gap: 12 }}>

        {/* Savings card */}
        <SectionCard>
          <SectionHeader title="Моя экономия" />
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: "#4A8B3A",
                fontFamily: "Georgia, serif",
              }}
            >
              {formatPrice(totalSavings)}
            </span>
            <span style={{ fontSize: 12, color: "#9A9490" }}>всего сэкономлено</span>
          </div>
          <div style={{ fontSize: 12, color: "#9A9490", marginTop: 4 }}>
            {state.orderHistory.length} заказов
          </div>
        </SectionCard>

        {/* Subscription card */}
        <SectionCard>
          <SectionHeader title="Подписка" />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#3D2E1F" }}>
                {activePlan.name}
              </div>
              <div style={{ fontSize: 13, color: "#9A9490" }}>
                {formatPrice(activePlan.price)}/мес ·{" "}
                {activePlan.deliveriesPerMonth === "unlimited"
                  ? "Безлимит"
                  : `${activePlan.deliveriesPerMonth} доставок`}
              </div>
            </div>
            <button
              style={{
                background: "none",
                border: `1.5px solid #D4853A`,
                borderRadius: 8,
                color: "#D4853A",
                fontSize: 12,
                fontWeight: 600,
                padding: "6px 12px",
                cursor: "pointer",
                fontFamily: "inherit",
                minHeight: "unset",
              }}
              onClick={() => {
                // Cycle through plans for demo
                const plans = SUBSCRIPTION_PLANS.map((p) => p.id);
                const idx = plans.indexOf(user.subscriptionPlan);
                setUserSubscription(plans[(idx + 1) % plans.length]);
              }}
            >
              Изменить
            </button>
          </div>
        </SectionCard>

        {/* Address card */}
        <SectionCard>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <SectionHeader title="Адрес доставки" />
            <button
              onClick={() => setShowAddressEdit(true)}
              style={{
                background: "none",
                border: "none",
                color: "#D4853A",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                padding: "0",
                minHeight: "unset",
                minWidth: "unset",
              }}
            >
              {user.address ? "Изменить" : "Добавить"}
            </button>
          </div>
          {user.address ? (
            <div>
              <div style={{ fontSize: 14, color: "#3D2E1F", fontWeight: 500 }}>
                {user.address.street}
                {user.address.apartment && `, ${user.address.apartment}`}
              </div>
              {user.address.entrance && (
                <div style={{ fontSize: 12, color: "#9A9490" }}>{user.address.entrance}</div>
              )}
              {user.address.comment && (
                <div style={{ fontSize: 12, color: "#9A9490" }}>{user.address.comment}</div>
              )}
            </div>
          ) : (
            <div style={{ fontSize: 13, color: "#C5C0B8" }}>Адрес не указан</div>
          )}
        </SectionCard>

        {/* Order history */}
        {state.orderHistory.length > 0 && (
          <SectionCard>
            <SectionHeader title="История заказов" />
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {state.orderHistory.slice(0, 4).map((order, idx) => (
                <div key={order.id}>
                  {idx > 0 && <div style={{ height: 1, background: "#EAE4D8" }} />}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "8px 0",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: "#3D2E1F" }}>
                        {order.date}
                      </div>
                      <div style={{ fontSize: 11, color: "#9A9490" }}>
                        {order.itemCount} товаров · {formatPrice(order.total)}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#4A8B3A" }}>
                        {formatPrice(order.savings)}
                      </div>
                      <div style={{ fontSize: 10, color: "#4A8B3A" }}>
                        −{order.savingsPercent}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {/* Settings */}
        <SectionCard>
          <SectionHeader title="Настройки" />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "#3D2E1F" }}>Язык / Тіл</span>
            <div
              style={{
                display: "flex",
                background: "#EAE4D8",
                borderRadius: 8,
                padding: 2,
                gap: 2,
              }}
            >
              {["RU", "KZ"].map((lang) => (
                <button
                  key={lang}
                  style={{
                    background: lang === "RU" ? "white" : "transparent",
                    border: "none",
                    borderRadius: 6,
                    padding: "4px 10px",
                    fontSize: 11,
                    fontWeight: 600,
                    color: lang === "RU" ? "#3D2E1F" : "#9A9490",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    minHeight: "unset",
                    minWidth: "unset",
                  }}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </SectionCard>

        {/* Logout */}
        {!showLogoutConfirm ? (
          <button
            onClick={() => setShowLogoutConfirm(true)}
            style={{
              background: "none",
              border: "1.5px solid #EAE4D8",
              borderRadius: 12,
              padding: "14px",
              fontSize: 14,
              color: "#9A9490",
              cursor: "pointer",
              fontFamily: "inherit",
              fontWeight: 500,
              width: "100%",
            }}
          >
            Выйти
          </button>
        ) : (
          <div
            style={{
              background: "white",
              border: "1.5px solid #EAE4D8",
              borderRadius: 12,
              padding: "14px 16px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 13, color: "#3D2E1F", marginBottom: 12 }}>
              Выйти из аккаунта?
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                style={{
                  flex: 1,
                  height: 40,
                  border: "1.5px solid #EAE4D8",
                  borderRadius: 10,
                  background: "none",
                  fontSize: 13,
                  color: "#9A9490",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Отмена
              </button>
              <button
                onClick={logout}
                style={{
                  flex: 1,
                  height: 40,
                  border: "none",
                  borderRadius: 10,
                  background: "#C0392B",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "white",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Выйти
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Address edit modal */}
      {showAddressEdit && (
        <div onClick={() => setShowAddressEdit(false)}>
          <AddressEntry />
        </div>
      )}
    </div>
  );
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: 16,
        border: "1px solid #EAE4D8",
        padding: "14px 16px",
      }}
    >
      {children}
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div
      style={{
        fontSize: 12,
        fontWeight: 600,
        color: "#9A9490",
        textTransform: "uppercase",
        letterSpacing: "0.8px",
        marginBottom: 10,
      }}
    >
      {title}
    </div>
  );
}

function maskPhone(phone: string): string {
  // "+77001234567" → "+7 700 *** **67"
  if (!phone || phone.length < 11) return phone;
  const d = phone.replace("+7", "");
  return `+7 ${d.slice(0, 3)} *** **${d.slice(8, 10)}`;
}

function formatMemberSince(iso: string | null): string {
  if (!iso) return "Участник Zeren";
  const date = new Date(iso);
  const month = date.toLocaleDateString("ru-RU", { month: "long", year: "numeric" });
  return `Участник с ${month}`;
}
