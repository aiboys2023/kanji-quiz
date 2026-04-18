"use client";

import { isSuperMode, streakFireCount } from "@/hooks/useStreak";

interface Props {
  streak: number;
  className?: string;
}

/** Pop バッジ：🔥連続数（3/5/10 で追加の炎） */
export default function StreakCounter({ streak, className = "" }: Props) {
  const fires = streakFireCount(streak);
  const superM = isSuperMode(streak);
  const particles = streak >= 5;

  if (streak <= 0) {
    return null;
  }

  return (
    <div
      className={`relative flex min-h-12 shrink-0 items-center gap-0.5 rounded-2xl border-[2.5px] border-black bg-[var(--pop-streak)] px-2.5 py-1.5 text-black shadow-[2px_2px_0_#000] ${className}`}
      aria-live="polite"
    >
      <span className="text-sm font-black" aria-hidden>
        🔥
      </span>
      <span className="text-[1.05rem] font-black tabular-nums">{streak}</span>
      {fires > 1 && (
        <span className="text-xs font-black" aria-hidden>
          {"🔥".repeat(fires - 1)}
        </span>
      )}
      {superM && (
        <span className="text-base" aria-hidden>
          ⚡
        </span>
      )}
      {particles && (
        <span
          className="pointer-events-none absolute inset-0 overflow-visible"
          aria-hidden
        >
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className="absolute animate-streak-particle text-sm"
              style={{
                left: `${10 + i * 14}%`,
                top: "20%",
                ["--tx" as string]: `${(i % 3) * 14 - 14}px`,
                ["--ty" as string]: `${-18 - (i % 4) * 6}px`,
                animationDelay: `${i * 0.07}s`,
              }}
            >
              ✨
            </span>
          ))}
        </span>
      )}
    </div>
  );
}
