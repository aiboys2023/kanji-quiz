import type { Question, Ruby } from "@/data/questions";

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
  if (type === "reading") {
    for (let i = 0; i < sentence.length; i++) {
      if (sentence.startsWith(blank.kanji, i)) {
        push(i, i + blank.kanji.length);
      }
    }
    for (let i = 0; i < sentence.length; i++) {
      if (sentence.startsWith(blank.reading, i)) {
        push(i, i + blank.reading.length);
      }
    }
  } else {
    for (let i = 0; i < sentence.length; i++) {
      if (sentence.startsWith(blank.reading, i)) {
        push(i, i + blank.reading.length);
      }
    }
    for (let i = 0; i < sentence.length; i++) {
      if (sentence.startsWith(blank.kanji, i)) {
        push(i, i + blank.kanji.length);
      }
    }
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
