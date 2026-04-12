"use client";

import { useState, useRef, useEffect } from "react";
import type { Question } from "@/data/questions";
import SentenceDisplay from "./SentenceDisplay";
import ReadingInput from "./ReadingInput";
import CatMascot, { type CatMood } from "./CatMascot";
import Confetti from "./Confetti";

interface Props {
  question: Question;
  onComplete: (correct: number, total: number) => void;
  streak?: number;
}

export default function ReadingMode({ question, onComplete, streak = 0 }: Props) {
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<boolean | null>(null);
  const [burst, setBurst] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAnswer("");
    setResult(null);
    setBurst(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [question.sentence, question.chapter, question.blank.kanji]);

  useEffect(() => {
    if (result === true) {
      setBurst(true);
      const t = window.setTimeout(() => setBurst(false), 2200);
      return () => window.clearTimeout(t);
    }
  }, [result]);

  const handleSubmit = () => {
    setResult(answer.trim() === question.blank.reading);
  };

  const handleNext = () => {
    onComplete(result ? 1 : 0, 1);
  };

  let mood: CatMood = "thinking";
  if (streak >= 10) mood = "super";
  else if (result === true) mood = "excited";
  else if (result === false) mood = "encourage";

  return (
    <div className="w-full max-w-lg space-y-5 animate-pop-in relative">
      <Confetti active={burst} loop={false} />
      <div className="flex justify-center">
        <CatMascot mood={mood} size={160} className={mood === "excited" ? "animate-mascot-jump" : ""} />
      </div>

      <div className="sticker rounded-2xl bg-white p-5">
        <SentenceDisplay question={question} mode="reading" />
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="sticker-sm rounded-lg bg-orange px-3 py-2 text-[1.2rem] font-bold text-white">
            {question.blank.kanji}
          </span>
          <span className="text-[1.2rem]">→</span>
          <ReadingInput
            value={answer}
            onChange={setAnswer}
            onSubmit={result === null ? handleSubmit : handleNext}
            disabled={result !== null}
            result={result}
            correctReading={question.blank.reading}
            inputRef={inputRef}
            className="flex-1 min-w-[12rem]"
          />
        </div>
      </div>

      {result === null ? (
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full min-h-12 retro-btn rounded-2xl py-3 bg-orange text-white text-[1.2rem] cursor-pointer"
        >
          チェック！✓
        </button>
      ) : (
        <button
          type="button"
          onClick={handleNext}
          className="w-full min-h-12 retro-btn rounded-2xl py-3 bg-yellow text-[1.2rem] font-bold cursor-pointer"
        >
          つぎへ →
        </button>
      )}
    </div>
  );
}
