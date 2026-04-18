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
import CatMascot, { type CatMood } from "@/components/CatMascot";
import Confetti from "@/components/Confetti";
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

  const [catMood, setCatMood] = useState<CatMood>("thinking");
  const [confettiBurst, setConfettiBurst] = useState(false);
  const confettiTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    if (!raw) return Array.from({ length: 18 }, (_, i) => i + 1);
    const nums = raw
      .split(",")
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !Number.isNaN(n) && n >= 1 && n <= 18);
    return nums.length ? nums : Array.from({ length: 18 }, (_, i) => i + 1);
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

    try {
      const prog = loadQuizProgress();
      if (prog && prog.spec === spec && prog.questionKeys?.length) {
        const keyToQ = new Map(ALL_QUESTIONS.map((q) => [questionKey(q), q]));
        const recon = prog.questionKeys
          .map((k) => keyToQ.get(k))
          .filter(Boolean) as typeof ALL_QUESTIONS;
        if (recon.length === prog.questionKeys.length) {
          setQuizQuestions(recon);
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
    setCatMood("thinking");
    setConfettiBurst(false);
    if (confettiTimerRef.current) {
      clearTimeout(confettiTimerRef.current);
      confettiTimerRef.current = null;
    }
  }, [currentIndex]);

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

  const handleQuizFeedback = useCallback((correct: boolean) => {
    setCatMood(correct ? "excited" : "encourage");
    if (correct) {
      setConfettiBurst(true);
      if (confettiTimerRef.current) clearTimeout(confettiTimerRef.current);
      confettiTimerRef.current = setTimeout(() => {
        setConfettiBurst(false);
        confettiTimerRef.current = null;
      }, 2400);
    }
  }, []);

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
      <div className="flex min-h-[40vh] items-center justify-center text-[1.1rem] font-bold">
        よみこみ中…
      </div>
    );
  }

  if (quizQuestions.length === 0) {
    return (
      <main className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-6">
        <p className="text-[1.1rem] font-bold">もんだいがありません</p>
        <Link
          href="/settings"
          className="retro-btn rounded-xl bg-yellow px-6 py-3 text-[1.1rem] font-bold"
        >
          設定にもどる
        </Link>
      </main>
    );
  }

  if (finished || !current) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-[1.1rem] font-bold">
        けっかへ…
      </div>
    );
  }

  return (
    <main className="relative mx-auto flex min-h-full w-full max-w-2xl flex-1 flex-col px-4 py-6">
      <Confetti active={confettiBurst} loop={false} />
      <div className="pointer-events-none absolute right-2 top-4 z-20 md:right-6">
        <CatMascot mood={catMood} size={120} className="drop-shadow-md" />
      </div>

      <div className="relative z-10 mb-4 flex flex-wrap items-center gap-2">
        <Link
          href="/"
          className="sticker-sm rounded-xl bg-white px-3 py-1.5 text-sm font-bold"
        >
          ← ホーム
        </Link>
        <Link
          href={`/settings?mode=${mode}`}
          className="sticker-sm rounded-xl bg-white px-3 py-1.5 text-sm font-bold"
        >
          設定
        </Link>
        <StreakCounter streak={streak} />
        <div className="sticker-sm rounded-xl bg-purple px-3 py-1.5 text-sm font-bold text-white">
          {currentIndex + 1}/{total}
        </div>
        <div className="sticker-sm rounded-xl bg-green px-3 py-1.5 text-sm font-bold">
          ✓{score}/{total}
        </div>
        {timerOn && (
          <Timer
            remaining={remaining}
            total={timerTotal}
            active={!finished}
          />
        )}
      </div>

      <div className="sticker-sm mb-4 h-3 overflow-hidden rounded-full bg-white">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${progress}%`,
            backgroundColor:
              current.type === "writing" ? "#4D96FF" : "#FF8C42",
          }}
        />
      </div>

      {current.type === "reading" ? (
        <ReadingMode
          question={current}
          onComplete={onComplete}
          timerPulse={timerOn ? timerPulse : 0}
          onFeedback={handleQuizFeedback}
        />
      ) : (
        <KanjiMode
          question={current}
          onComplete={onComplete}
          timerPulse={timerOn ? timerPulse : 0}
          onFeedback={handleQuizFeedback}
        />
      )}
    </main>
  );
}

export default function QuizPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-[1.2rem] font-bold">
          読み込み中…
        </div>
      }
    >
      <QuizInner />
    </Suspense>
  );
}
