"use client";

import type { ChapterStat } from "@/lib/quizSession";
import { CHAPTER_INFO } from "@/data/questions";

interface Props {
  byChapter: Record<number, ChapterStat>;
}

function chapterName(num: number): string {
  return CHAPTER_INFO.find((c) => c.chapter === num)?.name ?? `第${num}章`;
}

export default function ResultChart({ byChapter }: Props) {
  const rows = Object.entries(byChapter)
    .map(([ch, s]) => ({
      chapter: Number(ch),
      ...s,
      pct: s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0,
    }))
    .filter((r) => r.total > 0)
    .sort((a, b) => a.chapter - b.chapter);

  if (rows.length === 0) {
    return (
      <p className="text-center text-[1rem] font-bold text-black/70">
        データがありません
      </p>
    );
  }

  return (
    <div className="w-full space-y-3">
      <h3 className="text-center text-[11px] font-black tracking-[0.15em] text-black">
        ● 章別 BREAKDOWN
      </h3>
      <ul className="space-y-2.5">
        {rows.map((r) => {
          const bar =
            r.pct >= 80
              ? "bg-[var(--pop-correct)]"
              : r.pct >= 50
                ? "bg-[var(--pop-streak)]"
                : "bg-[var(--pop-wrong)]";
          return (
            <li key={r.chapter} className="text-[0.95rem]">
              <div className="mb-1 flex justify-between gap-2 font-black text-black">
                <span className="min-w-0 truncate">
                  {r.chapter}.{chapterName(r.chapter)}
                </span>
                <span className="shrink-0 tabular-nums">
                  {r.correct}/{r.total}
                </span>
              </div>
              <div className="pop-progress-track h-2.5 rounded-md border-2 border-black bg-white">
                <div
                  className={`h-full rounded-md transition-all ${bar}`}
                  style={{ width: `${r.pct}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
