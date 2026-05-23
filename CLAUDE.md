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
node index.js    # サーバー起動（http://localhost:3000）
```

## Architecture

### Stack
- **Frontend**: React 19, React Router DOM 7, Vite 8
- **Backend**: Express 5, mysql2 (Promise API)
- **DB**: MySQL（データベース名: `managemoney`、テーブル: `expenses`）
- **API通信**: フロントから `http://localhost:3000` へ直接fetch

### Routing（`front/src/const.js`）
ルート定数は `ROUTES` オブジェクトで一元管理。新しいページ追加時はここに追加し、`App.jsx` に `<Route>` を追加する。

| ルート | ページ | 概要 |
|--------|--------|------|
| `/` | Home | ナビゲーション |
| `/paid` | Paid | 支出登録 |
| `/paidhis` | PaidHis | 支出履歴 |
| `/loan` | Loan | ローン・サブスク登録 |
| `/goal` | Goal | 目標貯金登録 |

### Components（`front/src/components/`）
- `Button/Button.jsx` — `children` と `onClick` を受け取る汎用ボタン（CSS Modules使用）
- `inputform/input.jsx` — 金額入力フォーム（実装中）
- `selectjenre/selectjenre.jsx` — ジャンル選択（未実装）

### Backend API（`backend/index.js`）
現在実装済みのエンドポイント:
- `GET /api/paid` — `expenses` テーブルの全件取得

新しいエンドポイントは `backend/index.js` に追加する。DB接続は `mysql2/promise` のコネクションプールを使用。
