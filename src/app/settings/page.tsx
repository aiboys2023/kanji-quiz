"use client";

import { useCallback, useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { BurstShape } from "@/components/pop/PopDeco";
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

  const [selected, setSelected] = useState<Set<number>>(() => new Set());

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
    const cap = count === "all" ? pool.length : Math.min(count, pool.length);
    if (cap === 0) return;

    const qs = new URLSearchParams();
    qs.set("mode", mode);
    qs.set("chapters", chapters.join(","));
    qs.set("count", count === "all" ? "all" : String(cap));
    qs.set("timer", timerOn ? "on" : "off");
    router.push(`/quiz?${qs.toString()}`);
  };

  const cap =
    count === "all" ? maxAvailable : Math.min(count, maxAvailable);

  return (
    <main className="relative mx-auto flex min-h-full w-full max-w-2xl flex-1 flex-col px-4 py-6">
      <div className="relative z-10 flex flex-1 flex-col">
        <div className="flex items-start gap-2.5 pb-3">
          <Link
            href="/"
            className="pop-icon-btn min-h-12 min-w-12 shrink-0 no-underline"
            aria-label="ホームに戻る"
          >
            ‹
          </Link>
          <div className="min-w-0 flex-1">
            <div className="mb-2">
              <span className="pop-pill bg-white font-black text-black">
                {mode === "reading" ? "ヨミカタ MODE" : "カンジ MODE"}
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-wide text-black">
              出題セッテイ
            </h1>
          </div>
          <BurstShape size={44} color="var(--pop-accent)" rotate={-15} />
        </div>

        <div className="min-h-0 flex-1 overflow-auto pb-4">
          <ChapterSelect
            counts={counts}
            selected={selected}
            onToggle={toggle}
            onToggleAll={toggleAll}
          />

          <div className="my-5 border-t-[3px] border-dashed border-black/25" />

          <QuizSettings
            count={count}
            onCount={setCount}
            timerOn={timerOn}
            onTimer={setTimerOn}
            maxAvailable={maxAvailable}
          />
        </div>

        <div className="sticky bottom-0 border-t-[3px] border-black bg-[var(--pop-bg)] pt-3 pb-[env(safe-area-inset-bottom)]">
          <button
            type="button"
            onClick={start}
            disabled={selected.size === 0 || maxAvailable === 0}
            className="pop-btn min-h-12 w-full rounded-2xl py-4 text-[1.15rem] text-white disabled:opacity-40"
            style={{
              background:
                selected.size === 0 || maxAvailable === 0
                  ? "#ccc"
                  : "var(--pop-accent)",
            }}
          >
            {selected.size === 0 || maxAvailable === 0
              ? "章を選択してください"
              : `▶ ${cap}問はじめる`}
          </button>
          {selected.size === 0 && (
            <p className="mt-2 text-center text-sm font-bold text-[var(--pop-wrong)]">
              章を1つ以上選択してください
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-[1.2rem] font-black">
          読み込み中…
        </div>
      }
    >
      <SettingsInner />
    </Suspense>
  );
}
