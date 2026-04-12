"use client";

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
}

export default function KanjiMode({
  question,
  onComplete,
  timerPulse = 0,
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

  const handlePick = (kanji: string) => {
    if (revealed) return;
    setSelected(kanji);
    setRevealed(true);
  };

  const handleNext = () => {
    const ok = selected === question.blank.kanji;
    onComplete(ok ? 1 : 0, 1);
  };

  return (
    <div className="w-full max-w-lg space-y-5 animate-pop-in">
      <div className="sticker rounded-2xl bg-white p-5">
        <SentenceDisplay question={question} mode="kanji" />
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
        <p className="text-center text-sm font-bold opacity-70">
          タップですぐチェック！
        </p>
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
