"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { PopSquiggle } from "@/components/pop/PopDeco";
import StickerDeco from "@/components/StickerDeco";
import { dateKey, useDaily } from "@/hooks/useDaily";

function colorForScore10(s: number | undefined): string {
  if (s === undefined || s <= 0) return "#fff";
  if (s >= 9) return "var(--pop-accent)";
  if (s >= 7) return "var(--pop-streak)";
  if (s >= 5) return "var(--pop-pink)";
  return "var(--pop-sky)";
}

function consecutiveDailyStreak(
  calendar: Record<string, { score: number; total: number }>
): number {
  const d = new Date();
  let s = 0;
  while (true) {
    const k = dateKey(d);
    if (calendar[k]) {
      s++;
      d.setDate(d.getDate() - 1);
    } else break;
  }
  return s;
}

export default function DailyPage() {
  const { calendar, hydrate, todayKey } = useDaily();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const today = new Date();
  const todayRec = calendar[todayKey];

  const { cells, monthLabel } = useMemo(() => {
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
    return {
      cells: grid,
      monthLabel: `${y}.${String(m + 1).padStart(2, "0")}`,
    };
  }, []);

  const streak = useMemo(
    () => consecutiveDailyStreak(calendar),
    [calendar]
  );

  const totalDays = useMemo(
    () => Object.keys(calendar).length,
    [calendar]
  );

  const avg = useMemo(() => {
    const vals = Object.values(calendar);
    if (!vals.length) return "—";
    const sum = vals.reduce((a, b) => a + b.score, 0);
    return (sum / vals.length).toFixed(1);
  }, [calendar]);

  return (
    <main className="relative mx-auto flex min-h-full w-full max-w-lg flex-1 flex-col gap-5 px-4 py-6">
      <StickerDeco count={4} className="opacity-[0.2]" />
      <div className="relative z-10">
        <div className="mb-4 flex items-center gap-2.5">
          <Link
            href="/"
            className="pop-icon-btn no-underline"
            aria-label="ホームへ"
          >
            ‹
          </Link>
          <div className="min-w-0 flex-1">
            <span className="pop-pill bg-[var(--pop-accent)] font-black tracking-[0.15em] text-white shadow-[3px_3px_0_#000]">
              DAILY
            </span>
            <h1 className="mt-2 text-2xl font-black text-black">
              今日のチャレンジ
            </h1>
          </div>
        </div>

        <div
          className={`pop-card relative mb-5 overflow-hidden rounded-3xl border-[3px] border-black p-4 shadow-[8px_8px_0_#000] ${
            todayRec
              ? "bg-[var(--pop-correct)]"
              : "bg-gradient-to-br from-[var(--pop-accent)] via-[var(--pop-accent)] to-[#4db3ee]"
          }`}
        >
          <div className="relative text-xs font-black tracking-wide text-black">
            {today.getMonth() + 1}.{today.getDate()} (
            {"日月火水木金土"[today.getDay()]})
          </div>
          {todayRec ? (
            <>
              <div className="relative mt-2 text-3xl font-black text-white">
                本日完了 ✓
              </div>
              <div className="relative mt-1 text-sm font-black text-white">
                スコア: {todayRec.score}/{todayRec.total}
              </div>
            </>
          ) : (
            <>
              <div className="relative mt-2 text-2xl font-black leading-tight text-white">
                10問・全章ミックス
              </div>
              <p className="relative mt-1 text-[11px] font-bold text-white/90">
                毎日0時に更新 · ストリーク継続中
              </p>
              <Link
                href="/quiz?daily=1&timer=off"
                className="pop-btn relative mt-4 flex min-h-12 w-full items-center justify-center rounded-2xl bg-white py-3 text-[1rem] font-black text-black no-underline"
              >
                ▶ 挑戦する
              </Link>
            </>
          )}
        </div>

        <div className="mb-5 grid grid-cols-3 gap-2">
          {[
            { v: streak, l: "連続", suf: "日", c: "bg-[var(--pop-streak)]" },
            { v: totalDays, l: "達成", suf: "日", c: "bg-[var(--pop-pink)]" },
            { v: avg, l: "平均", suf: "/10", c: "bg-[var(--pop-sky)]" },
          ].map((s, i) => (
            <div
              key={i}
              className={`pop-card rounded-2xl p-2.5 text-center ${s.c}`}
            >
              <div className="text-xl font-black tabular-nums text-black">
                {s.v}
                <span className="text-[11px] font-bold">{s.suf}</span>
              </div>
              <div className="mt-1 text-[10px] font-black tracking-wide text-black">
                {s.l}
              </div>
            </div>
          ))}
        </div>

        <div className="pop-card rounded-3xl bg-white p-3.5">
          <div className="mb-3 flex items-center justify-center gap-2">
            <PopSquiggle width={40} />
            <div className="text-base font-black tracking-[0.12em] text-black">
              {monthLabel}
            </div>
            <PopSquiggle width={40} />
          </div>
          <div className="mb-2 grid grid-cols-7 gap-1.5 text-center text-[10px] font-black text-black">
            {"日月火水木金土".split("").map((d, i) => (
              <div
                key={d}
                className={
                  i === 0 || i === 6 ? "opacity-60" : undefined
                }
              >
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {cells.map((c) => {
              if (c.day === 0) {
                return <div key={c.key} className="aspect-square" />;
              }
              const rec = calendar[c.key];
              const dt = new Date(c.key + "T12:00:00");
              const isFuture = dt > new Date();
              const isToday = c.key === todayKey;
              const bg = isFuture ? "#f0f0f0" : colorForScore10(rec?.score);
              return (
                <div
                  key={c.key}
                  title={
                    rec
                      ? `${c.day}: ${rec.score}/${rec.total}`
                      : String(c.day)
                  }
                  className={`flex aspect-square flex-col items-center justify-center rounded-md border-2 border-black text-[11px] font-black text-black ${
                    isFuture ? "opacity-40" : ""
                  }`}
                  style={{
                    background: bg,
                    boxShadow: isToday ? "2px 2px 0 #000" : undefined,
                  }}
                >
                  {c.day}
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] font-black text-black">
            <span>少</span>
            {[null, 4, 6, 8, 10].map((s, i) => (
              <div
                key={i}
                className="h-3.5 w-3.5 rounded border-2 border-black"
                style={{
                  background: s ? colorForScore10(s) : "#fff",
                }}
              />
            ))}
            <span>多</span>
          </div>
        </div>
      </div>
    </main>
  );
}
