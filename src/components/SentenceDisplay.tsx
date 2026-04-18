"use client";

import type { ReactNode } from "react";
import type { Question, Ruby } from "@/data/questions";
import {
  consumeRubiesInRange,
  getExpectedReadingAnswer,
  resolveBlankSpan,
} from "@/lib/blankSpan";

interface Props {
  question: Question;
  mode: "reading" | "kanji";
  /** 出題枠の正誤表示（見た目のみ） */
  blankFeedback?: "correct" | "wrong" | null;
  /** 読み方モード：答え合わせ後にルビを表示 */
  showReadingReveal?: boolean;
}

function collectRubySegments(
  sentence: string,
  rubies: Ruby[],
  blankStart: number,
  blankEnd: number
): { type: "ruby"; text: string; ruby: string; start: number; end: number }[] {
  const out: {
    type: "ruby";
    text: string;
    ruby: string;
    start: number;
    end: number;
  }[] = [];
  let cursor = 0;
  let r = 0;
  while (cursor < sentence.length) {
    if (cursor === blankStart) {
      r = consumeRubiesInRange(sentence, rubies, r, blankStart, blankEnd);
      cursor = blankEnd;
      continue;
    }
    if (r < rubies.length && sentence.startsWith(rubies[r].text, cursor)) {
      out.push({
        type: "ruby",
        text: rubies[r].text,
        ruby: rubies[r].ruby,
        start: cursor,
        end: cursor + rubies[r].text.length,
      });
      cursor += rubies[r].text.length;
      r++;
      continue;
    }
    if (r < rubies.length) {
      console.warn(
        `[SentenceDisplay] ruby sequence mismatch at ${cursor}: expected "${rubies[r]?.text}"`,
        { sentence: sentence.slice(0, 80) }
      );
    }
    cursor++;
  }
  if (r !== rubies.length) {
    console.warn(
      `[SentenceDisplay] rubies not fully consumed: ${r}/${rubies.length}`
    );
  }
  return out;
}

type Segment =
  | { type: "ruby"; text: string; ruby: string; start: number; end: number }
  | { type: "blank"; start: number; end: number };

function blankBgClass(
  mode: "reading" | "kanji",
  blankFeedback: Props["blankFeedback"]
): string {
  if (blankFeedback === "correct") return "bg-[var(--pop-correct)]";
  if (blankFeedback === "wrong") return "bg-[var(--pop-wrong)]";
  /* Reading: yellow highlight blank; Kanji: pink tag for hiragana */
  return mode === "reading"
    ? "bg-[var(--pop-streak)]"
    : "bg-[var(--pop-pink)]";
}

export default function SentenceDisplay({
  question,
  mode,
  blankFeedback = null,
  showReadingReveal = false,
}: Props) {
  const { sentence, blank, rubies } = question;
  const blankOkurigana = blank.okurigana ?? "";
  const kanjiModePrompt = `${blank.reading}${blankOkurigana}`;

  const { start: blankStart, end: blankEnd } = resolveBlankSpan(question);
  const blankSurface =
    blankStart >= 0 && mode === "reading"
      ? sentence.slice(blankStart, blankEnd)
      : blank.kanji;
  const readingRevealText = getExpectedReadingAnswer(question);

  const rubySegs = collectRubySegments(sentence, rubies, blankStart, blankEnd);

  const segments: Segment[] = [
    ...rubySegs,
    ...(blankStart >= 0
      ? [{ type: "blank" as const, start: blankStart, end: blankEnd }]
      : []),
  ].sort((a, b) => a.start - b.start);

  const parts: ReactNode[] = [];
  let cursor = 0;

  const blankBox =
    "inline-block rounded-[8px] border-[2px] border-black px-1.5 font-black text-black align-baseline text-[1.5rem] leading-tight";

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    if (seg.start > cursor) {
      parts.push(<span key={`p-${i}`}>{sentence.slice(cursor, seg.start)}</span>);
    }
    if (seg.type === "ruby") {
      parts.push(
        <ruby key={`r-${i}`} className="text-inherit">
          {seg.text}
          <rp>(</rp>
          <rt className="text-[11px] font-bold leading-tight text-black opacity-70">
            {seg.ruby}
          </rt>
          <rp>)</rp>
        </ruby>
      );
    } else {
      if (mode === "reading") {
        parts.push(
          <ruby key={`b-${i}`}>
            <span className={`${blankBox} ${blankBgClass(mode, blankFeedback)}`}>
              {blankSurface}
            </span>
            <rp>(</rp>
            <rt className="pt-1 text-[11px] font-black text-black">
              {showReadingReveal ? readingRevealText : ""}
            </rt>
            <rp>)</rp>
          </ruby>
        );
      } else {
        parts.push(
          <span
            key={`b-${i}`}
            className={`${blankBox} mx-1 ${blankBgClass(mode, blankFeedback)}`}
          >
            {kanjiModePrompt}
          </span>
        );
      }
    }
    cursor = seg.end;
  }

  if (cursor < sentence.length) {
    parts.push(<span key="end">{sentence.slice(cursor)}</span>);
  }

  return (
    <div className="text-[1.625rem] font-bold leading-[2.6] tracking-[0.02em] text-black">
      {parts}
    </div>
  );
}
