"use client";

import { cn } from "@/lib/cn";

interface KanjiChoicesProps {
  choices: string[];
  correctKanji: string;
  onSelect: (kanji: string) => void;
  disabled?: boolean;
  selected?: string | null;
  revealed?: boolean;
  className?: string;
}

/**
 * 4択。モバイル 2x2 / md+ 1x4。ステッカー風（太枠 + シャドウ）。
 */
export default function KanjiChoices({
  choices,
  correctKanji,
  onSelect,
  disabled,
  selected,
  revealed,
  className,
}: KanjiChoicesProps) {
  const list = choices.slice(0, 4);
  while (list.length < 4) list.push("");

  const liveMsg = revealed
    ? (selected ?? "") === correctKanji
      ? "せいかいです"
      : "ふせいかい。せいかいは表示されています"
    : "";

  return (
    <div
      className={cn(
        "grid grid-cols-2 md:grid-cols-4 gap-3 w-full",
        className
      )}
      role="group"
      aria-label="漢字の選択肢"
    >
      <span className="sr-only" aria-live="polite">
        {liveMsg}
      </span>
      {list.map((kanji, i) => {
        const isCorrect = kanji === correctKanji;
        const isWrongPick = revealed && selected === kanji && !isCorrect;
        const showCorrect = revealed && isCorrect;

        return (
          <button
            key={`${kanji}-${i}`}
            type="button"
            disabled={disabled || !kanji}
            onClick={() => kanji && onSelect(kanji)}
            className={cn(
              "retro-btn min-h-12 rounded-2xl py-3 text-[1.2rem] font-bold transition-colors",
              !revealed && "bg-blue text-white",
              showCorrect && "bg-green text-white ring-2 ring-green",
              isWrongPick && "bg-red text-white",
              revealed && !showCorrect && !isWrongPick && "opacity-45"
            )}
          >
            {kanji || "—"}
          </button>
        );
      })}
    </div>
  );
}
