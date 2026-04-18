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

const ACCENT_BG = [
  "bg-[var(--pop-pink)]",
  "bg-[var(--pop-sky)]",
  "bg-[var(--pop-streak)]",
  "bg-white",
];

/**
 * 4択。モバイル 2x2 / md+ 1x4。Pop ステッカー風。
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
        "grid w-full grid-cols-2 gap-3 md:grid-cols-4",
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
        const showWrong = revealed && isWrongPick;
        const base = ACCENT_BG[i % ACCENT_BG.length];

        return (
          <button
            key={`${kanji}-${i}`}
            type="button"
            disabled={disabled || !kanji}
            onClick={() => kanji && onSelect(kanji)}
            className={cn(
              "relative min-h-24 rounded-2xl border-[3px] border-black py-5 text-[2.35rem] font-black text-black transition-colors md:min-h-[5.5rem]",
              !revealed && base,
              showCorrect && "bg-[var(--pop-correct)] text-black",
              showWrong && "bg-[var(--pop-wrong)] text-black",
              revealed && !showCorrect && !showWrong && "opacity-45",
              revealed && !showCorrect && !showWrong
                ? "shadow-[3px_3px_0_#000]"
                : "shadow-[5px_5px_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_#000]"
            )}
          >
            {kanji || "—"}
            {showCorrect && (
              <span
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-black bg-[var(--pop-streak)] text-sm font-black text-black"
                aria-hidden
              >
                ✓
              </span>
            )}
            {showWrong && (
              <span
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black text-sm font-black text-white"
                aria-hidden
              >
                ✕
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
