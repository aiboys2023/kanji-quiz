"use client";

import { cn } from "@/lib/cn";

interface TimerProps {
  /** 残り秒 */
  remaining: number;
  /** 1 問あたりの最大秒（全幅） */
  total: number;
  active?: boolean;
  /** false のとき秒数テキストを隠す（レイアウト都合） */
  showRemainingLabel?: boolean;
  className?: string;
}

/**
 * 横型プログレス（Pop：タイマー帯が縮む）
 */
export default function Timer({
  remaining,
  total,
  active = true,
  showRemainingLabel = true,
  className,
}: TimerProps) {
  const t = total > 0 ? Math.max(0, Math.min(1, remaining / total)) : 0;
  const pct = t * 100;
  const warn = t <= 0.25 && t > 0;

  return (
    <div
      className={cn("w-full min-w-[8rem]", !active && "opacity-40", className)}
      aria-label={`残り ${Math.max(0, Math.ceil(remaining))} 秒（${total} 秒制限）`}
    >
      <div className="pop-timer-track">
        <div
          className="h-full rounded-sm transition-[width] duration-300 ease-linear"
          style={{
            width: `${pct}%`,
            backgroundColor: warn ? "var(--pop-wrong)" : "var(--pop-accent)",
          }}
        />
      </div>
      {showRemainingLabel && (
        <div className="mt-1 text-right text-xs font-black tabular-nums text-black">
          {Math.max(0, Math.ceil(remaining))}s
        </div>
      )}
    </div>
  );
}
