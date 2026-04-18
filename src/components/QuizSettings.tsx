"use client";

export type QuizCount = 10 | 20 | 50 | "all";

interface Props {
  count: QuizCount;
  onCount: (c: QuizCount) => void;
  timerOn: boolean;
  onTimer: (on: boolean) => void;
  maxAvailable: number;
}

const OPTIONS: { value: QuizCount; label: string }[] = [
  { value: 10, label: "10" },
  { value: 20, label: "20" },
  { value: 50, label: "50" },
  { value: "all", label: "ALL" },
];

export default function QuizSettings({
  count,
  onCount,
  timerOn,
  onTimer,
  maxAvailable,
}: Props) {
  return (
    <div className="space-y-5">
      <div>
        <div className="mb-2 flex items-center justify-between px-1">
          <span className="text-[11px] font-black tracking-[0.12em] text-black">
            ● 問題数 COUNT
          </span>
          <span className="text-[10px] font-bold text-black">
            合計 {maxAvailable}問
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {OPTIONS.map((o) => {
            const on = count === o.value;
            return (
              <button
                key={String(o.value)}
                type="button"
                onClick={() => onCount(o.value)}
                className={`min-h-14 rounded-2xl border-[3px] border-black text-lg font-black text-black transition-transform ${
                  on
                    ? "translate-x-0.5 translate-y-0.5 bg-[var(--pop-accent)] text-white shadow-[2px_2px_0_#000]"
                    : "bg-white shadow-[4px_4px_0_#000] active:translate-x-0.5 active:translate-y-0.5"
                }`}
              >
                {o.label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        className={`pop-card flex items-center gap-3 rounded-2xl p-3.5 ${
          timerOn ? "bg-[var(--pop-pink)]" : "bg-white"
        }`}
      >
        <div className="min-w-0 flex-1">
          <div className="text-sm font-black text-black">⏱ 制限時間 15s</div>
          <div className="mt-0.5 text-[10px] font-bold text-black/70">
            時間切れは不正解
          </div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={timerOn}
          onClick={() => onTimer(!timerOn)}
          className="relative h-8 w-14 shrink-0 rounded-2xl border-[2.5px] border-black shadow-[2px_2px_0_#000]"
          style={{ background: timerOn ? "var(--pop-correct)" : "#fff" }}
        >
          <span
            className="absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-black transition-[left]"
            style={{ left: timerOn ? "1.55rem" : "0.125rem" }}
          />
        </button>
      </div>
    </div>
  );
}
