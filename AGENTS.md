# 放題帖 hodai-cho

東京・神奈川の食べ放題条件帳。静的SPA（Vite + React + TS + Tailwind、DBなし）。

## 設計書（読む順）

1. `docs/superpowers/specs/2026-09-06-hodai-cho-design.md`（要件・設計の正本。自己完結）
2. `docs/superpowers/plans/2026-09-06-hodai-cho-implementation.md`（実装計画。Task 1〜8実施済み）
3. `docs/PLAN-20260906-300-hodai-cho-expansion.md`、`docs/PLAN-20260906-301-hodai-cho-implementation-plan.md`（原本コピー。履歴参照用）
4. 新規開発の要件・計画は `docs/superpowers/specs/` と `docs/superpowers/plans/` に置く。作り方は「開発フロー」参照。

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
- **PLAN Global Constraints が最優先。** UIは日英対応（既定は日本語、`/en/` 以下に英語、`hreflang` 付き）、コンテンツ面はライトベースの「食卓の新聞」（`page #f3efe8` / `surface #fbfaf7` / `text #29231e` / `muted #756b61` / `line #d5cbbf` / `accent #c4543a`）、ヘッダーとモバイルナビはダークなブランドシェル（`shell #171512`）、ネオン・紫・金・絵文字・人物写真・外部口コミ星の表示禁止、見出しと本文は Noto Sans JP、動き150–400ms（`prefers-reduced-motion` で無効化）、タップ面44px以上・保存ボタンに `aria-label`＋`aria-pressed`・文書言語はパスに合わせる（既定 `lang="ja"`、`/en/` は `lang="en"`）、料金は `¥`＋`toLocaleString('ja-JP')`、ページ全体の横スクロール禁止（横スクロールはチップ列のみ）・最大幅モバイルカラム（`max-w-lg`）中央寄せ、人手精査済み店のみ掲載＋共通免責フッター、予約リンクは外部素リンク（別タブ、アフィリエイト・在庫連動・決済・クーポンなし）、ジャンル画像は料理静物のみ。
- 未知ID・0件は落とさず専用表示＋探す導線にする。外部リンク失敗はブラウザに委譲する。
- デプロイ・公開URL確定・Search Console登録はCEO作業で実装外。秘密値はリポジトリに入れない。

## 開発フロー（superpowers）

このリポジトリだけで完結する。新規開発は次の3段階で回す。KCP式のPLAN書式は使わない。

1. 入力: 軽い要求定義を受け取る。アイデアメモ程度でよい（チャット貼り付け・ファイルどちらでも）。要求が荒いままなら `superpowers:brainstorming` で掘り下げ、合意した設計を `docs/superpowers/specs/YYYY-MM-DD-<name>-design.md` に保存する。
2. 計画: `superpowers:writing-plans` で実装計画を作り、`docs/superpowers/plans/YYYY-MM-DD-<name>.md` に保存する。タスクは短時間で終わる粒度に割り、対象ファイル・検証手順・コミット単位まで書く。
3. 実装: `superpowers:subagent-driven-development`（サブエージェントが使える環境での既定）または `superpowers:executing-plans`（別セッション・チェックポイント型）で計画を実行する。TDD厳守、タスクごとにコミット。設計書の制約（後述の Global Constraints 相当）は計画に引き継ぐ。

## Skill routing

ユーザーの依頼に合うスキルがあるときは、Skill ツール（または各ランタイムの相当手段）で、ファイル確認や質問より先に呼び出す。迷ったら呼び出す。スキルを使うターンは、冒頭で `Using <skill> to <purpose>` と明示する。

- 新規アイデアの掘り下げ -> `superpowers:brainstorming`
- 実装計画の作成 -> `superpowers:writing-plans`
- 実装計画の実行 -> `superpowers:subagent-driven-development`（サブエージェントが使える環境での既定）または `superpowers:executing-plans`（別セッションで実行する場合）。詳細は「Superpowers の使い方」参照。
- UI/UXの探索・再設計・フロー監査 -> Product Designプラグイン（`product-design:index`。再設計は `product-design:get-context` → `product-design:ideate`、既存画面の監査は `product-design:audit`）
- バグ・エラー調査 -> `investigate`
- 仕様・スコープの戦略判断 -> `plan-ceo-review`
- アーキテクチャ固定 -> `plan-eng-review`
- サイト動作のQA -> `qa` / `qa-only`
- 差分レビュー -> `review`
- 見た目の最終磨き -> `design-review`
- 出荷・PR -> `ship`
- 進捗保存・復帰 -> `context-save` / `context-restore`

### Taste系スキルの扱い（補助のみ）

`design-taste-frontend` / `minimalist-ui` / `redesign-existing-projects` は新規画面の補助参照に限定する。PLAN Global Constraints と競合したら Constraints が勝つ。taste既定のフォント差し替え・パレット変更・ライトテーマ化は、設計書の改訂＋CEO承認なしに行わない。

### Product Design の使い方

- Product Designプラグインは、放題帖のUI/UX探索・再設計・画面監査・プロトタイプ検討の第一候補とする。通常の実装や単純なCSS修正だけでは使わず、主目的がデザインの探索・評価・改善である場合に使う。
- 新しいUI方向や再設計では、まず `product-design:get-context` で対象とユーザー成果を確認し、次に `product-design:ideate` で視覚案を作る。視覚ターゲットがない場合は、3案を比較してユーザーが選ぶまで、ファイル編集・サーバー起動・実装に進まない。
- 既存画面・既存フローのレビューや改善では、まず `product-design:audit` でスクリーンショットに基づくUX・デザイン・アクセシビリティの指摘を出す。監査と実装を同じ依頼で行う場合も、監査を先に完了する。
- Product Designの提案・プロトタイプは、PLAN Global Constraints、既存設計書、実データのみ・日英対応・アクセシビリティ・横スクロール禁止などのリポジトリ制約を上書きしない。

### Superpowers の使い方

- Claude Code: `superpowers` プラグインが全体に導入済み。`/superpowers-subagent-driven-development` のようにスラッシュ実行するか、Skill ツールで `superpowers:subagent-driven-development` を指定する。
- Codex: グローバルの `superpowers@claude-plugins-official` プラグインを正規のスキル供給元として扱う。ランタイムにSkill呼び出し機能が公開されている場合は、該当するスキル名（例: `superpowers:brainstorming`）を直接呼び出す。呼び出し機能が公開されていない場合は、インストール済みプラグインの同名 `SKILL.md` を全文読んで、その手順をフォールバックとして厳密に実行する。このフォールバックを「直接発動済み」と表現しない。
- Codexでは、毎回「適用スキルの選定→開始宣言→スキルの手順→検証」の順序を守る。`superpowers:brainstorming` は新規アイデア・機能・UI変更の前に、`superpowers:writing-plans` は承認済み設計の後に、`superpowers:subagent-driven-development` または `superpowers:executing-plans` は承認済み計画の実装時に使う。ブレインストーミングの設計承認前に実装へ進まない。
- Codexでプラグインをインストール・更新・有効化した直後は、現在のセッションに反映されないことがあるため、新規セッションまたはアプリの再読み込み後に運用する。状態確認が必要な場合は `codex plugin list --json` で対象プラグインの `installed` と `enabled` を確認する。
- Cursor / opencode 等: 各ランタイムのネイティブなスキル呼び出しを優先する。直接呼び出し機能がない場合は、該当する `SKILL.md` と `docs/superpowers/plans/` の計画書の手順（チェックボックス形式の Step、失敗テスト→最小実装→検証→コミット）をそのまま実行する。サブエージェント機能がある環境では1タスク1サブエージェント＋タスクごとのレビュー（仕様準拠→品質）を再現する。
- 対応表: 同一セッションで逐次実行するなら `subagent-driven-development`、別セッションでチェックポイントを挟むなら `executing-plans`。どちらもテスト→実装→検証→コミットの順序は変えない。
