/** Mulberry32 — deterministic PRNG from a 32-bit seed */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), a | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffleInPlace<T>(arr: T[], random: () => number = Math.random): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function shuffle<T>(arr: T[], random: () => number = Math.random): T[] {
  return shuffleInPlace([...arr], random);
}

export function shuffleWithSeed<T>(arr: T[], seed: number): T[] {
  const rnd = mulberry32(seed);
  return shuffleInPlace([...arr], rnd);
}
