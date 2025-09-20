# Contributing (Fork & PR)

外部コラボレーターは「フォーク → ブランチ → PR」の流れでご参加ください。

## 1) フォーク
- このリポジトリを自分のGitHubアカウントへ Fork します

## 2) ブランチ作成
```bash
# 例: 記事改善用ブランチ
git checkout -b feat/aio-2025-content-tune
```

- 変更対象の基点ブランチ: `chore/claude-collab-setup`（推奨）
  - vercel.json 等の設定が含まれています

## 3) ローカル開発
```bash
npm install
npm run dev
# http://localhost:8000/articles/aio-2025-guide.html
```

## 4) 変更内容
- 対象ファイル: `articles/aio-2025-guide.html`
- 編集内容: 文面推敲、目次整合、可読性微調整（CLAUDE_TASKS.md 参照）

## 5) プレビュー（任意）
- フォーク側で GitHub Pages を有効化すると、変更のプレビューURLを共有できます
  - Settings → Pages → Branch: `/<your-branch>` または `gh-pages`
  - 例: `https://<your-account>.github.io/<fork-repo>/articles/aio-2025-guide.html`

## 6) PR作成
- ベース: `martaro4227/sasurai-website` の `chore/claude-collab-setup`
- タイトル例: `feat(aio-2025): content polishing & toc fixes`
- PR本文: 自動テンプレに沿って記載し、フォーク側プレビューURL（任意）を追記してください

## 7) チェック
- 目次リンクの遷移確認
- モバイルでの可読性
- 共通ヘッダー/フッター/CTAを壊していないか

ありがとうございます！ 