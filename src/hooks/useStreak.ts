"use client";

import { useCallback, useState } from "react";

/** Display helpers for streak UI (icons / super mode). */
export function streakFireCount(streak: number): number {
  if (streak >= 10) return 3;
  if (streak >= 5) return 2;
  if (streak >= 3) return 1;
  return 0;
}

export function isSuperMode(streak: number): boolean {
  return streak >= 10;
}

export function useStreak() {
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  const recordCorrect = useCallback(() => {
    setStreak((s) => {
      const n = s + 1;
      setMaxStreak((m) => Math.max(m, n));
      return n;
    });
  }, []);

  const recordWrong = useCallback(() => {
    setStreak(0);
  }, []);

  const reset = useCallback(() => {
    setStreak(0);
    setMaxStreak(0);
  }, []);

  return { streak, maxStreak, recordCorrect, recordWrong, reset };
}
