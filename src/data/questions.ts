export interface Ruby {
  /** The kanji/text that gets ruby */
  text: string;
  /** The ruby reading above */
  ruby: string;
  /** Start index in the sentence */
  start: number;
  /** End index (exclusive) */
  end: number;
}

export interface QuestionBlank {
  /** The kanji text to be answered */
  kanji: string;
  /** Hiragana reading of the kanji */
  reading: string;
  /** Start index in the sentence */
  start: number;
  /** End index (exclusive) */
  end: number;
}

export interface Question {
  id: number;
  sentence: string;
  blank: QuestionBlank;
  rubies: Ruby[];
}

// 画像準拠の問題（10問）
export const questions: Question[] = [
  {
    id: 1,
    sentence: "海岸のペットボトルを拾う。",
    blank: { kanji: "拾", reading: "ひろ", start: 10, end: 11 },
    rubies: [
      { text: "海岸", ruby: "かいがん", start: 0, end: 2 },
    ],
  },
  {
    id: 2,
    sentence: "着られなくなった洋服を捨てる。",
    blank: { kanji: "捨", reading: "す", start: 12, end: 13 },
    rubies: [
      { text: "着", ruby: "き", start: 0, end: 1 },
      { text: "洋服", ruby: "ようふく", start: 8, end: 10 },
    ],
  },
  {
    id: 3,
    sentence: "火事でとなりのアパートが燃えた。",
    blank: { kanji: "燃", reading: "も", start: 13, end: 14 },
    rubies: [
      { text: "火事", ruby: "かじ", start: 0, end: 2 },
    ],
  },
  {
    id: 4,
    sentence: "可燃ゴミの日は火曜と木曜だ。",
    blank: { kanji: "可燃", reading: "かねん", start: 0, end: 2 },
    rubies: [
      { text: "日", ruby: "ひ", start: 5, end: 6 },
      { text: "火曜", ruby: "かよう", start: 7, end: 9 },
      { text: "木曜", ruby: "もくよう", start: 10, end: 12 },
    ],
  },
  {
    id: 5,
    sentence: "雨にぬれて紙袋がやぶれそうだ。",
    blank: { kanji: "紙袋", reading: "かみぶくろ", start: 5, end: 7 },
    rubies: [
      { text: "雨", ruby: "あめ", start: 0, end: 1 },
    ],
  },
  {
    id: 6,
    sentence: "校内の拾得物はスマホや定期が多い。",
    blank: { kanji: "拾得物", reading: "しゅうとくぶつ", start: 3, end: 6 },
    rubies: [
      { text: "校内", ruby: "こうない", start: 0, end: 2 },
      { text: "定期", ruby: "ていき", start: 12, end: 14 },
      { text: "多", ruby: "おお", start: 15, end: 16 },
    ],
  },
  {
    id: 7,
    sentence: "小数点第一位を四捨五入する。",
    blank: { kanji: "四捨五入", reading: "ししゃごにゅう", start: 6, end: 10 },
    rubies: [
      { text: "小数点", ruby: "しょうすうてん", start: 0, end: 3 },
      { text: "第一位", ruby: "だいいちい", start: 3, end: 6 },
    ],
  },
  {
    id: 8,
    sentence: "落ち葉を集めて燃やす。",
    blank: { kanji: "燃", reading: "も", start: 7, end: 8 },
    rubies: [
      { text: "落", ruby: "お", start: 0, end: 1 },
      { text: "葉", ruby: "ば", start: 2, end: 3 },
      { text: "集", ruby: "あつ", start: 4, end: 5 },
    ],
  },
  {
    id: 9,
    sentence: "買った食料品を袋に入れる。",
    blank: { kanji: "袋", reading: "ふくろ", start: 7, end: 8 },
    rubies: [
      { text: "買", ruby: "か", start: 0, end: 1 },
      { text: "食料品", ruby: "しょくりょうひん", start: 3, end: 6 },
      { text: "入", ruby: "い", start: 9, end: 10 },
    ],
  },
  {
    id: 10,
    sentence: "寒い日は手袋をはめて出かける。",
    blank: { kanji: "手袋", reading: "てぶくろ", start: 4, end: 6 },
    rubies: [
      { text: "寒", ruby: "さむ", start: 0, end: 1 },
      { text: "日", ruby: "ひ", start: 2, end: 3 },
      { text: "出", ruby: "で", start: 11, end: 12 },
    ],
  },
];
