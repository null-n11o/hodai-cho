# 放題帖 hodai-cho

東京・神奈川の食べ放題条件帳。静的SPA（Vite + React + TS + Tailwind、DBなし）。

## 正本

実装の正本は `01_kcp-v2` 側。`docs/` は参照コピー（編集しない）。

- 設計: `docs/PLAN-20260906-300-hodai-cho-expansion.md`（正本: `01_kcp-v2/workspace/corporate-planning/plans/PLAN-20260906-300-hodai-cho-expansion.md`、status: approved）
- 実装計画: `docs/PLAN-20260906-301-hodai-cho-implementation-plan.md`（正本: `01_kcp-v2/workspace/corporate-planning/plans/PLAN-20260906-301-hodai-cho-implementation-plan.md`、status: approved）
- 要求経緯: `01_kcp-v2/workspace/corporate-planning/tickets/2026/T-20260906-300-hodai-cho-requirements.md`（done）

## Commands

- `npm run dev` - 開発サーバー起動
- `npm test` - Vitest 全テスト（`vitest run`）
- `npx vitest run tests/<name>` - 個別テスト
- `npm run lint` - oxlint
- `npm run build` - 型チェック＋本番ビルド
- `npm run build:ssg` - ビルド後に店別・エリア別HTML＋sitemap＋robotsを `dist/` へ生成（`SITE_URL` 環境変数で本番URL上書き可、既定は仮置きURL）

反復中は狭い検証（個別テスト）を使い、引き渡し前の広い変更では `npm test` と `npm run build` を通す。

## Architecture

- 同梱カタログ→Repository抽象→メモリ内即時フィルタ→3画面（探す `/` / 詳細 `/r/:id` / 保存 `/saved`＋エリア `/a/:pref/:area`）。
- 画面は `CatalogRepository` 抽象（`src/catalog/repository.ts`）にだけ依存する。将来API/CMSへ差し替えても画面は変更しない。
- お気に入りIDのみlocalStorage永続化（キー `hodai-cho`）。フィルタ条件は永続化しない。
- `src/seo/`（meta・prerender）と `scripts/prerender.mjs` はSSG基盤。`src/routes.tsx` がRoutes木、`src/main.tsx` は `BrowserRouter` を残す。

## Working rules

- PLAN-20260906-301 の Task 順で進める。Task 6 は追加店リスト確定待ちのため着手しない。
- TDD厳守（RED-GREEN-REFACTOR）。プレースホルダ・ダミー店禁止。各タスク完了ごとにコミットし、次のタスクへの進行確認を取る。
- **PLAN Global Constraints が最優先。** 日本語UI（英語はヒーローの TOKYO / KANAGAWA のみ）、ダーク固定（`ink #0e0d0c` / `ivory #ece7de` / `stone #9a9084` / `stonedim #6f675e` / `aka #c4543a`、ネオン・紫・金・絵文字・人物写真・外部口コミ星の表示禁止）、見出し Shippori Mincho・本文 IBM Plex Sans JP、動き150–400ms（`prefers-reduced-motion` で無効化）、タップ面44px以上・保存ボタンに `aria-label`＋`aria-pressed`・`lang="ja"`、料金は `¥`＋`toLocaleString('ja-JP')`、ページ全体の横スクロール禁止（横スクロールはチップ列のみ）・最大幅モバイルカラム（`max-w-lg`）中央寄せ、人手精査済み店のみ掲載＋共通免責フッター、予約リンクは外部素リンク（別タブ、アフィリエイト・在庫連動・決済・クーポンなし）、ジャンル写真は料理静物のみ。
- 未知ID・0件は落とさず専用表示＋探す導線にする。外部リンク失敗はブラウザに委譲する。
- デプロイ・公開URL確定・Search Console登録はCEO作業で実装外。秘密値はリポジトリに入れない。

## Skill routing

ユーザーの依頼に合うスキルがあるときは Skill ツール（または各ランタイムの相当手段）で呼び出す。迷ったら呼び出す。

- 実装計画の実行 -> `superpowers:subagent-driven-development`（サブエージェントが使える環境での既定）または `superpowers:executing-plans`（別セッションで実行する場合）。詳細は「Superpowers の使い方」参照。
- バグ・エラー調査 -> `investigate`
- 仕様・スコープの戦略判断 -> `plan-ceo-review`
- アーキテクチャ固定 -> `plan-eng-review`
- サイト動作のQA -> `qa` / `qa-only`
- 差分レビュー -> `review`
- 見た目の最終磨き -> `design-review`
- 出荷・PR -> `ship`
- 進捗保存・復帰 -> `context-save` / `context-restore`

### Taste系スキルの扱い（補助のみ）

`design-taste-frontend` / `minimalist-ui` / `redesign-existing-projects` は新規画面の補助参照に限定する。PLAN Global Constraints と競合したら PLAN が勝つ。taste既定のフォント差し替え・パレット変更・ライトテーマ化は、PLAN改訂＋CEO承認なしに行わない。

### Superpowers の使い方

- Claude Code: `superpowers` プラグインが全体に導入済み。`/superpowers-subagent-driven-development` のようにスラッシュ実行するか、Skill ツールで `superpowers:subagent-driven-development` を指定する。
- Codex / Cursor / opencode 等: プロジェクトローカルのスキルはないため、PLAN-20260906-301 の Task 記載（チェックボックス形式の Step、失敗テスト→最小実装→検証→コミット）をそのまま手順として実行する。サブエージェント機能がある環境では1タスク1サブエージェント＋タスクごとのレビュー（仕様準拠→品質）を再現する。
- 対応表: 同一セッションで逐次実行するなら `subagent-driven-development`、別セッションでチェックポイントを挟むなら `executing-plans`。どちらもテスト→実装→検証→コミットの順序は変えない。
