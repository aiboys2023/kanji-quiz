"use client";

/* eslint-disable react-hooks/set-state-in-effect -- sessionStorage restore & quiz bootstrap */
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import KanjiMode from "@/components/KanjiMode";
import ReadingMode from "@/components/ReadingMode";
import StreakCounter from "@/components/StreakCounter";
import Timer from "@/components/Timer";
import { useDaily } from "@/hooks/useDaily";
import { useQuiz } from "@/hooks/useQuiz";
import { useTimer } from "@/hooks/useTimer";
import {
  ALL_QUESTIONS,
  filterByChapters,
  getDailyQuestions,
  questionKey,
  questionsByMode,
} from "@/data/questions";
import {
  LAST_QUIZ_HREF_KEY,
  REVIEW_KEYS_KEY,
  clearQuizProgress,
  loadQuizProgress,
  saveQuizProgress,
  saveQuizResult,
  type QuizProgressSnapshot,
  type QuizSessionSummary,
} from "@/lib/quizSession";
import { shuffle } from "@/lib/shuffle";
import { resolveBlankSpan } from "@/lib/blankSpan";

function parseCount(raw: string | null): number | "all" {
  if (raw === "all") return "all";
  const n = parseInt(raw ?? "10", 10);
  if (n === 20 || n === 50) return n;
  return 10;
}

function QuizInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const spec = searchParams.toString();
  const { recordToday } = useDaily();

  const mode = useMemo(
    () => (searchParams.get("mode") === "kanji" ? "kanji" : "reading"),
    [searchParams]
  );
  const timerOn = searchParams.get("timer") !== "off";
  const count = useMemo(
    () => parseCount(searchParams.get("count")),
    [searchParams]
  );
  const isReview = searchParams.get("review") === "1";
  const isDaily = searchParams.get("daily") === "1";

  const [reviewQuestions, setReviewQuestions] = useState<
    typeof ALL_QUESTIONS | null
  >(null);

  const [dailyQuestions, setDailyQuestions] = useState<
    typeof ALL_QUESTIONS | null
  >(null);

  const [quizQuestions, setQuizQuestions] = useState<typeof ALL_QUESTIONS | null>(
    null
  );
  const [restoreSnap, setRestoreSnap] = useState<QuizProgressSnapshot | null>(
    null
  );

  useEffect(() => {
    if (!isReview) {
      setReviewQuestions(null);
      return;
    }
    try {
      const raw = sessionStorage.getItem(REVIEW_KEYS_KEY);
      if (!raw) {
        setReviewQuestions([]);
        return;
      }
      const keys = JSON.parse(raw) as string[];
      const set = new Set(keys);
      setReviewQuestions(ALL_QUESTIONS.filter((q) => set.has(questionKey(q))));
    } catch {
      setReviewQuestions([]);
    }
  }, [isReview, spec]);

  useEffect(() => {
    if (!isDaily) {
      setDailyQuestions(null);
      return;
    }
    setDailyQuestions(getDailyQuestions(new Date()));
  }, [isDaily, spec]);

  const selectedChapters = useMemo(() => {
    const raw = searchParams.get("chapters");
    if (!raw) return [];
    const nums = raw
      .split(",")
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !Number.isNaN(n) && n >= 1 && n <= 18);
    return nums.length ? Array.from(new Set(nums)) : [];
  }, [searchParams]);

  useEffect(() => {
    if (isReview && reviewQuestions === null) return;
    if (isDaily && dailyQuestions === null) return;

    let normal: typeof ALL_QUESTIONS;
    if (isDaily) {
      normal = dailyQuestions!;
    } else if (isReview) {
      normal = reviewQuestions!;
    } else {
      let pool = filterByChapters(questionsByMode(mode), selectedChapters);
      pool = shuffle(pool);
      const n = count === "all" ? pool.length : Math.min(count, pool.length);
      normal = pool.slice(0, n);
    }
    const validNormal = normal.filter((q) => resolveBlankSpan(q).start >= 0);
    if (validNormal.length !== normal.length) {
      console.warn("[quiz] dropped questions with unresolved blank span", {
        before: normal.length,
        after: validNormal.length,
        spec,
      });
    }
    normal = validNormal;

    try {
      const prog = loadQuizProgress();
      if (prog && prog.spec === spec && prog.questionKeys?.length) {
        const keyToQ = new Map(ALL_QUESTIONS.map((q) => [questionKey(q), q]));
        const recon = prog.questionKeys
          .map((k) => keyToQ.get(k))
          .filter(Boolean) as typeof ALL_QUESTIONS;
        const validRecon = recon.filter((q) => resolveBlankSpan(q).start >= 0);
        const saneIndex =
          prog.currentIndex >= 0 && prog.currentIndex <= validRecon.length;
        const saneResults = prog.results.length <= validRecon.length;
        if (
          validRecon.length === prog.questionKeys.length &&
          saneIndex &&
          saneResults
        ) {
          setQuizQuestions(validRecon);
          setRestoreSnap(prog);
          return;
        }
      }
    } catch {
      /* ignore */
    }
    setQuizQuestions(normal);
    setRestoreSnap(null);
  }, [
    spec,
    mode,
    selectedChapters,
    count,
    isReview,
    isDaily,
    reviewQuestions,
    dailyQuestions,
  ]);

  const stableQuestions = useMemo(
    () => quizQuestions ?? [],
    [quizQuestions]
  );

  const {
    questions,
    currentIndex,
    score,
    streak,
    maxStreak,
    results,
    finished,
    byChapter,
    handleAnswer,
  } = useQuiz(stableQuestions, { restore: restoreSnap });

  useEffect(() => {
    if (quizQuestions === null || finished || quizQuestions.length === 0) return;
    saveQuizProgress({
      spec,
      questionKeys: questions.map((q) => questionKey(q)),
      currentIndex,
      score,
      results,
      streak,
      maxStreak,
      byChapter,
    });
  }, [
    quizQuestions,
    finished,
    spec,
    questions,
    currentIndex,
    score,
    results,
    streak,
    maxStreak,
    byChapter,
  ]);

  const current = questions[currentIndex];
  const total = questions.length;
  const progress = total > 0 ? ((currentIndex + 1) / total) * 100 : 0;

  const [timerPulse, setTimerPulse] = useState(0);

  const answeredRef = useRef<string | null>(null);

  useEffect(() => {
    answeredRef.current = null;
    setTimerPulse(0);
  }, [currentIndex]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(
      LAST_QUIZ_HREF_KEY,
      `${window.location.pathname}?${spec}`
    );
  }, [spec]);

  useEffect(() => {
    if (!finished) return;
    clearQuizProgress();
    const wrongQuestionKeys = questions
      .filter((_, i) => results[i] === false)
      .map((q) => questionKey(q));
    const hasR = questions.some((q) => q.type === "reading");
    const hasW = questions.some((q) => q.type === "writing");
    const summaryMode: QuizSessionSummary["mode"] = isDaily
      ? "daily"
      : hasR && hasW
        ? "daily"
        : hasW
          ? "kanji"
          : "reading";
    if (isDaily) {
      recordToday(score, questions.length);
    }
    saveQuizResult({
      mode: summaryMode,
      total: questions.length,
      correct: score,
      wrongQuestionKeys,
      byChapter,
      maxStreak,
      questionKeys: questions.map((q) => questionKey(q)),
    });
    router.replace("/result");
  }, [
    finished,
    questions,
    score,
    results,
    byChapter,
    maxStreak,
    router,
    isDaily,
    recordToday,
  ]);

  const handleExpire = useCallback(() => {
    setTimerPulse((p) => p + 1);
  }, []);

  const { remaining, total: timerTotal } = useTimer({
    enabled: timerOn && !!current && !finished,
    resetKey: currentIndex,
    onExpire: handleExpire,
  });

  const onComplete = useCallback(
    (correct: number) => {
      if (!current) return;
      const key = `${currentIndex}:${questionKey(current)}`;
      if (answeredRef.current === key) return;
      answeredRef.current = key;
      handleAnswer(correct > 0);
    },
    [current, currentIndex, handleAnswer]
  );

  if ((isReview && reviewQuestions === null) || (isDaily && dailyQuestions === null) || quizQuestions === null) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-[1.1rem] font-black">
        よみこみ中…
      </div>
    );
  }

  if (quizQuestions.length === 0) {
    return (
      <main className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-6">
        <p className="text-[1.1rem] font-black">もんだいがありません</p>
        <Link
          href="/settings"
          className="pop-btn rounded-2xl bg-[var(--pop-streak)] px-6 py-3 text-[1.1rem] text-black"
        >
          設定にもどる
        </Link>
      </main>
    );
  }

  if (finished || !current) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-[1.1rem] font-black">
        けっかへ…
      </div>
    );
  }

  const accent =
    current.type === "writing" ? "var(--pop-correct)" : "var(--pop-accent)";

  return (
    <main className="relative mx-auto flex min-h-full w-full max-w-2xl flex-1 flex-col px-4 pb-8 pt-4">
      <header className="relative z-10 mb-4 border-b-[3px] border-black bg-[var(--pop-bg)] px-0 pb-3 pt-3.5">
        <div className="flex items-center gap-2.5 px-1">
          <Link
            href="/"
            className="pop-icon-btn no-underline"
            aria-label="ホームへ"
          >
            ×
          </Link>
          <div className="pop-progress-track min-h-[14px] flex-1">
            <div
              className="pop-progress-fill rounded-full"
              style={{ width: `${progress}%`, background: accent }}
            />
          </div>
          <StreakCounter streak={streak} />
        </div>
        {timerOn && (
          <div className="mt-2 pl-11 pr-2">
            <Timer
              remaining={remaining}
              total={timerTotal}
              active={!finished}
              showRemainingLabel={false}
            />
          </div>
        )}
        <div className="mt-1.5 flex items-center justify-between gap-2 pl-11 pr-2 text-xs font-black text-black">
          <span className="tabular-nums">
            Q.{currentIndex + 1} / {total}
          </span>
          <div className="flex flex-wrap items-center justify-end gap-2">
            {timerOn && (
              <span className="min-h-10 tabular-nums leading-none">
                {Math.max(0, Math.ceil(remaining))}s
              </span>
            )}
            <span className="sticker-sm min-h-10 rounded-full bg-[var(--pop-accent)] px-2.5 py-1.5 text-[11px] font-black text-white tabular-nums shadow-[2px_2px_0_#000]">
              ✓{score}/{total}
            </span>
          </div>
        </div>
      </header>

      <div className="relative z-10 flex-1">
        {current.type === "reading" ? (
          <ReadingMode
            question={current}
            onComplete={onComplete}
            timerPulse={timerOn ? timerPulse : 0}
          />
        ) : (
          <KanjiMode
            question={current}
            onComplete={onComplete}
            timerPulse={timerOn ? timerPulse : 0}
          />
        )}
      </div>
    </main>
  );
}

export default function QuizPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-[1.2rem] font-black">
          読み込み中…
        </div>
      }
    >
      <QuizInner />
    </Suspense>
  );
}
