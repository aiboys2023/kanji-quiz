"use client";

/* eslint-disable react-hooks/set-state-in-effect -- reset local state when question/timer changes */
import { useState, useRef, useEffect } from "react";
import type { Question } from "@/data/questions";
import { getExpectedReadingAnswer, resolveBlankSpan } from "@/lib/blankSpan";
import { BurstShape } from "@/components/pop/PopDeco";
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
  const okurigana = question.blank.okurigana ?? "";
  const span = resolveBlankSpan(question);
  const displayKanji =
    span.start >= 0
      ? question.sentence.slice(span.start, span.end)
      : `${question.blank.kanji}${okurigana}`;
  const expectedReading = getExpectedReadingAnswer(question);

  useEffect(() => {
    setAnswer("");
    setResult(null);
    lastPulseForQuestion.current = null;
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [
    question.sentence,
    question.chapter,
    question.blank.kanji,
    question.blank.reading,
    question.blank.okurigana,
  ]);

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
    setResult(answer.trim() === expectedReading);
  };

  const handleNext = () => {
    onComplete(result ? 1 : 0, 1);
  };

  const blankFb =
    result === null ? null : result ? ("correct" as const) : ("wrong" as const);

  return (
    <div className="w-full max-w-lg space-y-5 animate-pop-in">
      <div className="pop-pill bg-[var(--pop-streak)] text-black">
        第{question.chapter}章 · {question.topic}
      </div>
      <p className="text-[11px] font-black tracking-[0.15em] text-black">
        ● 読み方を答えてください
      </p>
      <div className="pop-card rounded-2xl bg-white p-5">
        <SentenceDisplay
          question={question}
          mode="reading"
          blankFeedback={blankFb}
          showReadingReveal={result !== null}
        />
      </div>

      {result !== null && !result && (
        <div className="pop-card rounded-2xl border-[3px] border-black bg-[var(--pop-wrong)] p-3.5 shadow-[5px_5px_0_#000]">
          <div className="text-[11px] font-black tracking-wide text-black">
            ANSWER
          </div>
          <div className="mt-1 text-[1.35rem] font-black text-black">
            {displayKanji}
            <span className="ml-3 text-sm font-bold opacity-80">
              {expectedReading}
            </span>
          </div>
        </div>
      )}

      {result !== null && result && (
        <div className="pop-card flex items-center gap-3 rounded-2xl border-[3px] border-black bg-[var(--pop-correct)] p-3.5 shadow-[5px_5px_0_#000]">
          <BurstShape size={36} color="var(--pop-streak)" text="✓" rotate={-8} />
          <div className="text-[1.35rem] font-black text-black">セイカイ！</div>
        </div>
      )}

      <div className="space-y-3 px-1 py-2">
        <ReadingInput
          value={answer}
          onChange={setAnswer}
          onSubmit={result === null ? handleSubmit : handleNext}
          disabled={result !== null}
          result={result}
          placeholder="ひらがなで入力"
          correctReading={expectedReading}
          okuriganaHint={undefined}
          inputRef={inputRef}
          showInlineAnswer={false}
          className="flex flex-wrap items-center gap-2"
        />
      </div>

      {result === null ? (
        <button
          type="button"
          onClick={handleSubmit}
          className="pop-btn min-h-12 w-full rounded-2xl bg-[var(--pop-accent)] py-3.5 text-[1.2rem] text-white"
        >
          決定
        </button>
      ) : (
        <button
          type="button"
          onClick={handleNext}
          className={`pop-btn min-h-12 w-full rounded-2xl py-3.5 text-[1.2rem] text-white ${
            result ? "bg-[var(--pop-correct)]" : "bg-[var(--pop-wrong)]"
          }`}
        >
          ツギへ →
        </button>
      )}
    </div>
  );
}
