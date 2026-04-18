"use client";

import { CHAPTER_INFO } from "@/data/questions";

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
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <h2 className="whitespace-nowrap text-[11px] font-black tracking-[0.12em] text-black">
          ● 章 CHAPTER
        </h2>
        <button
          type="button"
          onClick={onToggleAll}
          className="min-h-12 min-w-[4.875rem] shrink-0 whitespace-nowrap rounded-xl border-2 border-black px-3 py-1.5 text-[11px] font-black shadow-[2px_2px_0_#000]"
          style={{
            background: allSelected ? "var(--pop-streak)" : "#fff",
          }}
        >
          {allSelected ? "ALL OFF" : "ALL ON"}
        </button>
      </div>
      <div className="pop-card rounded-2xl bg-white p-1.5">
        <ul className="grid max-h-[50vh] grid-cols-2 gap-1 overflow-y-auto pr-0.5">
          {CHAPTER_INFO.map(({ chapter, name }) => {
            const on = selected.has(chapter);
            const n = counts[chapter] ?? 0;
            return (
              <li key={chapter}>
                <button
                  type="button"
                  onClick={() => onToggle(chapter)}
                  aria-pressed={on}
                  className={`flex min-h-12 w-full items-center gap-2 rounded-xl border-2 px-2.5 py-2 text-left text-[0.95rem] font-bold transition-colors ${
                    on
                      ? "border-black bg-[var(--pop-streak)] text-black"
                      : "border-transparent bg-transparent text-black hover:border-black/20"
                  }`}
                >
                  <span
                    className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded border-2 border-black text-xs font-black ${
                      on ? "bg-black text-[var(--pop-streak)]" : "bg-white"
                    }`}
                  >
                    {on ? "✓" : ""}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-black">
                      {chapter}.{name}
                    </span>
                    <span className="text-[9px] font-bold opacity-70">
                      {n}問
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
