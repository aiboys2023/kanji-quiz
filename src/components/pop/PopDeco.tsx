"use client";

import type { CSSProperties } from "react";

/** 8-point burst star (Pop sticker aesthetic) */
export function BurstShape({
  size = 60,
  color = "var(--pop-streak)",
  text,
  rotate = -10,
  className = "",
  style,
}: {
  size?: number;
  color?: string;
  text?: string;
  rotate?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const points = 16;
  const pts: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? 50 : 35;
    const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    pts.push(`${50 + Math.cos(a) * r},${50 + Math.sin(a) * r}`);
  }
  return (
    <div
      className={`relative shrink-0 ${className}`}
      style={{ width: size, height: size, transform: `rotate(${rotate}deg)`, ...style }}
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className="overflow-visible"
        aria-hidden
      >
        <polygon
          points={pts.join(" ")}
          fill={color}
          stroke="#000"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </svg>
      {text ? (
        <div
          className="absolute inset-0 flex items-center justify-center text-center font-black leading-none text-black"
          style={{ fontSize: size * 0.22 }}
        >
          {text}
        </div>
      ) : null}
    </div>
  );
}

export function PopFlower({
  size = 40,
  color = "var(--pop-accent)",
  center = "var(--pop-streak)",
  rotate = 0,
  className = "",
}: {
  size?: number;
  color?: string;
  center?: string;
  rotate?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      className={`shrink-0 ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
      aria-hidden
    >
      <g stroke="#000" strokeWidth="2.5" strokeLinejoin="round">
        <circle cx="30" cy="10" r="9" fill={color} />
        <circle cx="50" cy="30" r="9" fill={color} />
        <circle cx="30" cy="50" r="9" fill={color} />
        <circle cx="10" cy="30" r="9" fill={color} />
        <circle cx="30" cy="30" r="8" fill={center} />
      </g>
    </svg>
  );
}

export function PopSquiggle({
  width = 80,
  color = "#000",
  className = "",
}: {
  width?: number;
  color?: string;
  className?: string;
}) {
  return (
    <svg
      width={width}
      height={14}
      viewBox="0 0 80 14"
      className={className}
      aria-hidden
    >
      <path
        d="M2 7 Q 12 -2, 22 7 T 42 7 T 62 7 T 78 7"
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function HalftoneStrip({
  color = "#000",
  height = 12,
  width: w = "100%",
  className = "",
  style,
}: {
  color?: string;
  height?: number;
  width?: string | number;
  className?: string;
  style?: CSSProperties;
}) {
  const bg = `radial-gradient(circle, ${color} 22%, transparent 24%)`;
  return (
    <div
      className={className}
      style={{
        width: w,
        height,
        backgroundImage: bg,
        backgroundSize: `${height}px ${height}px`,
        ...style,
      }}
      aria-hidden
    />
  );
}
