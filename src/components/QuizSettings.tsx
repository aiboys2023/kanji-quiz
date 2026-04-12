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
  { value: 10, label: "10問" },
  { value: 20, label: "20問" },
  { value: 50, label: "50問" },
  { value: "all", label: "全問" },
];

export default function QuizSettings({
  count,
  onCount,
  timerOn,
  onTimer,
  maxAvailable,
}: Props) {
  return (
    <div className="space-y-4">
      <fieldset>
        <legend className="text-[1.2rem] font-black mb-2">もんだいすう</legend>
        <div className="flex flex-wrap gap-2">
          {OPTIONS.map((o) => (
            <label
              key={String(o.value)}
              className={`retro-btn rounded-xl px-4 py-3 min-h-12 cursor-pointer flex items-center gap-2 ${
                count === o.value ? "bg-yellow" : "bg-white"
              }`}
            >
              <input
                type="radio"
                className="sr-only"
                checked={count === o.value}
                onChange={() => onCount(o.value)}
              />
              <span className="text-[1.05rem] font-bold">{o.label}</span>
            </label>
          ))}
        </div>
        <p className="text-[0.9rem] mt-2 opacity-80">
          えらんだ章のもんだい：最大 {maxAvailable} 問
        </p>
      </fieldset>

      <fieldset>
        <legend className="text-[1.2rem] font-black mb-2">タイマー（1問15秒）</legend>
        <div className="flex gap-2">
          <label
            className={`retro-btn rounded-xl px-4 py-3 min-h-12 cursor-pointer font-bold ${
              timerOn ? "bg-orange text-white" : "bg-white"
            }`}
          >
            <input
              type="radio"
              className="sr-only"
              checked={timerOn}
              onChange={() => onTimer(true)}
            />
            ON
          </label>
          <label
            className={`retro-btn rounded-xl px-4 py-3 min-h-12 cursor-pointer font-bold ${
              !timerOn ? "bg-blue text-white" : "bg-white"
            }`}
          >
            <input
              type="radio"
              className="sr-only"
              checked={!timerOn}
              onChange={() => onTimer(false)}
            />
            OFF
          </label>
        </div>
      </fieldset>
    </div>
  );
}
