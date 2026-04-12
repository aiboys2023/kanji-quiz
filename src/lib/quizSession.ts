export interface ChapterStat {
  correct: number;
  total: number;
}

export interface QuizSessionSummary {
  mode: "reading" | "kanji";
  total: number;
  correct: number;
  wrongQuestionKeys: string[];
  byChapter: Record<number, ChapterStat>;
  maxStreak: number;
  questionKeys: string[];
}

export const QUIZ_RESULT_KEY = "kanji-quiz-result";

export function saveQuizResult(summary: QuizSessionSummary): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(QUIZ_RESULT_KEY, JSON.stringify(summary));
}

export function loadQuizResult(): QuizSessionSummary | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(QUIZ_RESULT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as QuizSessionSummary;
  } catch {
    return null;
  }
}
