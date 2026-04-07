"use client";

import { useState, useEffect, useCallback } from "react";
import { useSauda } from "@/sauda/context/SaudaContext";
import { formatPrice, formatPriceFull, type Order } from "@/sauda/data/mock";

// ─── Timer ────────────────────────────────────────────────────────────────────

function Timer({ expiresAt, onExpire }: { expiresAt: string; onExpire: () => void }) {
  const [secondsLeft, setSecondsLeft] = useState(() =>
    Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000))
  );

  useEffect(() => {
    if (secondsLeft <= 0) {
      onExpire();
      return;
    }
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(interval);
          onExpire();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expiresAt]);

  const minutes = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const timeStr = `${minutes}:${String(secs).padStart(2, "0")}`;

  let color: string;
  let bgColor: string;
  if (secondsLeft > 60) {
    color = "#4A8B3A";
    bgColor = "rgba(74,139,58,0.1)";
  } else if (secondsLeft > 30) {
    color = "#FF8C00";
    bgColor = "rgba(255,140,0,0.1)";
  } else {
    color = "#C0392B";
    bgColor = "rgba(192,57,43,0.1)";
  }

  return (
    <span
      style={{
        display: "inline-block",
        borderRadius: 20,
        padding: "4px 10px",
        fontSize: 12,
        fontWeight: 700,
        marginTop: 6,
        color,
        backgroundColor: bgColor,
      }}
    >
      Осталось {timeStr}
    </span>
  );
}

// ─── OrderCard ────────────────────────────────────────────────────────────────

interface OrderCardProps {
  order: Order;
  onAccept: () => void;
  onNegotiate: () => void;
  onReject: () => void;
  onExpire: () => void;
}

function OrderCard({ order, onAccept, onNegotiate, onReject, onExpire }: OrderCardProps) {
  const { isSelectOrder, emoji, product, quantity, unit, zerenOfferPrice, vendorRetailPrice } = order;

  const pct = Math.round((1 - zerenOfferPrice / vendorRetailPrice) * 100);

  let discountColor: string;
  let discountBg: string;
  if (pct > 20) {
    discountColor = "#C0392B";
    discountBg = "rgba(192,57,43,0.1)";
  } else if (pct >= 10) {
    discountColor = "#C8A96E";
    discountBg = "rgba(200,169,110,0.1)";
  } else {
    discountColor = "#4A8B3A";
    discountBg = "rgba(74,139,58,0.1)";
  }

  return (
    <div
      style={{
        background: "white",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        border: isSelectOrder ? "2px solid #C8A96E" : "1px solid #EAE4D8",
        position: "relative",
      }}
    >
      {isSelectOrder && (
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "rgba(200,169,110,0.15)",
            border: "1px solid rgba(200,169,110,0.3)",
            borderRadius: 8,
            padding: "3px 8px",
            fontSize: 10,
            color: "#C8A96E",
            fontWeight: 700,
          }}
        >
          ⭐ SELECT
        </div>
      )}

      {/* Top row */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <span style={{ fontSize: 24 }}>{emoji}</span>
        <span
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "#3D2E1F",
            marginLeft: 8,
          }}
        >
          {product}
        </span>
        <span
          style={{
            fontSize: 14,
            color: "#9A9490",
            marginLeft: 4,
          }}
        >
          {quantity} {unit}
        </span>
      </div>

      {/* Zeren offer */}
      <div
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: "#D4853A",
          marginTop: 4,
        }}
      >
        Предложение Zeren: ₸{zerenOfferPrice}/кг
      </div>

      {/* Info row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 6,
        }}
      >
        <span style={{ fontSize: 12, color: "#9A9490" }}>
          Ваша цена: ₸{vendorRetailPrice}/кг
        </span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: discountColor,
            backgroundColor: discountBg,
            borderRadius: 20,
            padding: "3px 8px",
          }}
        >
          −{pct}% от вашей цены
        </span>
      </div>

      {/* Total */}
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          marginTop: 4,
          color: "#3D2E1F",
        }}
      >
        Итого: {formatPriceFull(zerenOfferPrice * quantity)}
      </div>

      {/* Timer */}
      <Timer expiresAt={order.expiresAt} onExpire={onExpire} />

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button
          onClick={onAccept}
          style={{
            background: "#4A8B3A",
            color: "white",
            flex: 1,
            height: 52,
            borderRadius: 12,
            fontSize: 13,
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          ✓ Принять ₸{zerenOfferPrice}
        </button>
        <button
          onClick={onNegotiate}
          style={{
            background: "#C8A96E",
            color: "#3D2E1F",
            flex: 1,
            height: 52,
            borderRadius: 12,
            fontSize: 13,
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          ↕ Торговаться
        </button>
      </div>

      {/* Reject */}
      <button
        onClick={onReject}
        style={{
          fontSize: 11,
          color: "#C0392B",
          textAlign: "center",
          marginTop: 6,
          cursor: "pointer",
          display: "block",
          background: "none",
          border: "none",
          fontFamily: "inherit",
          padding: 4,
          width: "100%",
        }}
      >
        ✕ Отклонить
      </button>
    </div>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function OrdersScreen() {
  const {
    state,
    acceptOrder,
    openNegotiation,
    rejectOrder,
    expireOrder,
    todayRevenue,
    todayVolume,
    todayOrderCount,
    todayAvgPrice,
  } = useSauda();

  const { pendingOrders, completedOrders } = state;

  const completedToday = completedOrders
    .filter((o) => o.status !== "expired")
    .slice(0, 5);

  const handleAccept = useCallback(
    (orderId: string) => {
      acceptOrder(orderId);
    },
    [acceptOrder]
  );

  const handleNegotiate = useCallback(
    (order: Order) => {
      openNegotiation(order);
    },
    [openNegotiation]
  );

  const handleReject = useCallback(
    (orderId: string) => {
      rejectOrder(orderId);
    },
    [rejectOrder]
  );

  const handleExpire = useCallback(
    (orderId: string) => {
      expireOrder(orderId);
    },
    [expireOrder]
  );

  function getStatusIcon(order: Order): { icon: string; color: string } {
    if (order.status === "rejected") return { icon: "✗", color: "#C0392B" };
    if (order.status === "expired") return { icon: "⏰", color: "#9A9490" };
    if (order.status === "completed" && order.negotiationRound > 0)
      return { icon: "↕", color: "#C8A96E" };
    return { icon: "✓", color: "#4A8B3A" };
  }

  const statLabelStyle: React.CSSProperties = {
    fontSize: 9,
    fontWeight: 600,
    color: "#9A9490",
    textTransform: "uppercase",
    letterSpacing: 1,
  };

  const statValueStyle: React.CSSProperties = {
    fontSize: 18,
    fontWeight: 700,
    fontFamily: "Georgia, serif",
    color: "#3D2E1F",
  };

  const statSubStyle: React.CSSProperties = {
    fontSize: 10,
    color: "#9A9490",
    marginTop: 2,
  };

  return (
    <div style={{ paddingBottom: 80, overflowY: "auto" }}>
      {/* Section 1: Summary bar */}
      <div
        style={{
          display: "flex",
          gap: 8,
          padding: "12px 16px",
        }}
      >
        {/* Заказов */}
        <div
          style={{
            background: "white",
            borderRadius: 12,
            padding: "10px 8px",
            textAlign: "center",
            flex: 1,
            border: "1px solid #EAE4D8",
          }}
        >
          <div style={statLabelStyle}>Заказов</div>
          <div style={statValueStyle}>
            {todayOrderCount} из {todayOrderCount + pendingOrders.length}
          </div>
          <div style={statSubStyle}>сегодня</div>
        </div>

        {/* Объём */}
        <div
          style={{
            background: "white",
            borderRadius: 12,
            padding: "10px 8px",
            textAlign: "center",
            flex: 1,
            border: "1px solid #EAE4D8",
          }}
        >
          <div style={statLabelStyle}>Объём</div>
          <div style={statValueStyle}>{todayVolume} кг</div>
          <div style={statSubStyle}>продано</div>
        </div>

        {/* Доход */}
        <div
          style={{
            background: "white",
            borderRadius: 12,
            padding: "10px 8px",
            textAlign: "center",
            flex: 1,
            border: "1px solid #EAE4D8",
          }}
        >
          <div style={statLabelStyle}>Доход</div>
          <div style={statValueStyle}>{formatPrice(todayRevenue)}</div>
          <div style={statSubStyle}>₸{todayAvgPrice}/кг avg</div>
        </div>
      </div>

      {/* Section 2: Pending orders */}
      <div style={{ padding: "0 16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#3D2E1F",
            }}
          >
            Новые заказы
          </span>
          <span
            style={{
              background: "#D4853A",
              borderRadius: 12,
              padding: "2px 8px",
              color: "white",
              fontSize: 11,
              fontWeight: 700,
              marginLeft: 8,
            }}
          >
            {pendingOrders.length}
          </span>
        </div>

        {pendingOrders.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "32px 0",
            }}
          >
            <div style={{ fontSize: 48 }}>🦌</div>
            <div
              style={{
                fontSize: 14,
                color: "#9A9490",
                marginTop: 8,
              }}
            >
              Пока нет заказов. Заказы приходят с 6:00 до 14:00.
            </div>
          </div>
        ) : (
          pendingOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onAccept={() => handleAccept(order.id)}
              onNegotiate={() => handleNegotiate(order)}
              onReject={() => handleReject(order.id)}
              onExpire={() => handleExpire(order.id)}
            />
          ))
        )}
      </div>

      {/* Section 3: Completed today */}
      <div style={{ padding: "0 16px", marginTop: 8 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "#3D2E1F",
            marginBottom: 4,
          }}
        >
          Выполненные сегодня
        </div>

        {completedToday.map((order) => {
          const { icon, color } = getStatusIcon(order);
          return (
            <div
              key={order.id}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 0",
                borderBottom: "1px solid #EAE4D8",
              }}
            >
              {/* Left */}
              <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
                <span style={{ fontSize: 18 }}>{order.emoji}</span>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#3D2E1F",
                    marginLeft: 6,
                  }}
                >
                  {order.product}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: "#9A9490",
                    marginLeft: 4,
                  }}
                >
                  {order.quantity} {order.unit}
                </span>
              </div>

              {/* Right */}
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#3D2E1F",
                  }}
                >
                  {order.finalPrice != null ? `₸${order.finalPrice}` : "—"}/кг
                </span>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color,
                  }}
                >
                  {icon}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
