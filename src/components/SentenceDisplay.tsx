"use client";

import type { ReactNode } from "react";
import type { Question, Ruby } from "@/data/questions";
import { resolveBlankSpan } from "@/lib/blankSpan";

interface Props {
  question: Question;
  mode: "reading" | "kanji";
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

export default function SentenceDisplay({ question, mode }: Props) {
  const { sentence, blank, rubies } = question;

  const { start: blankStart, end: blankEnd } = resolveBlankSpan(question);

  const rubySegs = collectRubySegments(sentence, rubies, blankStart, blankEnd);

  const segments: Segment[] = [
    ...rubySegs,
    ...(blankStart >= 0
      ? [{ type: "blank" as const, start: blankStart, end: blankEnd }]
      : []),
  ].sort((a, b) => a.start - b.start);

  const parts: ReactNode[] = [];
  let cursor = 0;

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
          <rt className="text-[0.65em] text-stone-600 font-normal leading-tight">{seg.ruby}</rt>
          <rp>)</rp>
        </ruby>
      );
    } else {
      const highlight =
        mode === "reading" ? "bg-orange text-white" : "bg-blue text-white";
      const label = mode === "reading" ? blank.kanji : blank.reading;
      parts.push(
        <span
          key={`b-${i}`}
          className={`inline-block px-1.5 py-0.5 ${highlight} rounded-lg font-bold mx-0.5 sticker-sm align-baseline text-[1.2rem]`}
        >
          {label}
        </span>
      );
    }
    cursor = seg.end;
  }

  if (cursor < sentence.length) {
    parts.push(<span key="end">{sentence.slice(cursor)}</span>);
  }

  return (
    <div className="text-[1.2rem] md:text-[1.25rem] leading-[2.2] tracking-wide">
      {parts}
    </div>
  );
}
