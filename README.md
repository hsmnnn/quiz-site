# Tech Quiz サイト

技術カンファレンスブース向け 4択クイズ Web アプリ。

## セットアップ手順

### 1. Supabase の設定

1. [Supabase](https://supabase.com) でプロジェクトを作成
2. SQL Editor で `supabase_setup.sql` を実行
3. Project Settings → API から URL と anon key を取得

### 2. 環境変数の設定

`.env.local.example` をコピーして `.env.local` を作成し、値を埋める：

```bash
cp .env.local.example .env.local
```

```.env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

# CSV出力の Basic 認証
CSV_EXPORT_USER=admin
CSV_EXPORT_PASSWORD=your_secure_password
```

### 3. 依存パッケージのインストール・起動

```bash
npm install
npm run dev
```

### 4. Vercel へのデプロイ

```bash
# Vercel CLI を使う場合
npx vercel --prod
```

Vercel の Environment Variables に上記 `.env.local` の値を設定すること。

---

## 画面構成

| パス | 説明 |
|---|---|
| `/` | トップ（スタート画面） |
| `/quiz` | クイズ（8問・4択） |
| `/result` | 結果表示・Supabase 保存 |
| `/api/save` | POST: 回答保存エンドポイント |
| `/api/export` | GET: CSV ダウンロード（Basic 認証） |

## クイズ問題の変更方法

`data/questions.ts` を編集するだけで差し替え可能。

```ts
export const questions = [
  {
    id: 1,
    question: "問題文",
    options: ["選択肢A", "選択肢B", "選択肢C", "選択肢D"],
    answer: 0, // 0-indexed で正解の選択肢番号
  },
  // ...
];
```

## CSV エクスポート

```
GET /api/export
Authorization: Basic <base64(user:password)>
```

ブラウザでアクセスすると Basic 認証ダイアログが表示され、認証後に CSV がダウンロードされる。
