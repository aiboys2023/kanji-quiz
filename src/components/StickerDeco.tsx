"use client";

import { useMemo } from "react";

interface StickerDecoProps {
  /** ステッカー個数 */
  count?: number;
  /** @deprecated `count` と同じ（設定画面互換） */
  density?: number;
  className?: string;
}

/**
 * ランダム配置の SVG 装飾（星・ハート・スマイリー）
 */
export default function StickerDeco({
  count = 14,
  density,
  className = "",
}: StickerDecoProps) {
  const n = density ?? count;
  const items = useMemo(() => {
    const palette = ["#FF6B9D", "#FFD93D", "#6BCB77", "#4D96FF", "#FF8C42"];
    return Array.from({ length: n }, (_, i) => {
      const seed = (i * 9301 + 49297) % 233280;
      return {
        id: i,
        kind: (i % 3) as 0 | 1 | 2,
        x: (seed % 88) + 6,
        y: ((seed * 7) % 78) + 8,
        rot: (seed * 13) % 360,
        fill: palette[seed % palette.length],
        s: 0.28 + (seed % 5) * 0.04,
      };
    });
  }, [n]);

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-0 overflow-hidden ${className}`}
      aria-hidden
    >
      <svg
        className="w-full h-full opacity-30"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {items.map((it) => (
          <g
            key={it.id}
            transform={`translate(${it.x} ${it.y}) rotate(${it.rot}) scale(${it.s})`}
          >
            {it.kind === 0 && (
              <polygon
                points="0,-10 3,-3 10,-3 4,4 6,12 0,8 -6,12 -4,4 -10,-3 -3,-3"
                fill={it.fill}
                stroke="#1a1a2e"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            )}
            {it.kind === 1 && (
              <path
                d="M0,2 C-4,-3 -10,-2 -10,4 C-10,9 -2,14 0,18 C2,14 10,9 10,4 C10,-2 4,-3 0,2Z"
                fill={it.fill}
                stroke="#1a1a2e"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            )}
            {it.kind === 2 && (
              <g>
                <circle r="12" cx="0" cy="0" fill="#FFD93D" stroke="#1a1a2e" strokeWidth="1.5" />
                <circle cx="-4" cy="-2" r="2" fill="#1a1a2e" />
                <circle cx="4" cy="-2" r="2" fill="#1a1a2e" />
                <path
                  d="M-6,6 Q0,11 6,6"
                  fill="none"
                  stroke="#1a1a2e"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </g>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
