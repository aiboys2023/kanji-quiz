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
export const QUIZ_PROGRESS_KEY = "kanji-quiz-progress-v2";
const LEGACY_QUIZ_PROGRESS_KEYS = ["kanji-quiz-progress"];

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

function normalizeQuizProgress(raw: unknown): QuizProgressSnapshot | null {
  if (!raw || typeof raw !== "object") return null;
  const src = raw as Record<string, unknown>;

  const spec = typeof src.spec === "string" ? src.spec : "";
  const questionKeys = Array.isArray(src.questionKeys)
    ? src.questionKeys.filter((v): v is string => typeof v === "string")
    : [];
  if (!spec || questionKeys.length === 0) return null;

  const currentIndexRaw =
    typeof src.currentIndex === "number" ? src.currentIndex : 0;
  const scoreRaw = typeof src.score === "number" ? src.score : 0;
  const resultsRaw = Array.isArray(src.results)
    ? src.results.filter((v): v is boolean => typeof v === "boolean")
    : [];
  const streakRaw = typeof src.streak === "number" ? src.streak : 0;
  const maxStreakRaw = typeof src.maxStreak === "number" ? src.maxStreak : 0;

  const byChapterSource =
    src.byChapter && typeof src.byChapter === "object"
      ? (src.byChapter as Record<string, unknown>)
      : {};
  const byChapter: Record<number, ChapterStat> = {};
  for (const [key, val] of Object.entries(byChapterSource)) {
    const chapter = Number(key);
    if (!Number.isInteger(chapter) || chapter < 1 || chapter > 18) continue;
    if (!val || typeof val !== "object") continue;
    const stat = val as Record<string, unknown>;
    byChapter[chapter] = {
      correct:
        typeof stat.correct === "number" && stat.correct >= 0
          ? Math.floor(stat.correct)
          : 0,
      total:
        typeof stat.total === "number" && stat.total >= 0
          ? Math.floor(stat.total)
          : 0,
    };
  }

  const currentIndex = Math.min(
    Math.max(0, Math.floor(currentIndexRaw)),
    questionKeys.length
  );

  return {
    spec,
    questionKeys,
    currentIndex,
    score: Math.max(0, Math.floor(scoreRaw)),
    results: resultsRaw.slice(0, questionKeys.length),
    streak: Math.max(0, Math.floor(streakRaw)),
    maxStreak: Math.max(0, Math.floor(maxStreakRaw)),
    byChapter,
  };
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
  const keys = [QUIZ_PROGRESS_KEY, ...LEGACY_QUIZ_PROGRESS_KEYS];
  for (const key of keys) {
    try {
      const raw = sessionStorage.getItem(key);
      if (!raw) continue;
      const parsed = normalizeQuizProgress(JSON.parse(raw));
      if (!parsed) {
        sessionStorage.removeItem(key);
        continue;
      }
      if (key !== QUIZ_PROGRESS_KEY) {
        sessionStorage.setItem(QUIZ_PROGRESS_KEY, JSON.stringify(parsed));
        sessionStorage.removeItem(key);
      }
      return parsed;
    } catch {
      try {
        sessionStorage.removeItem(key);
      } catch {
        /* ignore */
      }
    }
  }
  return null;
}

export function clearQuizProgress(): void {
  if (typeof window === "undefined") return;
  for (const key of [QUIZ_PROGRESS_KEY, ...LEGACY_QUIZ_PROGRESS_KEYS]) {
    try {
      sessionStorage.removeItem(key);
    } catch {
      /* ignore */
    }
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
