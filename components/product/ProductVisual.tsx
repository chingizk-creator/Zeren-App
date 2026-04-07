"use client";

import { useEffect, useRef, useState } from "react";

interface ProductVisualProps {
  emoji: string;
  colorPalette: string[];
  size?: number;
  animate?: boolean;
  borderRadius?: number;
}

export default function ProductVisual({
  emoji,
  colorPalette,
  size = 72,
  animate = true,
  borderRadius = 14,
}: ProductVisualProps) {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!containerRef.current || !animate) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [animate]);

  const shouldAnimate = animate && inView && mounted;

  const [c1, c2, c3] = [
    colorPalette[0] ?? "#D4853A",
    colorPalette[1] ?? "#C8A96E",
    colorPalette[2] ?? "#FAF7F0",
  ];

  const glowRingStyle = shouldAnimate
    ? {
        position: "absolute" as const,
        inset: -4,
        borderRadius: borderRadius + 4,
        background: `conic-gradient(from 0deg, ${c1}44, ${c2}88, ${c3}44, ${c1}44)`,
        animation: "glow-ring-spin 4s linear infinite",
        zIndex: 0,
      }
    : {
        position: "absolute" as const,
        inset: -4,
        borderRadius: borderRadius + 4,
        background: `${c1}22`,
        zIndex: 0,
      };

  const emojiStyle = shouldAnimate
    ? {
        animation: "breathe 3s ease-in-out infinite",
        fontSize: size * 0.52,
        display: "block",
        lineHeight: 1,
        position: "relative" as const,
        zIndex: 2,
        userSelect: "none" as const,
      }
    : {
        fontSize: size * 0.52,
        display: "block",
        lineHeight: 1,
        position: "relative" as const,
        zIndex: 2,
        userSelect: "none" as const,
      };

  const dropStyle = shouldAnimate
    ? {
        position: "absolute" as const,
        bottom: 6,
        right: 8,
        fontSize: 9,
        animation: "float-drop 2.2s ease-in-out infinite",
        zIndex: 3,
        userSelect: "none" as const,
      }
    : { display: "none" };

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: size,
        height: size,
        flexShrink: 0,
      }}
    >
      {/* Glow ring */}
      <div style={glowRingStyle} aria-hidden="true" />

      {/* Main container */}
      <div
        style={{
          position: "relative",
          width: size,
          height: size,
          borderRadius,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
          background: `radial-gradient(circle at 50% 50%, ${c3}cc 0%, ${c2}55 60%, ${c1}33 100%)`,
        }}
      >
        <span style={emojiStyle} aria-hidden="true">
          {emoji}
        </span>
        {/* Water droplet */}
        <span style={dropStyle} aria-hidden="true">💧</span>
        {/* LIVE badge */}
        {shouldAnimate && (
          <div
            style={{
              position: "absolute",
              bottom: 5,
              left: 5,
              background: "rgba(0,0,0,0.55)",
              borderRadius: 6,
              padding: "2px 5px",
              display: "flex",
              alignItems: "center",
              gap: 3,
              zIndex: 4,
            }}
            aria-hidden="true"
          >
            <div
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "#4ADE80",
                animation: "pulse-dot 1.8s ease-in-out infinite",
              }}
            />
            <span
              style={{
                fontSize: 7,
                fontWeight: 700,
                color: "#4ADE80",
                letterSpacing: 0.5,
              }}
            >
              LIVE
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
