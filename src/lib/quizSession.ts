export interface ChapterStat {
  correct: number;
  total: number;
}

export interface QuizSessionSummary {
  mode: "reading" | "kanji" | "daily";
  total: number;
  correct: number;
  wrongQuestionKeys: string[];
  byChapter: Record<number, ChapterStat>;
  maxStreak: number;
  questionKeys: string[];
}

export const QUIZ_RESULT_KEY = "kanji-quiz-result";

/** Last played quiz URL for「もう一回」 */
export const LAST_QUIZ_HREF_KEY = "kanji-quiz-last-href";

export const REVIEW_KEYS_KEY = "kanji-quiz-review-keys";

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
