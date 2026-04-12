"use client";

import { isSuperMode, streakFireCount } from "@/hooks/useStreak";

interface Props {
  streak: number;
  className?: string;
}

/** 5連続以上でパーティクル（✨） */
export default function StreakCounter({ streak, className = "" }: Props) {
  const fires = streakFireCount(streak);
  const superM = isSuperMode(streak);
  const particles = streak >= 5;

  return (
    <div
      className={`relative sticker-sm rounded-xl bg-yellow px-2 py-1.5 flex items-center gap-1 min-h-12 ${className}`}
      aria-live="polite"
    >
      <span className="text-[1rem] font-bold text-foreground whitespace-nowrap">
        連続
      </span>
      <span className="text-[1.2rem] font-black tabular-nums">{streak}</span>
      {fires > 0 && (
        <span className="text-lg" aria-hidden>
          {"🔥".repeat(fires)}
        </span>
      )}
      {superM && <span className="text-xl">😼</span>}
      {particles && (
        <span className="pointer-events-none absolute inset-0 overflow-visible" aria-hidden>
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className="absolute text-sm animate-streak-particle"
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
