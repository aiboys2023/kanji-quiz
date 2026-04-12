"use client";

import { useCallback, useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import ChapterSelect from "@/components/ChapterSelect";
import QuizSettings, { type QuizCount } from "@/components/QuizSettings";
import {
  filterByChapters,
  getChapterCounts,
  questionsByMode,
} from "@/data/questions";
import { shuffle } from "@/lib/shuffle";

function SettingsInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modeParam = searchParams.get("mode");
  const mode = modeParam === "kanji" ? "kanji" : "reading";

  const counts = useMemo(() => getChapterCounts(mode), [mode]);

  const [selected, setSelected] = useState(() => {
    const s = new Set<number>();
    for (let i = 1; i <= 18; i++) s.add(i);
    return s;
  });

  const [count, setCount] = useState<QuizCount>(10);
  const [timerOn, setTimerOn] = useState(false);

  const maxAvailable = useMemo(() => {
    const chapters = [...selected];
    const pool = filterByChapters(questionsByMode(mode), chapters);
    return pool.length;
  }, [mode, selected]);

  const toggle = useCallback((ch: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(ch)) next.delete(ch);
      else next.add(ch);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    setSelected((prev) => {
      if (prev.size === 18) return new Set();
      const s = new Set<number>();
      for (let i = 1; i <= 18; i++) s.add(i);
      return s;
    });
  }, []);

  const start = () => {
    const chapters = [...selected].sort((a, b) => a - b);
    if (chapters.length === 0) return;

    let pool = filterByChapters(questionsByMode(mode), chapters);
    pool = shuffle(pool);
    const cap =
      count === "all"
        ? pool.length
        : Math.min(count, pool.length);
    if (cap === 0) return;

    const qs = new URLSearchParams();
    qs.set("mode", mode);
    qs.set("chapters", chapters.join(","));
    qs.set("count", count === "all" ? "all" : String(cap));
    qs.set("timer", timerOn ? "on" : "off");
    router.push(`/quiz?${qs.toString()}`);
  };

  return (
    <main className="relative mx-auto flex min-h-full w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8">
      <div className="relative z-10">
        <Link
          href="/"
          className="sticker-sm mb-4 inline-flex min-h-12 items-center rounded-xl bg-white px-4 py-2 text-[1rem] font-bold"
        >
          ← ホーム
        </Link>

        <div className="sticker rounded-3xl bg-white p-5 md:p-7">
          <h1 className="mb-2 text-[1.4rem] font-black md:text-[1.6rem]">
            {mode === "reading" ? "読み方モード" : "漢字モード"} — 設定
          </h1>
          <p className="mb-6 text-[1rem] opacity-80">
            章と問題数をえらんでスタート！
          </p>

          <ChapterSelect
            counts={counts}
            selected={selected}
            onToggle={toggle}
            onToggleAll={toggleAll}
          />

          <div className="my-8 h-px bg-foreground/10" />

          <QuizSettings
            count={count}
            onCount={setCount}
            timerOn={timerOn}
            onTimer={setTimerOn}
            maxAvailable={maxAvailable}
          />

          <button
            type="button"
            onClick={start}
            disabled={selected.size === 0 || maxAvailable === 0}
            className="retro-btn mt-8 w-full min-h-12 rounded-2xl bg-green py-4 text-[1.2rem] font-black text-white disabled:opacity-40"
          >
            スタート！
          </button>
        </div>
      </div>
    </main>
  );
}

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-[1.2rem] font-bold">
          読み込み中…
        </div>
      }
    >
      <SettingsInner />
    </Suspense>
  );
}
