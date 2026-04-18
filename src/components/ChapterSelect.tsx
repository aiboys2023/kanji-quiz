"use client";

interface Props {
  counts: Record<number, number>;
  selected: Set<number>;
  onToggle: (chapter: number) => void;
  onToggleAll: () => void;
}

export default function ChapterSelect({
  counts,
  selected,
  onToggle,
  onToggleAll,
}: Props) {
  const allSelected = [...Array(18)].every((_, i) => selected.has(i + 1));

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-[1.2rem] font-black">章を選ぶ（複数可）</h2>
        <button
          type="button"
          onClick={onToggleAll}
          className="retro-btn rounded-xl px-4 py-2 min-h-12 bg-purple text-white text-[1rem] font-bold"
        >
          {allSelected ? "ぜんぶはずす" : "ぜんぶえらぶ"}
        </button>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[50vh] overflow-y-auto pr-1">
        {Array.from({ length: 18 }, (_, i) => i + 1).map((ch) => {
          const on = selected.has(ch);
          const n = counts[ch] ?? 0;
          return (
            <li key={ch}>
              <button
                type="button"
                onClick={() => onToggle(ch)}
                aria-pressed={on}
                className={`w-full text-left retro-btn rounded-xl px-4 py-3 min-h-12 flex justify-between items-center gap-2 text-[1.05rem] font-bold ${
                  on ? "bg-green text-white" : "bg-white"
                }`}
              >
                <span>第{ch}章</span>
                <span className="text-[0.95rem] opacity-90">{n}問</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
