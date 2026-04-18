"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { ALL_QUESTIONS } from "@/data/questions";
import { dateKey, useDaily } from "@/hooks/useDaily";
import { BurstShape, PopFlower, PopSquiggle } from "@/components/pop/PopDeco";

function consecutiveDailyStreak(calendar: Record<string, unknown>): number {
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

function weeklyPlayDays(calendar: Record<string, { score: number; total: number }>): number {
  const now = new Date();
  const dow = now.getDay();
  const start = new Date(now);
  start.setDate(now.getDate() - dow);
  start.setHours(0, 0, 0, 0);
  let n = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const key = `${y}-${m}-${day}`;
    if (calendar[key]) n++;
  }
  return n;
}

export default function HomePopContent() {
  const { calendar, hydrate, todayKey } = useDaily();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const streakDays = useMemo(
    () => consecutiveDailyStreak(calendar as Record<string, unknown>),
    [calendar]
  );
  const todayDone = Boolean(calendar[todayKey]);
  const weekPlays = useMemo(
    () => weeklyPlayDays(calendar as Record<string, { score: number; total: number }>),
    [calendar]
  );
  const totalQs = ALL_QUESTIONS.length;

  return (
    <>
      <div className="relative px-1 pb-2 pt-1">
        <div className="absolute -right-1 top-0 sm:right-2">
          <BurstShape size={56} color="var(--pop-streak)" text="N3" rotate={12} />
        </div>
        <div className="absolute right-[4.5rem] top-14 opacity-90 sm:right-[5rem]">
          <PopFlower size={28} color="var(--pop-pink)" center="var(--pop-accent)" />
        </div>
        <div className="pop-pill mb-3 bg-white font-black tracking-[0.2em] text-black">
          JLPT KANJI QUIZ
        </div>
        <h1 className="text-[clamp(2.5rem,11vw,3.5rem)] font-black leading-[0.95] tracking-tight text-black [text-shadow:1px_0_0_#000]">
          カンジ
          <br />
          <span className="text-[var(--pop-accent)]">クイズ</span>
        </h1>
        <PopSquiggle width={120} color="#000" className="mt-1" />
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div className="relative overflow-hidden rounded-2xl border-[3px] border-black bg-[var(--pop-streak)] p-3 shadow-[5px_5px_0_#000]">
          <div className="relative text-[10px] font-black tracking-wide text-black">
            STREAK
          </div>
          <div className="relative mt-1 text-3xl font-black leading-none text-black">
            {streakDays}
            <span className="text-sm font-black">日</span>
          </div>
          <div className="relative mt-1 text-[10px] font-bold text-black">
            🔥 れんしょう中
          </div>
        </div>
        <Link
          href="/daily"
          className="relative block overflow-hidden rounded-2xl border-[3px] border-black bg-[var(--pop-sky)] p-3 text-left shadow-[5px_5px_0_#000] transition-transform active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          <div className="relative text-[10px] font-black tracking-wide text-black">
            TODAY
          </div>
          <div className="relative mt-1 text-lg font-black leading-tight text-black">
            {todayDone ? "完了 ✓" : "デイリー"}
          </div>
          <div className="relative mt-1 text-[10px] font-bold text-black">
            10問・全章MIX
          </div>
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        <PopModeLink
          href="/settings?mode=reading"
          title="ヨミカタ"
          jpTitle="読み方"
          subtitle="漢字を見て、ひらがなで答える"
          swatchClass="bg-[var(--pop-pink)]"
          iconBg="bg-[var(--pop-accent)]"
          glyph="あ"
        />
        <PopModeLink
          href="/settings?mode=kanji"
          title="カンジ"
          jpTitle="漢字"
          subtitle="ひらがなを見て、4択から選ぶ"
          swatchClass="bg-[var(--pop-sky)]"
          iconBg="bg-[var(--pop-correct)]"
          glyph="字"
        />
      </div>

      <div className="pop-card mt-auto grid grid-cols-3 gap-1 rounded-2xl bg-white p-2.5 text-center">
        <div className="border-r-2 border-dashed border-black py-0.5">
          <div className="text-lg font-black text-black tabular-nums">
            {totalQs.toLocaleString("ja-JP")}
          </div>
          <div className="text-[9px] font-bold tracking-wide text-black">
            問題
          </div>
        </div>
        <div className="border-r-2 border-dashed border-black py-0.5">
          <div className="text-lg font-black text-black">18</div>
          <div className="text-[9px] font-bold tracking-wide text-black">
            章
          </div>
        </div>
        <div className="py-0.5">
          <div className="text-lg font-black text-black tabular-nums">
            {weekPlays}
          </div>
          <div className="text-[9px] font-bold tracking-wide text-black">
            今週
          </div>
        </div>
      </div>
    </>
  );
}

function PopModeLink({
  href,
  title,
  jpTitle,
  subtitle,
  swatchClass,
  iconBg,
  glyph,
}: {
  href: string;
  title: string;
  jpTitle: string;
  subtitle: string;
  swatchClass: string;
  iconBg: string;
  glyph: string;
}) {
  return (
    <Link
      href={href}
      className={`relative flex min-h-[5.5rem] items-center gap-3.5 overflow-hidden rounded-2xl border-[3px] border-black p-4 shadow-[5px_5px_0_#000] ${swatchClass} transition-transform active:translate-x-1 active:translate-y-1 active:shadow-none`}
    >
      <div
        className={`relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-[3px] border-black text-4xl font-black text-black shadow-[3px_3px_0_#000] ${iconBg}`}
      >
        {glyph}
      </div>
      <div className="relative min-w-0 flex-1">
        <div className="text-[1.35rem] font-black leading-none tracking-wide text-black">
          {title}
        </div>
        <div className="mt-1 text-[11px] font-bold text-black/80">
          {jpTitle} · {subtitle}
        </div>
      </div>
      <span className="relative text-2xl font-black text-black" aria-hidden>
        ›
      </span>
    </Link>
  );
}
