import type { Question, Ruby } from "@/data/questions";

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
    if (okurigana) {
      // 送り仮名つき表層で位置を特定しつつ、blank範囲は漢字部分だけにする。
      addMatches(`${blank.kanji}${okurigana}`, blank.kanji.length);
    }
    addMatches(blank.kanji);
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
