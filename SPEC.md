# 漢字クイズ N3 — リニューアル設計仕様書

## 概要
JLPT N3レベルの漢字クイズWebアプリ。全18章・1,514問。
台湾人の日本語学習者向け。スマホ（iPhone/iPad/Android）メイン。

## デザインコンセプト
- **韓国デザイン風ポップUI**: ビビッドカラー（ピンク・黄色・緑・青）、ステッカー風カード（太い黒ボーダー + ドロップシャドウ）
- **猫マスコットキャラ（SVG）**: 場面ごとに表情変化
  - トップ画面: 手を振る笑顔
  - 問題中: 考え中（目が回る）
  - 正解時: 喜ぶ + 紙吹雪エフェクト
  - 不正解時: 励ます（がんばれポーズ）
  - 結果画面: スコアに応じて表情変化（80%↑=最高、60%↑=いい感じ、↓=頑張ろう）
- **ステッカー/イラスト装飾**: 星、ハート、スマイリーなどのSVGステッカーをランダム配置
- **レトロ風ボタン**: 太い黒ボーダー + シャドウ、押すとシャドウが消える
- **背景**: クリーム色ベース + ドット/グリッドパターン薄く

## 問題データ
- ファイル: `src/data/all_questions.json`（1,514問）
- 構造:
```ts
interface Question {
  chapter: number;      // 1-18
  topic: string;        // "生活1", "ゴミ" etc
  type: "reading" | "writing";
  sentence: string;     // 文章
  blank: { kanji: string; reading: string }; // 出題対象
  rubies: { text: string; ruby: string }[];  // ふりがな付き漢字
}
```
- インデックス(start/end)は使わない。代わりにsentence内のblank.kanjiを検索して位置を特定する

## 2つのモード

### 読み方モード（Reading Mode）
- 文章を表示。出題漢字はオレンジ色ハイライト
- その他の漢字にはルビ（ふりがな）表示
- ユーザーがひらがなで読みを入力
- **IME対応必須**: `compositionstart`/`compositionend`でIME変換中はEnterを無視
- 「チェック」ボタンまたはEnterで判定
- 正解→⭕ + 猫喜ぶ / 不正解→正解表示 + 猫励ます

### 漢字モード（Kanji Mode）= 4択選択式
- 文章を表示。出題箇所はひらがな（青色ハイライト）
- その他の漢字にはルビ表示
- **4つの選択肢**をボタンで表示（正解1 + 同じ章の他の漢字からランダム3つ）
- タップで即判定（入力不要 → スマホに最適）
- 正解→緑に光る + 猫喜ぶ / 不正解→正解が光る + 猫励ます

## 出題設定画面（モード選択後に表示）

### 章の選択
- 全18章のリスト表示。複数選択可
- 「全章」ボタンで一括選択/解除
- 各章の横に問題数を表示

### 問題数の選択
- 10問 / 20問 / 50問 / 全問 からラジオボタン選択
- 選択した章の問題数より多い場合は自動で全問に

## ゲーム機能

### 1. 連続正解ストリーク
- 連続正解数を画面上部に表示
- 3連続 → 🔥 炎アイコン表示
- 5連続 → 🔥🔥 + 画面にパーティクルエフェクト
- 10連続 → 🔥🔥🔥 + 猫がスーパーモード（サングラス）

### 2. 制限時間モード（オプション）
- 設定画面でON/OFF切り替え
- ON: 1問あたり15秒のカウントダウンタイマー
- 時間切れ → 不正解扱い

### 3. 間違えた問題の復習
- 全問回答後、不正解の問題がある場合
- 「間違えた問題をもう一度」ボタン表示
- 復習モードでは不正解問題のみ再出題

### 4. デイリーチャレンジ
- トップ画面に「今日のチャレンジ」ボタン
- 日付ベースのシード値でランダム10問を固定選出
- スコアをlocalStorageに記録
- カレンダー形式で過去のスコア表示（色分け）

## 結果画面
- 猫マスコット（スコアに応じた表情）
- パーセンテージ大表示
- 正解数 / 総問題数
- 章ごとの正答率（棒グラフ風）
- 「もう一回」「間違えた問題を復習」「ホームに戻る」ボタン

## レスポンシブ対応
- **モバイルファースト**: iPhone SE (375px) 〜 iPad Pro (1024px)
- 4択ボタン: モバイルでは2x2グリッド、タブレットでは1x4横並び
- 文章表示: font-size 1.2rem以上（タッチしやすく）
- ボタン: min-height 48px（タッチターゲット）
- Safe area対応（ノッチ/ホームバー）

## 技術スタック
- Next.js (App Router) + TypeScript + Tailwind CSS
- データ: 静的JSON（DBなし）
- 状態管理: React useState/useReducer
- 永続化: localStorage（デイリーチャレンジスコア）
- アニメーション: CSS + Tailwind animate
- ホスティング: Vercel

## ファイル構成（推奨）
```
src/
  app/
    page.tsx           # トップ画面
    quiz/page.tsx      # クイズ画面（モード共通）
    result/page.tsx    # 結果画面
    daily/page.tsx     # デイリーチャレンジ
    globals.css
    layout.tsx
  components/
    CatMascot.tsx      # 猫マスコットSVG（表情prop）
    SentenceDisplay.tsx # 文章表示（ルビ+ハイライト）
    ReadingInput.tsx   # 読み方入力
    KanjiChoices.tsx   # 4択選択
    StreakCounter.tsx   # 連続正解表示
    Timer.tsx          # タイマー
    ChapterSelect.tsx  # 章選択
    QuizSettings.tsx   # 出題設定
    ResultChart.tsx    # 結果チャート
    Confetti.tsx       # 紙吹雪エフェクト
    StickerDeco.tsx    # ステッカー装飾
  data/
    all_questions.json # 1,514問
    questions.ts       # 型定義 + ユーティリティ
  hooks/
    useQuiz.ts         # クイズロジック
    useStreak.ts       # ストリーク管理
    useTimer.ts        # タイマー
    useDaily.ts        # デイリーチャレンジ
  lib/
    shuffle.ts         # シャッフル + シード付きランダム
```

## 実装上の注意
1. **IME対応**: onKeyDownでisComposingをチェック。compositionstart/endイベントも使う
2. **インデックス不使用**: sentence.indexOf(blank.kanji)で動的に位置特定。送り仮名含む場合も考慮
3. **4択生成**: 正解と同じchapterの他の問題からランダム3つ選出。重複排除
4. **ルビ表示**: <ruby>タグ + <rt>タグで表示
5. **パフォーマンス**: 1,514問のJSONは静的インポート。ページ遷移はApp Router
6. **アクセシビリティ**: aria-label、focus管理、キーボード操作対応
