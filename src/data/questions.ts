import rawQuestions from "./all_questions.json";
import { shuffle, shuffleWithSeed } from "@/lib/shuffle";

export interface Ruby {
  text: string;
  ruby: string;
}

export interface QuestionBlank {
  kanji: string;
  reading: string;
  okurigana?: string;
}

export interface Question {
  chapter: number;
  topic: string;
  type: "reading" | "writing";
  sentence: string;
  blank: QuestionBlank;
  rubies: Ruby[];
}

/** 同一問題の安定キー（id なしデータ用） */
export function questionKey(q: Question): string {
  return `${q.chapter}\0${q.sentence}\0${q.blank.kanji}\0${q.blank.reading}\0${q.blank.okurigana ?? ""}`;
}

export const ALL_QUESTIONS = rawQuestions as Question[];

/** 4択生成の事前インデックス（章・トピック・読み） */
const QUESTIONS_BY_CHAPTER = new Map<number, Question[]>();
const QUESTIONS_BY_TOPIC = new Map<string, Question[]>();
const QUESTIONS_BY_READING = new Map<string, Question[]>();

for (const q of ALL_QUESTIONS) {
  if (!QUESTIONS_BY_CHAPTER.has(q.chapter)) {
    QUESTIONS_BY_CHAPTER.set(q.chapter, []);
  }
  QUESTIONS_BY_CHAPTER.get(q.chapter)!.push(q);

  if (!QUESTIONS_BY_TOPIC.has(q.topic)) {
    QUESTIONS_BY_TOPIC.set(q.topic, []);
  }
  QUESTIONS_BY_TOPIC.get(q.topic)!.push(q);

  const rd = q.blank.reading;
  if (!QUESTIONS_BY_READING.has(rd)) {
    QUESTIONS_BY_READING.set(rd, []);
  }
  QUESTIONS_BY_READING.get(rd)!.push(q);
}

/** 章番号 → 短い章名（UI用） */
export const CHAPTER_INFO: { chapter: number; name: string }[] = [
  { chapter: 1, name: "生活" },
  { chapter: 2, name: "料理" },
  { chapter: 3, name: "体" },
  { chapter: 4, name: "交通" },
  { chapter: 5, name: "スポーツ" },
  { chapter: 6, name: "恋愛" },
  { chapter: 7, name: "結婚" },
  { chapter: 8, name: "人間関係" },
  { chapter: 9, name: "子ども" },
  { chapter: 10, name: "心" },
  { chapter: 11, name: "学校" },
  { chapter: 12, name: "自然" },
  { chapter: 13, name: "旅行" },
  { chapter: 14, name: "住まい" },
  { chapter: 15, name: "仕事" },
  { chapter: 16, name: "会社" },
  { chapter: 17, name: "ビジネス" },
  { chapter: 18, name: "単位" },
];

export function getQuestionsByChapter(chapters: number[]): Question[] {
  const set = new Set(chapters);
  return ALL_QUESTIONS.filter((q) => set.has(q.chapter));
}

function distinctWrongKanjiFromPool(question: Question, pool: Question[]): string[] {
  const correct = question.blank.kanji;
  const selfKey = questionKey(question);
  const out: string[] = [];
  const seen = new Set<string>();
  for (const q of pool) {
    if (questionKey(q) === selfKey) continue;
    const k = q.blank.kanji;
    if (k === correct) continue;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(k);
  }
  return out;
}

function distinctWrongKanjiInChapter(question: Question): string[] {
  return distinctWrongKanjiFromPool(
    question,
    QUESTIONS_BY_CHAPTER.get(question.chapter) ?? []
  );
}

function distinctWrongKanjiInTopic(question: Question): string[] {
  return distinctWrongKanjiFromPool(
    question,
    QUESTIONS_BY_TOPIC.get(question.topic) ?? []
  );
}

function distinctWrongKanjiSameReading(question: Question): string[] {
  return distinctWrongKanjiFromPool(
    question,
    QUESTIONS_BY_READING.get(question.blank.reading) ?? []
  );
}

/**
 * 紛らわしい漢字を優先した4択生成（SPEC）
 * 優先順: 1) 同章の他blank.kanjiユニーク 2) 同topic 3) 同reading 4) 全体
 */
export function getChoicesForKanjiMode(
  question: Question,
  _allQuestions: Question[],
  random: () => number = Math.random
): string[] {
  const correct = question.blank.kanji;
  const seen = new Set<string>([correct]);
  const wrong: string[] = [];

  const addFromPool = (pool: string[]) => {
    for (const k of shuffle(pool, random)) {
      if (wrong.length >= 3) break;
      if (!seen.has(k)) {
        seen.add(k);
        wrong.push(k);
      }
    }
  };

  addFromPool(distinctWrongKanjiInChapter(question));

  if (wrong.length < 3) {
    addFromPool(distinctWrongKanjiInTopic(question));
  }

  if (wrong.length < 3) {
    addFromPool(distinctWrongKanjiSameReading(question));
  }

  if (wrong.length < 3) {
    const rest = shuffle(ALL_QUESTIONS, random);
    for (const q of rest) {
      if (wrong.length >= 3) break;
      const k = q.blank.kanji;
      if (seen.has(k)) continue;
      seen.add(k);
      wrong.push(k);
    }
  }
  return shuffle([correct, ...wrong.slice(0, 3)], random);
}

/** 後方互換: sentence 内の出題箇所（簡易検索） */
export function findBlankPosition(
  sentence: string,
  kanji: string
): { start: number; end: number } {
  const start = sentence.indexOf(kanji);
  if (start === -1) {
    return { start: -1, end: -1 };
  }
  return { start, end: start + kanji.length };
}

/** ローカル日付のみでシード（YYYYMMDD 形式の数値） */
export function dailySeed(date: Date): number {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return y * 10000 + m * 100 + d;
}

/** 日付シードで固定10問 */
export function getDailyQuestions(
  date: Date,
  pool: Question[] = ALL_QUESTIONS
): Question[] {
  const seed = dailySeed(date);
  const indices = Array.from({ length: pool.length }, (_, i) => i);
  const order = shuffleWithSeed(indices, seed);
  return order.slice(0, 10).map((i) => pool[i]!);
}

/* --- 出題UI向けヘルパー --- */

export function questionsByMode(mode: "reading" | "kanji"): Question[] {
  return ALL_QUESTIONS.filter((q) =>
    mode === "reading" ? q.type === "reading" : q.type === "writing"
  );
}

export function getChapterCounts(mode: "reading" | "kanji"): Record<number, number> {
  const counts: Record<number, number> = {};
  for (let c = 1; c <= 18; c++) counts[c] = 0;
  for (const q of questionsByMode(mode)) {
    counts[q.chapter] = (counts[q.chapter] ?? 0) + 1;
  }
  return counts;
}

export function filterByChapters(
  questions: Question[],
  chapters: number[]
): Question[] {
  const set = new Set(chapters);
  return questions.filter((q) => set.has(q.chapter));
}

export function pickQuestionCount(
  questions: Question[],
  count: number | "all"
): Question[] {
  if (count === "all" || count >= questions.length) return questions;
  return questions.slice(0, count);
}

export function getQuestionsInChapter(
  chapter: number,
  mode: "reading" | "kanji"
): Question[] {
  return questionsByMode(mode).filter((q) => q.chapter === chapter);
}
