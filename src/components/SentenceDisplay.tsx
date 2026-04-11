"use client";

import type { Question } from "@/data/questions";

interface Props {
  question: Question;
  mode: "reading" | "kanji";
}

/**
 * Renders a sentence with:
 * - Ruby (furigana) on non-target kanji
 * - Highlighted target blank (kanji for reading mode, reading for kanji mode)
 */
export default function SentenceDisplay({ question, mode }: Props) {
  const { sentence, blank, rubies } = question;

  // Merge rubies and blank into a sorted list of annotated ranges
  type Segment =
    | { type: "ruby"; text: string; ruby: string; start: number; end: number }
    | { type: "blank"; text: string; display: string; start: number; end: number };

  const segments: Segment[] = [
    ...rubies.map((r) => ({
      type: "ruby" as const,
      text: r.text,
      ruby: r.ruby,
      start: r.start,
      end: r.end,
    })),
    {
      type: "blank" as const,
      text: blank.kanji,
      display: mode === "reading" ? blank.kanji : blank.reading,
      start: blank.start,
      end: blank.end,
    },
  ].sort((a, b) => a.start - b.start);

  const parts: React.ReactNode[] = [];
  let cursor = 0;

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];

    // Plain text before this segment
    if (seg.start > cursor) {
      parts.push(
        <span key={`plain-${i}`}>{sentence.slice(cursor, seg.start)}</span>
      );
    }

    if (seg.type === "ruby") {
      parts.push(
        <ruby key={`ruby-${i}`} className="text-inherit">
          {seg.text}
          <rp>(</rp>
          <rt className="text-xs text-stone-500 font-normal">{seg.ruby}</rt>
          <rp>)</rp>
        </ruby>
      );
    } else {
      // Blank - highlighted
      const color = mode === "reading" ? "bg-orange" : "bg-blue";
      parts.push(
        <span
          key={`blank-${i}`}
          className={`inline-block px-1.5 py-0.5 ${color} rounded-lg font-bold text-white mx-0.5 sticker-sm`}
        >
          {seg.display}
        </span>
      );
    }

    cursor = seg.end;
  }

  // Remaining text
  if (cursor < sentence.length) {
    parts.push(<span key="end">{sentence.slice(cursor)}</span>);
  }

  return <div className="text-xl leading-[2.5]">{parts}</div>;
}
