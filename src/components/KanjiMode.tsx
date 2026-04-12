"use client";

import { useState, useEffect, useMemo } from "react";
import {
  ALL_QUESTIONS,
  getChoicesForKanjiMode,
  type Question,
} from "@/data/questions";
import SentenceDisplay from "./SentenceDisplay";
import KanjiChoices from "./KanjiChoices";
import CatMascot, { type CatMood } from "./CatMascot";
import Confetti from "./Confetti";

interface Props {
  question: Question;
  onComplete: (correct: number, total: number) => void;
  streak?: number;
}

export default function KanjiMode({ question, onComplete, streak = 0 }: Props) {
  const choices = useMemo(
    () => getChoicesForKanjiMode(question, ALL_QUESTIONS),
    [question]
  );
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [burst, setBurst] = useState(false);

  useEffect(() => {
    setSelected(null);
    setRevealed(false);
    setBurst(false);
  }, [question.sentence, question.chapter, question.blank.kanji]);

  useEffect(() => {
    if (revealed && selected === question.blank.kanji) {
      setBurst(true);
      const t = window.setTimeout(() => setBurst(false), 2200);
      return () => window.clearTimeout(t);
    }
  }, [revealed, selected, question.blank.kanji]);

  const handlePick = (kanji: string) => {
    if (revealed) return;
    setSelected(kanji);
    setRevealed(true);
  };

  const handleNext = () => {
    const ok = selected === question.blank.kanji;
    onComplete(ok ? 1 : 0, 1);
  };

  const correct = selected === question.blank.kanji;
  let mood: CatMood = "thinking";
  if (streak >= 10) mood = "super";
  else if (revealed && correct) mood = "excited";
  else if (revealed && !correct) mood = "encourage";

  return (
    <div className="w-full max-w-lg space-y-5 animate-pop-in relative">
      <Confetti active={burst} />
      <div className="flex justify-center">
        <CatMascot
          mood={mood}
          size={160}
          className={mood === "excited" ? "animate-mascot-jump" : ""}
        />
      </div>

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
