import type { Question, Ruby } from "@/data/questions";

/** ひらがな（互換用・接頭辞判定の補助） */
function isHiraganaChar(ch: string): boolean {
  if (ch.length !== 1) return false;
  const cp = ch.codePointAt(0)!;
  return cp >= 0x3041 && cp <= 0x3096;
}

/**
 * 読み問題: 漢字ブロック直前の接頭ひらがな（お/ご など、最大2文字）をボックスに含める。
 * 漢字に隣接する右端が お/ご のときだけ吸収し、を などは含めない。
 */
export function absorbHonorificPrefix(sentence: string, coreStart: number): number {
  if (coreStart < 1) return coreStart;
  const right = sentence[coreStart - 1]!;
  if (!isHiraganaChar(right) || (right !== "お" && right !== "ご")) {
    return coreStart;
  }
  if (coreStart >= 2) {
    const left = sentence[coreStart - 2]!;
    if (isHiraganaChar(left) && (left === "お" || left === "ご")) {
      return coreStart - 2;
    }
  }
  return coreStart - 1;
}

export function consumeRubiesInRange(
  sentence: string,
  rubies: Ruby[],
  rubyIndex: number,
  start: number,
  end: number
): number {
  let cursor = start;
  let r = rubyIndex;
  while (cursor < end && r < rubies.length) {
    const text = rubies[r]?.text ?? "";
    if (
      text.length > 0 &&
      sentence.startsWith(text, cursor) &&
      cursor + text.length <= end
    ) {
      cursor += text.length;
      r++;
      continue;
    }
    cursor++;
  }
  return r;
}

export function verifyBlankSpan(
  sentence: string,
  rubies: Ruby[],
  blankStart: number,
  blankEnd: number
): boolean {
  let cursor = 0;
  let r = 0;
  const len = sentence.length;
  while (cursor < len) {
    if (cursor === blankStart) {
      r = consumeRubiesInRange(sentence, rubies, r, blankStart, blankEnd);
      cursor = blankEnd;
      continue;
    }
    if (r < rubies.length && sentence.startsWith(rubies[r].text, cursor)) {
      cursor += rubies[r].text.length;
      r++;
      continue;
    }
    cursor++;
  }
  return r === rubies.length;
}

function enumerateBlankCandidates(question: Question): { start: number; end: number }[] {
  const { blank, type, sentence } = question;
  const seen = new Set<string>();
  const out: { start: number; end: number }[] = [];
  const push = (start: number, end: number) => {
    const k = `${start}-${end}`;
    if (seen.has(k)) return;
    seen.add(k);
    out.push({ start, end });
  };
  const addMatches = (needle: string, endLength: number = needle.length) => {
    if (!needle) return;
    for (let i = 0; i < sentence.length; i++) {
      if (sentence.startsWith(needle, i)) {
        push(i, i + endLength);
      }
    }
  };

  if (type === "reading") {
    const okurigana = blank.okurigana ?? "";
    const needle = `${blank.kanji}${okurigana}`;
    if (needle) {
      for (let i = 0; i < sentence.length; i++) {
        if (sentence.startsWith(needle, i)) {
          const start = absorbHonorificPrefix(sentence, i);
          push(start, i + needle.length);
        }
      }
    }
  } else {
    addMatches(blank.reading);
    addMatches(blank.kanji);
  }
  return out;
}

/** ルビ列と整合する唯一の（または最初の）blankスパン */
export function resolveBlankSpan(question: Question): { start: number; end: number } {
  const { sentence, rubies } = question;
  const candidates = enumerateBlankCandidates(question);
  const valid: { start: number; end: number }[] = [];
  for (const c of candidates) {
    if (verifyBlankSpan(sentence, rubies, c.start, c.end)) {
      valid.push(c);
    }
  }
  if (valid.length === 0) return { start: -1, end: -1 };
  if (valid.length > 1) {
    console.warn(
      "[blankSpan] multiple blank spans match sequence; using first",
      { sentence: sentence.slice(0, 60), valid }
    );
  }
  return valid[0]!;
}

/**
 * 読みモード採点用の期待読み（接頭ひらがな + reading + okurigana）
 */
export function getExpectedReadingAnswer(question: Question): string {
  const { blank, sentence, type } = question;
  const ok = blank.okurigana ?? "";
  const needle = `${blank.kanji}${ok}`;
  if (type !== "reading" || !needle) {
    return `${blank.reading}${ok}`;
  }
  const span = resolveBlankSpan(question);
  if (span.start < 0) {
    return `${blank.reading}${ok}`;
  }
  const coreStart = span.end - needle.length;
  const prefix = sentence.slice(span.start, coreStart);
  return `${prefix}${blank.reading}${ok}`;
}
