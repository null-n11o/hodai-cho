# タベホー Tabeho

東京・神奈川の食べ放題条件帳。Vite + React + TypeScript + Tailwind の静的SPA、DBなし。

## 進め方（Astra / Codex）

- 依頼と関連コードを読み、必要な変更・検証・PR作成まで進める。承認済み範囲の作業はタスクごとの再確認で止めない。
- 小さな修正・文書整理・テスト整理は短い方針を伝えて直接実施する。仕様が曖昧、新機能、構造変更では先に設計を合意する。
- 設計は `docs/superpowers/specs/YYYY-MM-DD-<name>-design.md`、複数段階の実装計画は `docs/superpowers/plans/YYYY-MM-DD-<name>.md`。小さな変更に計画書を量産しない。KCP式PLANは使わない。
- スキルはユーザー指定または作業に必要なものだけ使う。全タスクでのスキル連鎖・レビュー周回・サブエージェント起動は必須にしない。並列委譲は独立した実装・調査・レビューに効果がある場合に限る。
- バグ修正・ロジック追加は再現／失敗テスト→実装→検証。文書・単純なCSS・テスト削除のために形式的なテストを追加しない。
- 作業ブランチで意味のある変更単位にコミットし、検証後にPRを作る。マージ・デプロイは明示依頼がある場合だけ。mainへのpushは自動デプロイを起動する。
- ユーザーの未コミット変更を上書きしない。秘密値はリポジトリに入れない。公開URL・DNS・Search Consoleの変更は別途依頼が必要。

## 必要な資料だけ読む

- 要件・設計の正本: `docs/superpowers/specs/2026-09-06-hodai-cho-design.md`。
- 対象機能の追加設計: `docs/superpowers/specs/` から探す。予約CTAは `2026-09-09-reservation-affiliate-design.md`、検索UIは `2026-09-08-search-redesign-design.md`。
- 既存計画は対象タスクの確認に使う。初期実装のTask 1〜8は完了済み。過去のTask順・待機状態を新しい依頼へ適用しない。
- `docs/PLAN-20260906-300-hodai-cho-expansion.md` と `docs/PLAN-20260906-301-hodai-cho-implementation-plan.md` は履歴資料。毎回の通読は不要。
- プロダクト要件は正本と承認済みの追加設計に従う。スキルの既定値で制約を上書きしない。

## コマンドと検証

- `npm run dev`: 開発サーバー。
- `npx vitest run tests/<name>`: 変更に関係する個別テスト。反復中はこれを使う。
- `npm test`: 全Vitestテスト。
- `npm run lint`: oxlint。
- `npm run build`: 型チェック＋本番ビルド。
- `npm run build:ssg`: ビルド＋日英の店・エリア・エリア×ジャンルHTML、sitemap、robots生成。`SITE_URL` でURLを指定できる。
- `npm run build:cloudflare`: SSGビルド＋配信成果物検証（デプロイはしない）。

引き渡し前は変更に応じて検証する。コード・テストの変更は `npm test`、`npm run lint`、`npm run build`。SSG・SEO・配信設定の変更は `npm run build:cloudflare` も実施する（通常buildの代わりでよい）。文書だけなら差分と参照先を確認する。成功済みのチェックを理由なく繰り返さない。

テストは検索・保存・日英対応・未知ID／0件・予約リンク・掲載データ・SSGなどの振る舞いと契約を守る。恒真テスト、実装の文字列をなぞるだけのテスト、同じ入力と結果の重複は増やさない。削除時は理由と残る検証をPRに記載する。CSSの余白・配色・レイアウトは必要な画面幅で実表示を確認する。

## コードの入口

- `src/catalog/`: 同梱カタログ、schema、`CatalogRepository` 抽象。画面からデータファイルを直接参照しない。
- `src/filters/filter.ts`: メモリ内の即時フィルタ・並び替え。
- `src/pages/` / `src/components/`: 探す、詳細、保存、情報提供、エリア・エリア×ジャンル。
- `src/routes.tsx`: 日英Routes木。`src/main.tsx` に `BrowserRouter` を残す。
- `src/favorites/storage.ts` / `src/i18n/`: お気に入りIDは `tabeho`、言語設定は `tabeho-lang` に永続化。フィルタ条件は永続化しない。SSRではlocalStorageがなくても落とさない。
- `src/seo/` / `scripts/prerender.mjs`: meta・プリレンダ・sitemap。Cloudflare Workers Static Assetsから `dist/` を配信する。

## 守るプロダクト制約

- 人手精査済みの実店舗のみ掲載。未精査・ダミー店禁止。在庫連動・決済・クーポンなし。
- UIは日英対応。既定は日本語、英語は `/en/` 以下、`hreflang` とパスに応じた文書の `lang` を設定。
- 「食卓の新聞」: page `#f3efe8` / surface `#fbfaf7` / text `#29231e` / muted `#756b61` / line `#d5cbbf` / accent `#c4543a`。ヘッダー・モバイルナビは shell `#171512`。
- Noto Sans JP。ネオン・紫・金・絵文字・人物写真・外部口コミ星は禁止。ジャンル画像は料理静物で、イメージ画像であることを表示する。
- モバイル1列、既存レスポンシブ幅を維持（正本はPC最大幅1024px）。全体の横スクロール禁止、横スクロールはチップ列のみ。デザイン変更は承認済み設計に従う。
- タップ面44px以上。保存ボタンは `aria-label`＋`aria-pressed`。動き150–400ms、`prefers-reduced-motion` で無効化。
- 料金は `¥`＋`toLocaleString('ja-JP')`。共通免責と日英のアフィリエイト広告表示を維持。
- 予約は `reservationAffiliateUrl` 優先、なければ `reservationUrl`。広告リンクは `rel="sponsored nofollow noreferrer"`、`officialUrl` は素リンク。
- 未知ID・0件は専用表示＋探す導線。外部リンクの失敗はブラウザに委譲する。
