"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CatMascot, { type CatMood } from "@/components/CatMascot";
import ResultChart from "@/components/ResultChart";
import StickerDeco from "@/components/StickerDeco";
import {
  LAST_QUIZ_HREF_KEY,
  REVIEW_KEYS_KEY,
  loadQuizResult,
  type QuizSessionSummary,
} from "@/lib/quizSession";

function moodForScore(pct: number): CatMood {
  if (pct >= 80) return "result-high";
  if (pct >= 60) return "result-mid";
  return "result-low";
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
        <StickerDeco density={6} />
        <p className="relative z-10 text-[1.2rem] font-bold">
          けっかがみつかりません。
        </p>
        <Link
          href="/"
          className="relative z-10 retro-btn rounded-2xl bg-yellow px-6 py-3 text-[1.2rem] font-bold"
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
    <main className="relative mx-auto flex min-h-full w-full max-w-2xl flex-1 flex-col items-center gap-8 px-4 py-10">
      <StickerDeco density={10} />
      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-6 text-center">
        <CatMascot mood={moodForScore(pct)} size={180} />
        <div className="sticker w-full rounded-3xl bg-white px-6 py-8">
          <p className="text-[1rem] font-bold opacity-70">{modeLabel}</p>
          <h1 className="mt-2 text-[1.5rem] font-black md:text-[1.75rem]">
            おつかれさま！
          </h1>
          <div
            className="sticker-sm mx-auto mt-4 inline-block rounded-2xl px-8 py-4 text-[3rem] font-black leading-none tabular-nums"
            style={{
              backgroundColor:
                pct >= 80 ? "#6BCB77" : pct >= 60 ? "#FFD93D" : "#FF6B9D",
              color: "#fff",
            }}
          >
            {pct}%
          </div>
          <p className="mt-4 text-[1.3rem] font-bold">
            {data.correct} / {data.total} せいかい
          </p>
        </div>

        <div className="sticker w-full rounded-3xl bg-white px-4 py-6">
          <ResultChart byChapter={data.byChapter} />
        </div>

        <div className="flex w-full max-w-md flex-col gap-4">
          <Link
            href={lastHref}
            className="retro-btn w-full min-h-12 rounded-2xl bg-orange py-4 text-center text-[1.2rem] font-bold text-white"
          >
            もう一回
          </Link>
          {data.wrongQuestionKeys.length > 0 && (
            <button
              type="button"
              onClick={startReview}
              className="retro-btn w-full min-h-12 rounded-2xl bg-green py-4 text-[1.2rem] font-bold text-white"
            >
              まちがえた問題をふくしゅう
            </button>
          )}
          <Link
            href="/"
            className="retro-btn w-full min-h-12 rounded-2xl bg-blue py-4 text-center text-[1.2rem] font-bold text-white"
          >
            ホームに戻る
          </Link>
        </div>
      </div>
    </main>
  );
}
