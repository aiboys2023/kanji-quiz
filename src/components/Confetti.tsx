"use client";

interface ConfettiProps {
  active: boolean;
  /** false のとき 1 周で終わるバースト（正解演出向け） */
  loop?: boolean;
  className?: string;
}

const COLORS = ["#FF6B9D", "#FFD93D", "#6BCB77", "#4D96FF", "#9B59B6", "#FF8C42"];

/**
 * 紙吹雪（globals の confetti-fall / 任意で無限ループ）
 */
export default function Confetti({
  active,
  loop = true,
  className = "",
}: ConfettiProps) {
  if (!active) return null;

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-50 overflow-hidden ${className}`}
      aria-hidden
    >
      {Array.from({ length: 32 }).map((_, i) => (
        <span
          key={i}
          className={
            loop
              ? "absolute w-2 h-3 rounded-sm opacity-90"
              : "absolute w-2 h-3 rounded-sm opacity-90 animate-confetti-fall"
          }
          style={{
            left: `${(i * 37) % 100}%`,
            top: "-12px",
            backgroundColor: COLORS[i % COLORS.length],
            animationDelay: `${(i % 8) * 0.08}s`,
            transform: `rotate(${i * 17}deg)`,
            ...(loop
              ? {
                  animation: "confetti-fall 2.4s linear infinite",
                  animationDelay: `${(i % 8) * 0.08}s`,
                }
              : {}),
          }}
        />
      ))}
    </div>
  );
}
