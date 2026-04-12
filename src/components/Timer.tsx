"use client";

import { cn } from "@/lib/cn";

interface TimerProps {
  /** 残り秒 */
  remaining: number;
  /** 1 問あたりの最大秒（円の全周） */
  total: number;
  active?: boolean;
  className?: string;
}

/**
 * 円形プログレス付きカウントダウン表示
 */
export default function Timer({
  remaining,
  total,
  active = true,
  className,
}: TimerProps) {
  const r = 36;
  const c = 2 * Math.PI * r;
  const t = total > 0 ? Math.max(0, Math.min(1, remaining / total)) : 0;
  const offset = c * (1 - t);

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center w-[5.5rem]",
        !active && "opacity-40",
        className
      )}
      role="timer"
      aria-valuenow={Math.ceil(remaining)}
      aria-valuemin={0}
      aria-valuemax={total}
    >
      <svg
        viewBox="0 0 88 88"
        className="w-full -rotate-90"
        aria-hidden
      >
        <circle
          cx="44"
          cy="44"
          r={r}
          fill="none"
          stroke="#e8e0d5"
          strokeWidth="8"
        />
        <circle
          cx="44"
          cy="44"
          r={r}
          fill="none"
          stroke="#FF8C42"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700 ease-linear"
        />
      </svg>
      <span className="absolute text-xl font-black tabular-nums text-[#1a1a2e]">
        {Math.max(0, Math.ceil(remaining))}
      </span>
    </div>
  );
}
