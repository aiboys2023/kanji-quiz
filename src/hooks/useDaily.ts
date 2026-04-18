"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
    if (typeof window === "undefined") return;
    const key = dateKey(new Date());
    const prev = loadCalendar();
    const next = {
      ...prev,
      [key]: { score, total, at: new Date().toISOString() },
    };
    saveCalendar(next);
    setCalendar(next);
  }, []);

  const [todayKey, setTodayKey] = useState(() => dateKey(new Date()));

  useEffect(() => {
    const tick = () => setTodayKey(dateKey(new Date()));
    tick();
    const id = setInterval(tick, 60_000);
    const onVis = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const todaysQuestions = useMemo(() => {
    void todayKey;
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
