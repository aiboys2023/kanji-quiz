"use client";

/* eslint-disable react-hooks/set-state-in-effect -- reset local state when question/timer changes */
import { useState, useEffect, useMemo, useRef } from "react";
import {
  ALL_QUESTIONS,
  getChoicesForKanjiMode,
  type Question,
} from "@/data/questions";
import SentenceDisplay from "./SentenceDisplay";
import KanjiChoices from "./KanjiChoices";

interface Props {
  question: Question;
  onComplete: (correct: number, total: number) => void;
  timerPulse?: number;
  onFeedback?: (correct: boolean) => void;
}

export default function KanjiMode({
  question,
  onComplete,
  timerPulse = 0,
  onFeedback,
}: Props) {
  const choices = useMemo(
    () => getChoicesForKanjiMode(question, ALL_QUESTIONS),
    [question]
  );
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const lastPulseForQuestion = useRef<number | null>(null);

  useEffect(() => {
    setSelected(null);
    setRevealed(false);
    lastPulseForQuestion.current = null;
  }, [question.sentence, question.chapter, question.blank.kanji]);

  useEffect(() => {
    if (timerPulse <= 0 || revealed) return;
    if (lastPulseForQuestion.current === timerPulse) return;
    lastPulseForQuestion.current = timerPulse;
    setSelected("");
    setRevealed(true);
  }, [timerPulse, revealed]);

  useEffect(() => {
    if (!revealed) return;
    onFeedback?.(selected === question.blank.kanji);
  }, [revealed, selected, onFeedback, question.blank.kanji]);

  const handlePick = (kanji: string) => {
    if (revealed) return;
    setSelected(kanji);
    setRevealed(true);
  };

  const handleNext = () => {
    const ok = selected === question.blank.kanji;
    onComplete(ok ? 1 : 0, 1);
  };

  const blankFb = !revealed
    ? null
    : selected === question.blank.kanji
      ? ("correct" as const)
      : ("wrong" as const);

  return (
    <div className="w-full max-w-lg space-y-5 animate-pop-in">
      <div className="pop-pill bg-[var(--pop-correct)] text-black">
        第{question.chapter}章 · {question.topic}
      </div>
      <p className="text-[11px] font-black tracking-[0.15em] text-black">
        ● 正しい漢字を選んでください
      </p>
      <div className="pop-card rounded-2xl bg-white p-5">
        <SentenceDisplay
          question={question}
          mode="kanji"
          blankFeedback={blankFb}
        />
      </div>

      <KanjiChoices
        choices={choices}
        correctKanji={question.blank.kanji}
        onSelect={handlePick}
        disabled={revealed}
        selected={selected}
        revealed={revealed}
      />

      {!revealed ? (
        <p className="text-center text-sm font-bold text-black/70">
          タップですぐチェック！
        </p>
      ) : (
        <>
          {selected !== question.blank.kanji && (
            <div className="pop-card rounded-2xl border-[3px] border-black bg-[var(--pop-wrong)] p-3 shadow-[5px_5px_0_#000]">
              <div className="text-[11px] font-black tracking-wide text-black">
                ANSWER
              </div>
              <div className="mt-1 text-xl font-black text-black">
                {question.blank.kanji}
                <span className="ml-2 text-sm font-bold opacity-80">
                  {question.blank.reading}
                </span>
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={handleNext}
            className={`pop-btn min-h-12 w-full rounded-2xl py-3.5 text-[1.2rem] text-white ${
              selected === question.blank.kanji
                ? "bg-[var(--pop-correct)]"
                : "bg-[var(--pop-wrong)]"
            }`}
          >
            ツギへ →
          </button>
        </>
      )}
    </div>
  );
}
