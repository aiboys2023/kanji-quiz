"use client";

import { useCallback, useMemo, useState } from "react";
import { getDailyQuestions } from "@/data/questions";

const STORAGE_KEY = "kanji-quiz-daily";

export interface DailyRecord {
  score: number;
  total: number;
  at: string;
}

export type DailyCalendar = Record<string, DailyRecord>;

function loadCalendar(): DailyCalendar {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as DailyCalendar;
  } catch {
    return {};
  }
}

function saveCalendar(cal: DailyCalendar) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cal));
}

/** ローカル日付の YYYY-MM-DD（localStorage・カレンダーと一致） */
export function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function useDaily() {
  const [calendar, setCalendar] = useState<DailyCalendar>({});

  const hydrate = useCallback(() => {
    setCalendar(loadCalendar());
  }, []);

  const recordToday = useCallback((score: number, total: number) => {
    const key = dateKey(new Date());
    setCalendar((prev) => {
      const next = {
        ...prev,
        [key]: { score, total, at: new Date().toISOString() },
      };
      saveCalendar(next);
      return next;
    });
  }, []);

  const todayKey = useMemo(() => dateKey(new Date()), []);

  const todaysQuestions = useMemo(() => {
    return getDailyQuestions(new Date());
  }, [todayKey]);

  /** month: 1〜12。各日のスコア（カレンダー色分け用） */
  const getCalendarMonth = useCallback(
    (
      year: number,
      month: number
    ): { day: number; dateKey: string; record?: DailyRecord }[] => {
      const daysInMonth = new Date(year, month, 0).getDate();
      const rows: { day: number; dateKey: string; record?: DailyRecord }[] = [];
      for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        rows.push({ day, dateKey, record: calendar[dateKey] });
      }
      return rows;
    },
    [calendar]
  );

  return {
    calendar,
    hydrate,
    recordToday,
    todayKey,
    todaysQuestions,
    getCalendarMonth,
  };
}
