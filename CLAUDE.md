# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

家計管理アプリ。フロントエンド（React + Vite）とバックエンド（Express + MySQL）の2つのサーバーを別々に起動する構成。

## Commands

### Frontend (`front/`)
```bash
npm run dev      # 開発サーバー起動（http://localhost:5173）
npm run build    # プロダクションビルド
npm run lint     # ESLint実行
npm run preview  # ビルド後プレビュー
```

### Backend (`backend/`)
```bash
DATABASE_PASS=<password> node index.js   # サーバー起動（http://localhost:3000）
```

DB接続パスワードは環境変数 `DATABASE_PASS` で渡す。

## Architecture

### Stack
- **Frontend**: React 19, React Router DOM 7, Vite
- **Backend**: Express 5, mysql2 (Promise API), multer（画像アップロード）
- **DB**: MySQL（データベース名: `managemoney`）
- **API通信**: フロントから `http://localhost:3000` へ直接 fetch（ハードコード）

### DBテーブル
| テーブル | 用途 |
|---------|------|
| `expenses` | 支出記録（amount, junre, image_path, created_at） |
| `loans` | ローン・サブスク（type, name, amount, remain_year, remain_month） |
| `savings` | 貯金目標・現在貯金・収入（type, amount, goal_year, goal_month） |

### 定数（`front/src/const.js`）
ルート、ジャンル選択肢、goalTypeMap など全定数を一元管理。新しいページ追加時は `ROUTES` にエントリを追加し、`App.jsx` に `<Route>` を追加する。`goalTypeMap` は日本語→DBの `type` 文字列のマッピング。

### Backend API（`backend/index.js`）
| メソッド | エンドポイント | 説明 |
|---------|--------------|------|
| GET | `/api/paid` | expenses 全件取得 |
| POST | `/api/paid` | 支出登録（multipart/form-data、画像は `uploads/` に保存） |
| GET | `/api/paidhis` | 年月・ジャンルで絞り込んだ expenses + その月以前の loans を返す |
| POST | `/api/loan` | ローン・サブスク登録 |
| GET | `/api/goal` | savings 全件取得 |
| POST | `/api/goal` | 目標貯金・現在の貯金・収入の登録 |
| POST | `/api/savings` | 現在の貯金を amount だけ減算（支出登録時に自動呼び出し） |

画像ファイルは `backend/uploads/` に保存され、`/uploads/<filename>` で静的配信される。

### 共通コンポーネント（`front/src/components/`）
- `Button/Button.jsx` — `children` と `onClick` を受け取る汎用ボタン（CSS Modules）
- `Select/Select.jsx` — `option`（配列）、`value`、`onChange`、`placeholder` を受け取る汎用セレクト
- `inputform/input.jsx` — 金額・テキスト入力フォーム
- `addpiture/addpicture.jsx` — 画像アップロード用（`file` と `onChange` を受け取る）

`selectjenre/` と `inputform/input *.jsx`（3〜9）は旧バージョンの残骸。現在は使用していない。

### PaidHis のカスタムフック
`usePaidSummary(year, month, junre)` が `PaidHis.jsx` に定義されており、年月ジャンルを受け取って expenses・loans・各合計を返す。他ページで支出集計が必要になった場合はここを再利用する。
