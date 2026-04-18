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

/** クイズ進行中の復元用（リロード・戻る対策） */
export const QUIZ_PROGRESS_KEY = "kanji-quiz-progress";

export interface QuizProgressSnapshot {
  spec: string;
  questionKeys: string[];
  currentIndex: number;
  score: number;
  results: boolean[];
  streak: number;
  maxStreak: number;
  byChapter: Record<number, ChapterStat>;
}

export function saveQuizProgress(snapshot: QuizProgressSnapshot): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(QUIZ_PROGRESS_KEY, JSON.stringify(snapshot));
  } catch {
    /* ignore quota */
  }
}

export function loadQuizProgress(): QuizProgressSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(QUIZ_PROGRESS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as QuizProgressSnapshot;
  } catch {
    return null;
  }
}

export function clearQuizProgress(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(QUIZ_PROGRESS_KEY);
  } catch {
    /* ignore */
  }
}

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
