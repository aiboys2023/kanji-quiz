"use client";

import type { Question } from "@/data/questions";

interface Props {
  question: Question;
  mode: "reading" | "kanji";
}

function blankSpan(sentence: string, question: Props["question"]) {
  const { blank, type } = question;
  if (type === "reading") {
    let s = sentence.indexOf(blank.kanji);
    if (s >= 0) return { start: s, end: s + blank.kanji.length };
    s = sentence.indexOf(blank.reading);
    if (s >= 0) return { start: s, end: s + blank.reading.length };
  } else {
    let s = sentence.indexOf(blank.reading);
    if (s >= 0) return { start: s, end: s + blank.reading.length };
    s = sentence.indexOf(blank.kanji);
    if (s >= 0) return { start: s, end: s + blank.kanji.length };
  }
  return { start: -1, end: -1 };
}

export default function SentenceDisplay({ question, mode }: Props) {
  const { sentence, blank, rubies } = question;

  const { start: blankStart, end: blankEnd } = blankSpan(sentence, question);

  type Segment =
    | { type: "ruby"; text: string; ruby: string; start: number; end: number }
    | { type: "blank"; start: number; end: number };

  const rubySegs: Segment[] = [];
  for (const r of rubies) {
    const pos = sentence.indexOf(r.text);
    if (pos === -1) continue;
    const end = pos + r.text.length;
    if (blankStart >= 0 && pos < blankEnd && end > blankStart) continue;
    rubySegs.push({ type: "ruby", text: r.text, ruby: r.ruby, start: pos, end });
  }

  const segments: Segment[] = [
    ...rubySegs,
    ...(blankStart >= 0 ? [{ type: "blank" as const, start: blankStart, end: blankEnd }] : []),
  ].sort((a, b) => a.start - b.start);

  const parts: React.ReactNode[] = [];
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
      const highlight = mode === "reading" ? "bg-orange text-white" : "bg-blue text-white";
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
