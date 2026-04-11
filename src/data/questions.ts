export interface QuestionBlank {
  /** The kanji text to be filled in or read */
  kanji: string;
  /** Hiragana reading of the kanji */
  reading: string;
  /** Start index in the sentence */
  start: number;
  /** End index (exclusive) in the sentence */
  end: number;
}

export interface Question {
  id: number;
  sentence: string;
  blanks: QuestionBlank[];
}

// N3レベルの漢字問題（30問）
export const questions: Question[] = [
  {
    id: 1,
    sentence: "彼は会議に出席するために早く起きた。",
    blanks: [
      { kanji: "会議", reading: "かいぎ", start: 2, end: 4 },
      { kanji: "出席", reading: "しゅっせき", start: 5, end: 7 },
    ],
  },
  {
    id: 2,
    sentence: "この商品は品質がとても良い。",
    blanks: [
      { kanji: "商品", reading: "しょうひん", start: 2, end: 4 },
      { kanji: "品質", reading: "ひんしつ", start: 5, end: 7 },
    ],
  },
  {
    id: 3,
    sentence: "交通事故を防ぐために安全運転を心がけよう。",
    blanks: [
      { kanji: "交通", reading: "こうつう", start: 0, end: 2 },
      { kanji: "事故", reading: "じこ", start: 2, end: 4 },
      { kanji: "安全", reading: "あんぜん", start: 9, end: 11 },
      { kanji: "運転", reading: "うんてん", start: 11, end: 13 },
    ],
  },
  {
    id: 4,
    sentence: "彼女は将来、医者になりたいと言っている。",
    blanks: [
      { kanji: "将来", reading: "しょうらい", start: 3, end: 5 },
      { kanji: "医者", reading: "いしゃ", start: 6, end: 8 },
    ],
  },
  {
    id: 5,
    sentence: "この地域では農業が盛んだ。",
    blanks: [
      { kanji: "地域", reading: "ちいき", start: 2, end: 4 },
      { kanji: "農業", reading: "のうぎょう", start: 6, end: 8 },
      { kanji: "盛ん", reading: "さかん", start: 9, end: 11 },
    ],
  },
  {
    id: 6,
    sentence: "政府は新しい政策を発表した。",
    blanks: [
      { kanji: "政府", reading: "せいふ", start: 0, end: 2 },
      { kanji: "政策", reading: "せいさく", start: 6, end: 8 },
      { kanji: "発表", reading: "はっぴょう", start: 9, end: 11 },
    ],
  },
  {
    id: 7,
    sentence: "祖父は毎朝、散歩をするのが習慣だ。",
    blanks: [
      { kanji: "祖父", reading: "そふ", start: 0, end: 2 },
      { kanji: "散歩", reading: "さんぽ", start: 6, end: 8 },
      { kanji: "習慣", reading: "しゅうかん", start: 13, end: 15 },
    ],
  },
  {
    id: 8,
    sentence: "環境問題について研究している。",
    blanks: [
      { kanji: "環境", reading: "かんきょう", start: 0, end: 2 },
      { kanji: "問題", reading: "もんだい", start: 2, end: 4 },
      { kanji: "研究", reading: "けんきゅう", start: 8, end: 10 },
    ],
  },
  {
    id: 9,
    sentence: "最近、物価が上昇している。",
    blanks: [
      { kanji: "最近", reading: "さいきん", start: 0, end: 2 },
      { kanji: "物価", reading: "ぶっか", start: 3, end: 5 },
      { kanji: "上昇", reading: "じょうしょう", start: 6, end: 8 },
    ],
  },
  {
    id: 10,
    sentence: "彼は経験が豊富な技術者だ。",
    blanks: [
      { kanji: "経験", reading: "けいけん", start: 2, end: 4 },
      { kanji: "豊富", reading: "ほうふ", start: 5, end: 7 },
      { kanji: "技術", reading: "ぎじゅつ", start: 8, end: 10 },
    ],
  },
  {
    id: 11,
    sentence: "申込書に必要な情報を記入してください。",
    blanks: [
      { kanji: "申込書", reading: "もうしこみしょ", start: 0, end: 3 },
      { kanji: "必要", reading: "ひつよう", start: 4, end: 6 },
      { kanji: "情報", reading: "じょうほう", start: 7, end: 9 },
      { kanji: "記入", reading: "きにゅう", start: 10, end: 12 },
    ],
  },
  {
    id: 12,
    sentence: "彼女は優秀な成績で卒業した。",
    blanks: [
      { kanji: "優秀", reading: "ゆうしゅう", start: 3, end: 5 },
      { kanji: "成績", reading: "せいせき", start: 6, end: 8 },
      { kanji: "卒業", reading: "そつぎょう", start: 9, end: 11 },
    ],
  },
  {
    id: 13,
    sentence: "この製品の製造過程を説明します。",
    blanks: [
      { kanji: "製品", reading: "せいひん", start: 2, end: 4 },
      { kanji: "製造", reading: "せいぞう", start: 5, end: 7 },
      { kanji: "過程", reading: "かてい", start: 7, end: 9 },
      { kanji: "説明", reading: "せつめい", start: 10, end: 12 },
    ],
  },
  {
    id: 14,
    sentence: "選挙の結果が発表された。",
    blanks: [
      { kanji: "選挙", reading: "せんきょ", start: 0, end: 2 },
      { kanji: "結果", reading: "けっか", start: 3, end: 5 },
      { kanji: "発表", reading: "はっぴょう", start: 6, end: 8 },
    ],
  },
  {
    id: 15,
    sentence: "適切な判断をするには経験が必要だ。",
    blanks: [
      { kanji: "適切", reading: "てきせつ", start: 0, end: 2 },
      { kanji: "判断", reading: "はんだん", start: 3, end: 5 },
      { kanji: "経験", reading: "けいけん", start: 10, end: 12 },
      { kanji: "必要", reading: "ひつよう", start: 13, end: 15 },
    ],
  },
  {
    id: 16,
    sentence: "新しい規則に従って行動してください。",
    blanks: [
      { kanji: "規則", reading: "きそく", start: 3, end: 5 },
      { kanji: "従って", reading: "したがって", start: 6, end: 9 },
      { kanji: "行動", reading: "こうどう", start: 9, end: 11 },
    ],
  },
  {
    id: 17,
    sentence: "彼は責任感が強くて信頼できる。",
    blanks: [
      { kanji: "責任", reading: "せきにん", start: 2, end: 4 },
      { kanji: "信頼", reading: "しんらい", start: 9, end: 11 },
    ],
  },
  {
    id: 18,
    sentence: "地震の被害は予想以上だった。",
    blanks: [
      { kanji: "地震", reading: "じしん", start: 0, end: 2 },
      { kanji: "被害", reading: "ひがい", start: 3, end: 5 },
      { kanji: "予想", reading: "よそう", start: 6, end: 8 },
      { kanji: "以上", reading: "いじょう", start: 8, end: 10 },
    ],
  },
  {
    id: 19,
    sentence: "彼女は留学の経験を生かして通訳になった。",
    blanks: [
      { kanji: "留学", reading: "りゅうがく", start: 3, end: 5 },
      { kanji: "経験", reading: "けいけん", start: 6, end: 8 },
      { kanji: "通訳", reading: "つうやく", start: 13, end: 15 },
    ],
  },
  {
    id: 20,
    sentence: "この薬は副作用があるので注意が必要です。",
    blanks: [
      { kanji: "薬", reading: "くすり", start: 2, end: 3 },
      { kanji: "副作用", reading: "ふくさよう", start: 4, end: 7 },
      { kanji: "注意", reading: "ちゅうい", start: 12, end: 14 },
      { kanji: "必要", reading: "ひつよう", start: 15, end: 17 },
    ],
  },
  {
    id: 21,
    sentence: "彼の態度は非常に礼儀正しい。",
    blanks: [
      { kanji: "態度", reading: "たいど", start: 2, end: 4 },
      { kanji: "非常", reading: "ひじょう", start: 5, end: 7 },
      { kanji: "礼儀", reading: "れいぎ", start: 8, end: 10 },
    ],
  },
  {
    id: 22,
    sentence: "国際会議に参加するため出張した。",
    blanks: [
      { kanji: "国際", reading: "こくさい", start: 0, end: 2 },
      { kanji: "会議", reading: "かいぎ", start: 2, end: 4 },
      { kanji: "参加", reading: "さんか", start: 5, end: 7 },
      { kanji: "出張", reading: "しゅっちょう", start: 11, end: 13 },
    ],
  },
  {
    id: 23,
    sentence: "景気が回復して失業率が下がった。",
    blanks: [
      { kanji: "景気", reading: "けいき", start: 0, end: 2 },
      { kanji: "回復", reading: "かいふく", start: 3, end: 5 },
      { kanji: "失業", reading: "しつぎょう", start: 7, end: 9 },
    ],
  },
  {
    id: 24,
    sentence: "複雑な手続きを簡単にする方法を考えた。",
    blanks: [
      { kanji: "複雑", reading: "ふくざつ", start: 0, end: 2 },
      { kanji: "手続き", reading: "てつづき", start: 3, end: 6 },
      { kanji: "簡単", reading: "かんたん", start: 7, end: 9 },
      { kanji: "方法", reading: "ほうほう", start: 12, end: 14 },
    ],
  },
  {
    id: 25,
    sentence: "彼は努力して資格を取得した。",
    blanks: [
      { kanji: "努力", reading: "どりょく", start: 2, end: 4 },
      { kanji: "資格", reading: "しかく", start: 6, end: 8 },
      { kanji: "取得", reading: "しゅとく", start: 9, end: 11 },
    ],
  },
  {
    id: 26,
    sentence: "観光客が増加して経済が活性化した。",
    blanks: [
      { kanji: "観光", reading: "かんこう", start: 0, end: 2 },
      { kanji: "増加", reading: "ぞうか", start: 4, end: 6 },
      { kanji: "経済", reading: "けいざい", start: 8, end: 10 },
      { kanji: "活性化", reading: "かっせいか", start: 11, end: 14 },
    ],
  },
  {
    id: 27,
    sentence: "先生の指導のおかげで成長できた。",
    blanks: [
      { kanji: "指導", reading: "しどう", start: 3, end: 5 },
      { kanji: "成長", reading: "せいちょう", start: 11, end: 13 },
    ],
  },
  {
    id: 28,
    sentence: "契約の内容を確認してから署名した。",
    blanks: [
      { kanji: "契約", reading: "けいやく", start: 0, end: 2 },
      { kanji: "内容", reading: "ないよう", start: 3, end: 5 },
      { kanji: "確認", reading: "かくにん", start: 6, end: 8 },
      { kanji: "署名", reading: "しょめい", start: 12, end: 14 },
    ],
  },
  {
    id: 29,
    sentence: "この実験の目的は新しい材料を開発することだ。",
    blanks: [
      { kanji: "実験", reading: "じっけん", start: 2, end: 4 },
      { kanji: "目的", reading: "もくてき", start: 5, end: 7 },
      { kanji: "材料", reading: "ざいりょう", start: 11, end: 13 },
      { kanji: "開発", reading: "かいはつ", start: 14, end: 16 },
    ],
  },
  {
    id: 30,
    sentence: "健康を維持するために適度な運動が大切だ。",
    blanks: [
      { kanji: "健康", reading: "けんこう", start: 0, end: 2 },
      { kanji: "維持", reading: "いじ", start: 3, end: 5 },
      { kanji: "適度", reading: "てきど", start: 11, end: 13 },
      { kanji: "運動", reading: "うんどう", start: 14, end: 16 },
      { kanji: "大切", reading: "たいせつ", start: 17, end: 19 },
    ],
  },
];
