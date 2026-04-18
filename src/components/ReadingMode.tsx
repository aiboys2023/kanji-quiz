"use client";

/* eslint-disable react-hooks/set-state-in-effect -- reset local state when question/timer changes */
import { useState, useRef, useEffect } from "react";
import type { Question } from "@/data/questions";
import SentenceDisplay from "./SentenceDisplay";
import ReadingInput from "./ReadingInput";

interface Props {
  question: Question;
  onComplete: (correct: number, total: number) => void;
  /** タイムアップのたびに親がインクリメント → 不正解扱い */
  timerPulse?: number;
  /** 正誤が確定したとき（マスコット演出用） */
  onFeedback?: (correct: boolean) => void;
}

export default function ReadingMode({
  question,
  onComplete,
  timerPulse = 0,
  onFeedback,
}: Props) {
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<boolean | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastPulseForQuestion = useRef<number | null>(null);

  useEffect(() => {
    setAnswer("");
    setResult(null);
    lastPulseForQuestion.current = null;
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [question.sentence, question.chapter, question.blank.kanji]);

  useEffect(() => {
    if (timerPulse <= 0 || result !== null) return;
    if (lastPulseForQuestion.current === timerPulse) return;
    lastPulseForQuestion.current = timerPulse;
    setResult(false);
  }, [timerPulse, result]);

  useEffect(() => {
    if (result !== null) onFeedback?.(result);
  }, [result, onFeedback]);

  const handleSubmit = () => {
    setResult(answer.trim() === question.blank.reading);
  };

  const handleNext = () => {
    onComplete(result ? 1 : 0, 1);
  };

  return (
    <div className="w-full max-w-lg space-y-5 animate-pop-in">
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
