"use client";

import { useState, useCallback, type KeyboardEvent } from "react";
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
  inputRef?: React.RefObject<HTMLInputElement | null>;
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
  inputRef: inputRefProp,
}: ReadingInputProps) {
  const [isComposing, setIsComposing] = useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== "Enter") return;
      if (isComposing || e.nativeEvent.isComposing) return;
      e.preventDefault();
      if (!disabled) onSubmit();
    },
    [disabled, isComposing, onSubmit]
  );

  const feedback =
    result === null
      ? "bg-white"
      : result
        ? "bg-green/20 border-green"
        : "bg-red/20 border-red";

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
        onCompositionEnd={() => setIsComposing(false)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        aria-label="読みを入力"
        className={cn(
          "flex-1 min-h-12 min-w-0 px-3 py-2 rounded-xl text-[1.2rem] outline-none retro-input border-[#1a1a2e]",
          feedback,
          inputClassName
        )}
      />
      {result !== null && !result && correctReading !== undefined && (
        <span className="sticker-sm rounded-lg bg-red px-2 py-1 text-sm font-bold text-white shrink-0">
          {correctReading}
        </span>
      )}
      {result !== null && result && (
        <span className="text-3xl shrink-0" aria-label="正解">
          ⭕
        </span>
      )}
    </div>
  );
}
