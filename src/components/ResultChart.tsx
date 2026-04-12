"use client";

import type { ChapterStat } from "@/hooks/useQuiz";

interface Props {
  byChapter: Record<number, ChapterStat>;
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
      <p className="text-center text-[1rem] opacity-70">データがありません</p>
    );
  }

  return (
    <div className="space-y-3 w-full">
      <h3 className="text-[1.2rem] font-black text-center">章別せいとう率</h3>
      <ul className="space-y-2">
        {rows.map((r) => (
          <li key={r.chapter} className="flex items-center gap-2 text-[0.95rem]">
            <span className="w-14 shrink-0 font-bold">第{r.chapter}章</span>
            <div className="flex-1 h-4 rounded-full bg-white border-2 border-foreground overflow-hidden sticker-sm">
              <div
                className="h-full bg-green transition-all"
                style={{ width: `${r.pct}%` }}
              />
            </div>
            <span className="w-16 text-right tabular-nums font-bold">
              {r.pct}% ({r.correct}/{r.total})
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
