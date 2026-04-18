"use client";

import { useCallback, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";

interface ReadingInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  result: boolean | null;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  correctReading?: string;
  okuriganaHint?: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  /** false のとき、行末の正解表示バッジを出さない（親がカード表示する場合） */
  showInlineAnswer?: boolean;
}

/**
 * ひらがな入力。IME: compositionstart/end と isComposing で Enter を無視。
 */
export default function ReadingInput({
  value,
  onChange,
  onSubmit,
  disabled,
  result,
  placeholder = "ひらがなで入力",
  className,
  inputClassName,
  correctReading,
  okuriganaHint,
  inputRef: inputRefProp,
  showInlineAnswer = true,
}: ReadingInputProps) {
  const [isComposing, setIsComposing] = useState(false);
  const ignoreEnterAfterCompositionRef = useRef(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== "Enter") return;
      if ((e as unknown as { keyCode?: number }).keyCode === 229) return;
      if (isComposing || e.nativeEvent.isComposing) return;
      if (ignoreEnterAfterCompositionRef.current) return;
      e.preventDefault();
      if (!disabled) onSubmit();
    },
    [disabled, isComposing, onSubmit]
  );

  const feedback =
    result === null
      ? "bg-white"
      : result
        ? "bg-[var(--pop-correct-lt)]"
        : "bg-[var(--pop-wrong-lt)]";

  const liveMessage =
    result === null
      ? ""
      : result
        ? "せいかいです"
        : `ふせいかい。せいかいは ${correctReading ?? ""}`;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <input
        ref={inputRefProp}
        type="text"
        inputMode="text"
        lang="ja"
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => {
          setIsComposing(false);
          ignoreEnterAfterCompositionRef.current = true;
          window.setTimeout(() => {
            ignoreEnterAfterCompositionRef.current = false;
          }, 0);
        }}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        aria-label="読みを入力"
        className={cn(
          "retro-input min-h-12 min-w-0 flex-1 rounded-2xl border-[3px] border-black px-4 py-3 text-[1.2rem] font-bold text-black outline-none",
          feedback,
          inputClassName
        )}
      />
      <span className="sr-only" aria-live="polite">
        {liveMessage}
      </span>
      {okuriganaHint && (
        <span className="shrink-0 rounded-xl border-2 border-black bg-white px-2 py-1 text-xs font-bold text-black shadow-[2px_2px_0_#000]">
          送り仮名: {okuriganaHint}
        </span>
      )}
      {showInlineAnswer && result !== null && !result && correctReading !== undefined && (
        <span className="shrink-0 rounded-xl border-2 border-black bg-black px-2 py-1 text-sm font-black text-white shadow-[2px_2px_0_#000]">
          {correctReading}
        </span>
      )}
      {showInlineAnswer && result !== null && result && (
        <span className="shrink-0 text-3xl" aria-label="正解">
          ⭕
        </span>
      )}
    </div>
  );
}
