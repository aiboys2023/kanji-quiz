"use client";

/* eslint-disable react-hooks/set-state-in-effect -- hydrate from sessionStorage on mount */
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BurstShape, PopFlower, PopSquiggle } from "@/components/pop/PopDeco";
import ResultChart from "@/components/ResultChart";
import StickerDeco from "@/components/StickerDeco";
import {
  LAST_QUIZ_HREF_KEY,
  REVIEW_KEYS_KEY,
  loadQuizResult,
  type QuizSessionSummary,
} from "@/lib/quizSession";

function verdictFor(pct: number): {
  label: string;
  bg: string;
  emoji: string;
} {
  if (pct >= 90) return { label: "PERFECT!", bg: "var(--pop-correct)", emoji: "🎉" };
  if (pct >= 70) return { label: "GREAT!", bg: "var(--pop-accent)", emoji: "✨" };
  if (pct >= 50) return { label: "OK!", bg: "var(--pop-streak)", emoji: "💪" };
  return { label: "TRY AGAIN", bg: "var(--pop-wrong)", emoji: "📖" };
}

export default function ResultPage() {
  const router = useRouter();
  const [data, setData] = useState<QuizSessionSummary | null>(null);
  const [lastHref, setLastHref] = useState("/settings");

  useEffect(() => {
    setData(loadQuizResult());
    setLastHref(
      sessionStorage.getItem(LAST_QUIZ_HREF_KEY) ?? "/settings"
    );
  }, []);

  const pct = useMemo(() => {
    if (!data || data.total <= 0) return 0;
    return Math.round((data.correct / data.total) * 100);
  }, [data]);

  const verdict = verdictFor(pct);

  const startReview = () => {
    if (!data?.wrongQuestionKeys.length) return;
    sessionStorage.setItem(
      REVIEW_KEYS_KEY,
      JSON.stringify(data.wrongQuestionKeys)
    );
    router.push("/quiz?review=1&timer=off");
  };

  if (!data) {
    return (
      <main className="relative mx-auto flex min-h-full max-w-lg flex-col items-center gap-4 px-4 py-16 text-center">
        <StickerDeco count={3} className="opacity-[0.18]" />
        <p className="relative z-10 text-[1.2rem] font-black">
          けっかがみつかりません。
        </p>
        <Link
          href="/"
          className="relative z-10 pop-btn rounded-2xl bg-[var(--pop-streak)] px-6 py-3 text-[1.2rem] text-black"
        >
          ホームへ
        </Link>
      </main>
    );
  }

  const modeLabel =
    data.mode === "kanji"
      ? "漢字モード"
      : data.mode === "daily"
        ? "デイリーチャレンジ"
        : "読み方モード";

  return (
    <main className="relative mx-auto flex min-h-full w-full max-w-2xl flex-1 flex-col items-center gap-6 px-4 py-8">
      <StickerDeco count={5} className="opacity-[0.22]" />
      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-5 text-center">
        <div className="relative w-full py-2">
          <div className="absolute left-2 top-0">
            <PopFlower size={32} color="var(--pop-pink)" center="var(--pop-accent)" rotate={-15} />
          </div>
          <div className="absolute right-4 top-1">
            <BurstShape size={36} color="var(--pop-streak)" rotate={20} />
          </div>
          <div className="text-[11px] font-black tracking-[0.2em] text-black">
            RESULT
          </div>
          <div className="mt-1 text-3xl font-black text-black">けっか</div>
        </div>

        <div className="pop-card relative w-full overflow-hidden rounded-3xl p-5 text-center">
          <p className="relative text-[0.95rem] font-black text-black/80">
            {modeLabel}
          </p>
          <div
            className="relative mt-3 rounded-[1.25rem] border-[3px] border-black px-5 py-6 shadow-[8px_8px_0_#000]"
            style={{ background: verdict.bg }}
          >
            <div className="text-sm font-black tracking-wide text-black">
              {verdict.emoji} {verdict.label}
            </div>
            <div className="mt-2 text-7xl font-black leading-none tracking-tight text-black tabular-nums md:text-[4.5rem]">
              {pct}
              <span className="align-top text-4xl">%</span>
            </div>
            <p className="mt-3 text-sm font-black text-black">
              {data.correct} / {data.total} 問正解
            </p>
          </div>
        </div>

        <div className="pop-card w-full rounded-3xl bg-white p-4">
          <ResultChart byChapter={data.byChapter} />
        </div>

        <div className="flex w-full max-w-md flex-col gap-3">
          {data.wrongQuestionKeys.length > 0 && (
            <button
              type="button"
              onClick={startReview}
              className="pop-btn min-h-12 w-full rounded-2xl bg-[var(--pop-wrong)] py-4 text-[1.1rem] font-black text-white"
            >
              ✕ 間違えた{data.wrongQuestionKeys.length}問を復習
            </button>
          )}
          <div className="grid grid-cols-2 gap-3">
            <Link
              href={lastHref}
              className="pop-btn-outline flex min-h-12 items-center justify-center rounded-2xl py-3.5 text-center text-[1.05rem] font-black no-underline"
            >
              ↻ もう一回
            </Link>
            <Link
              href="/"
              className="pop-btn-outline flex min-h-12 items-center justify-center rounded-2xl py-3.5 text-center text-[1.05rem] font-black no-underline"
            >
              🏠 ホーム
            </Link>
          </div>
        </div>

        <PopSquiggle width={160} color="#000" className="opacity-40" />
      </div>
    </main>
  );
}
