"use client";

import { useState, useRef, useEffect } from "react";
import type { Question } from "@/data/questions";

interface Props {
  question: Question;
  onComplete: (correct: number, total: number) => void;
}

export default function ReadingMode({ question, onComplete }: Props) {
  const [answers, setAnswers] = useState<string[]>(
    question.blanks.map(() => "")
  );
  const [results, setResults] = useState<boolean[] | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setAnswers(question.blanks.map(() => ""));
    setResults(null);
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  }, [question]);

  const handleSubmit = () => {
    const checked = question.blanks.map(
      (blank, i) => answers[i].trim() === blank.reading
    );
    setResults(checked);
  };

  const handleNext = () => {
    if (!results) return;
    const correct = results.filter(Boolean).length;
    onComplete(correct, results.length);
  };

  const renderSentence = () => {
    const parts: React.ReactNode[] = [];
    let lastEnd = 0;

    for (let i = 0; i < question.blanks.length; i++) {
      const blank = question.blanks[i];
      if (blank.start > lastEnd) {
        parts.push(
          <span key={`text-${i}`}>
            {question.sentence.slice(lastEnd, blank.start)}
          </span>
        );
      }
      parts.push(
        <span
          key={`kanji-${i}`}
          className="inline-block px-1.5 py-0.5 bg-orange rounded-lg font-bold text-white mx-0.5 sticker-sm"
        >
          {blank.kanji}
        </span>
      );
      lastEnd = blank.end;
    }
    if (lastEnd < question.sentence.length) {
      parts.push(
        <span key="text-end">{question.sentence.slice(lastEnd)}</span>
      );
    }
    return parts;
  };

  return (
    <div className="w-full max-w-lg space-y-5 animate-pop-in">
      {/* Sentence card */}
      <div className="sticker rounded-2xl bg-white p-5">
        <div className="text-xl leading-loose">{renderSentence()}</div>
      </div>

      {/* Answer inputs */}
      <div className="space-y-3">
        {question.blanks.map((blank, i) => (
          <div key={i} className="flex items-center gap-2 animate-pop-in" style={{ animationDelay: `${i * 0.1}s` }}>
            <span className="sticker-sm rounded-lg bg-orange px-2 py-1 text-sm font-bold text-white min-w-[70px] text-center">
              {blank.kanji}
            </span>
            <span className="text-xl">→</span>
            <input
              ref={(el) => {
                inputRefs.current[i] = el;
              }}
              type="text"
              value={answers[i]}
              onChange={(e) => {
                const newAnswers = [...answers];
                newAnswers[i] = e.target.value;
                setAnswers(newAnswers);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (i + 1 < question.blanks.length) {
                    inputRefs.current[i + 1]?.focus();
                  } else if (!results) {
                    handleSubmit();
                  } else {
                    handleNext();
                  }
                }
              }}
              disabled={results !== null}
              placeholder="ひらがな"
              className={`flex-1 px-3 py-2 rounded-xl text-lg outline-none retro-input ${
                results === null
                  ? "bg-white"
                  : results[i]
                    ? "bg-green/20 !border-green"
                    : "bg-red/20 !border-red"
              }`}
            />
            {results !== null && !results[i] && (
              <span className="sticker-sm rounded-lg bg-red px-2 py-1 text-sm font-bold text-white">
                {blank.reading}
              </span>
            )}
            {results !== null && results[i] && (
              <span className="text-2xl">⭕</span>
            )}
          </div>
        ))}
      </div>

      {results === null ? (
        <button
          onClick={handleSubmit}
          className="w-full retro-btn rounded-2xl py-3 bg-orange text-white text-xl cursor-pointer"
        >
          チェック！✓
        </button>
      ) : (
        <button
          onClick={handleNext}
          className="w-full retro-btn rounded-2xl py-3 bg-yellow text-xl cursor-pointer"
        >
          つぎへ →
        </button>
      )}
    </div>
  );
}
