"use client";

/* eslint-disable react-hooks/set-state-in-effect -- sync quiz state from props / restore snapshot */
import { useCallback, useEffect, useState } from "react";
import type { Question } from "@/data/questions";
import { questionKey } from "@/data/questions";
import type { ChapterStat, QuizProgressSnapshot } from "@/lib/quizSession";
import { useStreak } from "./useStreak";

function emptyChapterStats(): Record<number, ChapterStat> {
  const o: Record<number, ChapterStat> = {};
  for (let c = 1; c <= 18; c++) {
    o[c] = { correct: 0, total: 0 };
  }
  return o;
}

export type { ChapterStat };

export function useQuiz(
  initialQuestions: Question[],
  opts?: { restore: QuizProgressSnapshot | null }
) {
  const { restore } = opts ?? {};
  const questions = initialQuestions;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [finished, setFinished] = useState(false);
  const [byChapter, setByChapter] = useState<Record<number, ChapterStat>>(
    () => emptyChapterStats()
  );
  const {
    streak,
    maxStreak,
    recordCorrect,
    recordWrong,
    reset: resetStreak,
    hydrate: hydrateStreak,
  } = useStreak();

  useEffect(() => {
    if (initialQuestions.length === 0) {
      setCurrentIndex(0);
      setScore(0);
      setResults([]);
      setFinished(false);
      setByChapter(emptyChapterStats());
      resetStreak();
      return;
    }

    if (restore) {
      setCurrentIndex(
        Math.min(restore.currentIndex, initialQuestions.length)
      );
      setScore(restore.score);
      setResults(restore.results.slice(0, initialQuestions.length));
      setByChapter({ ...emptyChapterStats(), ...restore.byChapter });
      hydrateStreak(restore.streak, restore.maxStreak);
      const done =
        restore.currentIndex >= initialQuestions.length &&
        restore.results.length >= initialQuestions.length;
      setFinished(done);
    } else {
      setCurrentIndex(0);
      setScore(0);
      setResults([]);
      setFinished(false);
      setByChapter(emptyChapterStats());
      resetStreak();
    }
  }, [initialQuestions, restore, resetStreak, hydrateStreak]);

  const handleAnswer = useCallback(
    (correct: boolean) => {
      const q = questions[currentIndex];
      if (!q) return;

      setByChapter((prev) => {
        const next = { ...prev };
        const cur = next[q.chapter] ?? { correct: 0, total: 0 };
        next[q.chapter] = {
          correct: cur.correct + (correct ? 1 : 0),
          total: cur.total + 1,
        };
        return next;
      });

      setResults((prev) => [...prev, correct]);
      if (correct) {
        setScore((s) => s + 1);
        recordCorrect();
      } else {
        recordWrong();
      }
      setCurrentIndex((i) => {
        const next = i + 1;
        if (next >= questions.length) {
          setFinished(true);
        }
        return next;
      });
    },
    [questions, currentIndex, recordCorrect, recordWrong]
  );

  const reset = useCallback(() => {
    setCurrentIndex(0);
    setScore(0);
    setResults([]);
    setFinished(false);
    setByChapter(emptyChapterStats());
    resetStreak();
  }, [resetStreak]);

  const getWrongQuestions = useCallback((): Question[] => {
    return questions.filter((_, i) => results[i] === false);
  }, [questions, results]);

  const wrongQuestionKeys = useCallback((): string[] => {
    return questions
      .filter((_, i) => results[i] === false)
      .map((q) => questionKey(q));
  }, [questions, results]);

  return {
    questions,
    currentIndex,
    score,
    streak,
    maxStreak,
    results,
    finished,
    byChapter,
    handleAnswer,
    reset,
    getWrongQuestions,
    wrongQuestionKeys,
  };
}
