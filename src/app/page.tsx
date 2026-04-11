"use client";

import { useState } from "react";
import { questions } from "@/data/questions";
import ReadingMode from "@/components/ReadingMode";
import KanjiMode from "@/components/KanjiMode";

type Mode = "select" | "reading" | "kanji";

const DECORATIONS = ["✦", "◉", "△", "♡", "⚡", "✿", "★", "◆"];

function FloatingDeco() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {DECORATIONS.map((d, i) => (
        <span
          key={i}
          className="absolute text-2xl opacity-15 animate-float"
          style={{
            left: `${10 + i * 12}%`,
            top: `${5 + (i % 3) * 30}%`,
            animationDelay: `${i * 0.4}s`,
            color: [
              "#FF6B9D",
              "#FFD93D",
              "#6BCB77",
              "#4D96FF",
              "#9B59B6",
              "#FF8C42",
              "#FF4757",
              "#FF6B9D",
            ][i],
          }}
        >
          {d}
        </span>
      ))}
    </div>
  );
}

export default function Home() {
  const [mode, setMode] = useState<Mode>("select");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [finished, setFinished] = useState(false);

  const [shuffledQuestions] = useState(() =>
    [...questions].sort(() => Math.random() - 0.5).slice(0, 10)
  );

  const handleAnswer = (correct: number, total: number) => {
    setScore((prev) => ({
      correct: prev.correct + correct,
      total: prev.total + total,
    }));
    if (currentIndex + 1 < shuffledQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setFinished(true);
    }
  };

  const reset = () => {
    setMode("select");
    setCurrentIndex(0);
    setScore({ correct: 0, total: 0 });
    setFinished(false);
  };

  if (finished) {
    const percentage = Math.round((score.correct / score.total) * 100);
    const emoji =
      percentage >= 80 ? "🎉" : percentage >= 60 ? "💪" : "📚";
    return (
      <main className="flex-1 flex items-center justify-center p-4 relative">
        <FloatingDeco />
        <div className="max-w-md w-full text-center space-y-6 relative z-10 animate-pop-in">
          <div className="sticker rounded-3xl bg-white p-8 space-y-4">
            <div className="text-5xl">{emoji}</div>
            <h1 className="text-3xl font-bold">けっか</h1>
            <div
              className="inline-block sticker-sm rounded-2xl px-6 py-3 text-5xl font-bold"
              style={{
                backgroundColor:
                  percentage >= 80
                    ? "#6BCB77"
                    : percentage >= 60
                      ? "#FFD93D"
                      : "#FF6B9D",
              }}
            >
              {percentage}%
            </div>
            <p className="text-xl font-bold">
              {score.correct} / {score.total} 正解
            </p>
            <p className="text-lg">
              {percentage >= 80
                ? "すごい！天才！✨"
                : percentage >= 60
                  ? "いい感じ！もう少し！🔥"
                  : "がんばろう！💪"}
            </p>
          </div>
          <button
            onClick={reset}
            className="retro-btn rounded-2xl px-8 py-4 bg-yellow text-xl cursor-pointer"
          >
            もう一回！🔄
          </button>
        </div>
      </main>
    );
  }

  if (mode === "select") {
    return (
      <main className="flex-1 flex items-center justify-center p-4 relative">
        <FloatingDeco />
        <div className="max-w-sm w-full text-center space-y-6 relative z-10">
          {/* Title card */}
          <div className="sticker rounded-3xl bg-pink px-6 py-5 animate-wiggle">
            <h1 className="text-4xl font-bold text-white tracking-wider">
              漢字クイズ
            </h1>
            <div className="inline-block sticker-sm rounded-full bg-yellow px-4 py-1 mt-2 text-lg font-bold">
              N3レベル
            </div>
          </div>

          {/* Mode buttons */}
          <div className="space-y-4">
            <button
              onClick={() => setMode("reading")}
              className="w-full sticker rounded-2xl bg-orange p-5 text-left cursor-pointer hover:translate-x-1 hover:-translate-y-1 transition-transform active:translate-x-0 active:translate-y-0"
            >
              <div className="flex items-center gap-3">
                <span className="text-4xl">👀</span>
                <div>
                  <div className="text-xl font-bold text-white">
                    読み方モード
                  </div>
                  <p className="text-sm text-white/80">
                    漢字 → ひらがな
                  </p>
                </div>
              </div>
            </button>
            <button
              onClick={() => setMode("kanji")}
              className="w-full sticker rounded-2xl bg-blue p-5 text-left cursor-pointer hover:translate-x-1 hover:-translate-y-1 transition-transform active:translate-x-0 active:translate-y-0"
            >
              <div className="flex items-center gap-3">
                <span className="text-4xl">✍️</span>
                <div>
                  <div className="text-xl font-bold text-white">
                    漢字モード
                  </div>
                  <p className="text-sm text-white/80">
                    ひらがな → 漢字
                  </p>
                </div>
              </div>
            </button>
          </div>

          <div className="sticker-sm rounded-xl bg-white px-4 py-2 inline-block text-sm font-bold">
            ランダム10問 ⚡ 全30問から出題
          </div>
        </div>
      </main>
    );
  }

  const question = shuffledQuestions[currentIndex];
  const progress = ((currentIndex + 1) / shuffledQuestions.length) * 100;

  return (
    <main className="flex-1 flex flex-col p-4 max-w-2xl mx-auto w-full relative">
      <FloatingDeco />
      {/* Header */}
      <div className="relative z-10 mb-4">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={reset}
            className="sticker-sm rounded-xl bg-white px-3 py-1.5 text-sm font-bold cursor-pointer hover:-translate-y-0.5 transition-transform"
          >
            ← もどる
          </button>
          <div className="sticker-sm rounded-xl bg-purple px-3 py-1.5 text-sm font-bold text-white">
            {currentIndex + 1} / {shuffledQuestions.length}
          </div>
          <div className="sticker-sm rounded-xl bg-green px-3 py-1.5 text-sm font-bold">
            ✓ {score.correct}/{score.total}
          </div>
        </div>
        {/* Progress bar */}
        <div className="sticker-sm rounded-full bg-white h-4 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${progress}%`,
              backgroundColor: mode === "reading" ? "#FF8C42" : "#4D96FF",
            }}
          />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center relative z-10">
        {mode === "reading" ? (
          <ReadingMode question={question} onComplete={handleAnswer} />
        ) : (
          <KanjiMode question={question} onComplete={handleAnswer} />
        )}
      </div>
    </main>
  );
}
