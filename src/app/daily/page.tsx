"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import StickerDeco from "@/components/StickerDeco";
import { useDaily } from "@/hooks/useDaily";

function scoreColor(pct: number): string {
  if (pct >= 80) return "bg-green text-white";
  if (pct >= 60) return "bg-yellow text-foreground";
  if (pct > 0) return "bg-pink text-white";
  return "bg-white/80 text-foreground/50";
}

export default function DailyPage() {
  const { calendar, hydrate, todayKey } = useDaily();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const { year, month, cells } = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    const first = new Date(y, m, 1);
    const last = new Date(y, m + 1, 0);
    const pad = first.getDay();
    const daysInMonth = last.getDate();
    const grid: { day: number; key: string }[] = [];
    for (let i = 0; i < pad; i++) grid.push({ day: 0, key: `pad-${i}` });
    for (let d = 1; d <= daysInMonth; d++) {
      const dk = `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      grid.push({ day: d, key: dk });
    }
    return { year: y, month: m + 1, cells: grid };
  }, []);

  return (
    <main className="relative mx-auto flex min-h-full w-full max-w-lg flex-1 flex-col gap-8 px-4 py-10">
      <StickerDeco count={8} />
      <div className="relative z-10">
        <Link
          href="/"
          className="sticker-sm mb-6 inline-flex min-h-12 items-center rounded-xl bg-white px-4 py-2 text-[1rem] font-bold"
        >
          ← ホーム
        </Link>

        <div className="sticker rounded-3xl bg-white px-5 py-6">
          <h1 className="text-[1.5rem] font-black md:text-[1.75rem]">
            デイリーチャレンジ
          </h1>
          <p className="mt-2 text-[1rem] font-bold opacity-80">
            きょうの 10 問は日付で固定。スコアは端末に保存されます。
          </p>

          <Link
            href="/quiz?daily=1&timer=off"
            className="retro-btn mt-6 flex min-h-12 w-full items-center justify-center rounded-2xl bg-purple py-4 text-[1.2rem] font-black text-white"
          >
            きょうの 10 問をはじめる
          </Link>
        </div>

        <div className="sticker mt-8 rounded-3xl bg-white px-4 py-5">
          <h2 className="mb-4 text-center text-[1.2rem] font-black">
            {year}年{month}月
          </h2>
          <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[0.75rem] font-bold opacity-70">
            {["日", "月", "火", "水", "木", "金", "土"].map((w) => (
              <div key={w}>{w}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {cells.map((c) => {
              if (c.day === 0) {
                return <div key={c.key} className="aspect-square" />;
              }
              const rec = calendar[c.key];
              const pct =
                rec && rec.total > 0
                  ? Math.round((rec.score / rec.total) * 100)
                  : -1;
              const isToday = c.key === todayKey;
              return (
                <div
                  key={c.key}
                  className={`flex aspect-square flex-col items-center justify-center rounded-lg border-2 border-foreground text-[0.75rem] font-bold ${
                    rec ? scoreColor(pct) : "bg-stone-100"
                  } ${isToday ? "ring-2 ring-purple ring-offset-2" : ""}`}
                  title={
                    rec
                      ? `${rec.score}/${rec.total}`
                      : c.key
                  }
                >
                  <span>{c.day}</span>
                  {rec && (
                    <span className="text-[0.65rem] tabular-nums">
                      {pct}%
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
