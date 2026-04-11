"use client";

import { useState, useRef, useEffect } from "react";
import type { Question } from "@/data/questions";
import SentenceDisplay from "./SentenceDisplay";

interface Props {
  question: Question;
  onComplete: (correct: number, total: number) => void;
}

export default function ReadingMode({ question, onComplete }: Props) {
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<boolean | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAnswer("");
    setResult(null);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [question]);

  const handleSubmit = () => {
    setResult(answer.trim() === question.blank.reading);
  };

  const handleNext = () => {
    onComplete(result ? 1 : 0, 1);
  };

  return (
    <div className="w-full max-w-lg space-y-5 animate-pop-in">
      {/* Sentence card */}
      <div className="sticker rounded-2xl bg-white p-5">
        <SentenceDisplay question={question} mode="reading" />
      </div>

      {/* Answer input */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 animate-pop-in">
          <span className="sticker-sm rounded-lg bg-orange px-3 py-1.5 text-base font-bold text-white text-center">
            {question.blank.kanji}
          </span>
          <span className="text-xl">→</span>
          <input
            ref={inputRef}
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (result === null) handleSubmit();
                else handleNext();
              }
            }}
            disabled={result !== null}
            placeholder="ひらがなで入力"
            className={`flex-1 px-3 py-2 rounded-xl text-lg outline-none retro-input ${
              result === null
                ? "bg-white"
                : result
                  ? "bg-green/20 !border-green"
                  : "bg-red/20 !border-red"
            }`}
          />
          {result !== null && !result && (
            <span className="sticker-sm rounded-lg bg-red px-2 py-1 text-sm font-bold text-white">
              {question.blank.reading}
            </span>
          )}
          {result !== null && result && (
            <span className="text-2xl">⭕</span>
          )}
        </div>
      </div>

      {result === null ? (
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
