"use client";

interface ConfettiProps {
  active: boolean;
  /** false のとき 1 周で終わるバースト（正解演出向け） */
  loop?: boolean;
  className?: string;
}

const COLORS = [
  "var(--pop-streak)",
  "var(--pop-accent)",
  "var(--pop-correct)",
  "var(--pop-sky)",
  "var(--pop-pink)",
];

/**
 * Pop 風ミックス紙吹雪（丸・角・短冊）
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
      {Array.from({ length: 36 }).map((_, i) => {
        const kind = i % 4;
        const bg = COLORS[i % COLORS.length];
        const base = {
          left: `${(i * 37) % 100}%`,
          top: "-12px",
          animationDelay: `${(i % 8) * 0.08}s`,
        } as const;
        if (kind === 0) {
          return (
            <span
              key={i}
              className={
                loop
                  ? "absolute h-3 w-3 rounded-full border-2 border-black opacity-95"
                  : "absolute h-3 w-3 animate-confetti-fall rounded-full border-2 border-black opacity-95"
              }
              style={{
                ...base,
                background: bg,
                ...(loop
                  ? {
                      animation: "confetti-fall 2.4s linear infinite",
                      animationDelay: `${(i % 8) * 0.08}s`,
                    }
                  : {}),
              }}
            />
          );
        }
        if (kind === 1) {
          return (
            <span
              key={i}
              className={
                loop
                  ? "absolute h-2.5 w-4 rounded-sm border-2 border-black opacity-95"
                  : "absolute h-2.5 w-4 animate-confetti-fall rounded-sm border-2 border-black opacity-95"
              }
              style={{
                ...base,
                background: bg,
                transform: `rotate(${i * 17}deg)`,
                ...(loop
                  ? {
                      animation: "confetti-fall 2.4s linear infinite",
                      animationDelay: `${(i % 8) * 0.08}s`,
                    }
                  : {}),
              }}
            />
          );
        }
        return (
          <span
            key={i}
            className={
              loop
                ? "absolute h-3 w-3 opacity-95"
                : "absolute h-3 w-3 animate-confetti-fall opacity-95"
            }
            style={{
              ...base,
              background: bg,
              border: "2px solid #000",
              borderRadius: kind === 2 ? "4px" : "50%",
              transform: `rotate(${i * 23}deg)`,
              ...(loop
                ? {
                    animation: "confetti-fall 2.4s linear infinite",
                    animationDelay: `${(i % 8) * 0.08}s`,
                  }
                : {}),
            }}
          />
        );
      })}
    </div>
  );
}
