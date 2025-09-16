# 目的
- このPRは `articles/aio-2025-guide.html` のコンテンツ／レイアウト改善を外部コラボレーター（Claude）に依頼するためのものです。

## 対象ファイル
- `articles/aio-2025-guide.html`

## 背景・現状
- 参考構造: `articles/ai-website-optimization-2024.html`（同一構造）
- サイト共通: ヘッダー／フッター／プレフッターCTAは統一済み
- ローカル確認: `npm install && npm run dev` で http://localhost:8000
- 該当ページURL: http://localhost:8000/articles/aio-2025-guide.html

## やってほしいこと（タスク）
- 文章の推敲・校正（用語統一、冗長表現の簡潔化、見出しの情報設計）
- 目次の見出しレベルとリンク整合性のチェックと修正
- 図版（ダミーOK）差し込み位置の提案（必要なら `<figure>` で追加）
- E-E-A-T 強化観点での微修正（出典リンク、著者情報の明確化など）
- 関連記事カードのタイトル・メタの可読性微調整（CSS範囲内）
- スマホ時の可読性（余白、行間、フォントサイズ）微調整

## 受け入れ条件（Definition of Done）
- すべての内部リンク（目次含む）が正しくスクロール遷移
- Lighthouse で可読性/アクセシビリティが低下していない（±同等以上）
- PC/スマホ幅でレイアウト崩れがない
- 既存の共通ヘッダー/フッター/CTA スタイルを壊していない
- `npm run dev` 起動後に http://localhost:8000/articles/aio-2025-guide.html が問題なく表示

## 確認方法（ローカル）
```bash
# 依存関係
npm install

# 起動
npm run dev
# ブラウザ
open http://localhost:8000/articles/aio-2025-guide.html
```

## 備考
- 静的サイトのためビルド工程はありません
- デザインは `ai-website-optimization-2024.html` と同一の原則に準拠してください
- 必要に応じて `LOCAL_DEV.md` も参照ください 