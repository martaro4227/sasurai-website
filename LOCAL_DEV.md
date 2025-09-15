# ローカル開発環境セットアップガイド

## 🚀 開発サーバー起動

### 方法1: NPMスクリプト使用（推奨）
```bash
cd ~/Desktop/sasurai-website

# 依存関係インストール
npm install

# 開発サーバー起動（自動リロード付き）
npm run dev
# または
npm start
```

### 方法2: Python簡易サーバー
```bash
cd ~/Desktop/sasurai-website
python3 -m http.server 8000
```

### 方法3: Node.js直接実行
```bash
npx live-server --port=8000 --host=localhost --open=/
```

## 🛠️ 開発用コマンド

```bash
# 最新版同期
git pull origin main

# コード整形
npm run format

# 開発サーバー起動
npm run dev

# ファイル変更監視
npm run start
```

## 📁 プロジェクト構造

```
sasurai-website/
├── index.html              # メインWebサイト
├── package.json            # プロジェクト設定
├── vercel.json            # デプロイ設定
├── .gitignore             # Git無視ファイル
├── README.md              # プロジェクト説明
├── DEPLOYMENT.md          # デプロイ情報
├── LOCAL_DEV.md           # このファイル
└── .vercel/               # Vercel設定
    └── project.json
```

## 🌐 アクセス先

- **ローカル開発**: http://localhost:8000
- **GitHubリポジトリ**: https://github.com/martaro4227/sasurai-website

## 🔧 開発TIPs

1. **自動リロード**: ファイル保存時に自動でページ更新
2. **モバイル確認**: http://[your-ip]:8000 で他デバイスからアクセス
3. **Git管理**: 定期的に `git add . && git commit -m "message"` でバックアップ

## 📝 次の開発ステップ

1. ✅ ローカル環境セットアップ
2. 🎨 ビジュアル改善・アニメーション強化
3. 📱 モバイル最適化
4. 🤖 AI機能追加
5. ⚡ パフォーマンス最適化