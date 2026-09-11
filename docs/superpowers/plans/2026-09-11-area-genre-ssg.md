# 「エリア × ジャンル」複合SEOページのSSG展開 実装計画

- 日付: 2026-09-11
- 設計書: `docs/superpowers/specs/2026-09-11-area-genre-ssg-design.md`
- 目的: 「新宿 焼肉 食べ放題」「横浜 寿司 食べ放題」などの複合クエリを獲得するため、ルート追加・コンポーネント拡張・メタ/構造化データ生成・SSGプリレンダを完全日英対応で実装する。

---

## タスク一覧

### Task 1: SEOメタ関数とデータ抽出 (TDD)
- **対象ファイル**: `src/seo/meta.ts`, `tests/seo-area-genre.test.ts`
- **作業内容**:
  - `tests/seo-area-genre.test.ts` を作成し、エリア×ジャンルのペア抽出、パス生成、タイトル/説明文生成（日英）、パンくずJSON-LD、サイトマップ追加を検証（RED）
  - `src/seo/meta.ts` に `listAreaGenres`, `areaGenrePath`, `areaGenrePageUrl`, `areaGenreTitle`, `areaGenreDescription`, `areaGenreTitleEn`, `areaGenreDescriptionEn`, `areaGenreJsonLd` を実装し、`sitemapEntries` に全ペアを追加（GREEN）
- **検証**: `npx vitest run tests/seo-area-genre.test.ts tests/seo.test.ts tests/seo-en.test.ts`
- **コミット**: `feat: エリア×ジャンルのSEOメタ生成関数とサイトマップ連携を追加`

### Task 2: ルーティングとUIコンポーネント拡張 (TDD)
- **対象ファイル**:
  - `src/routes.tsx`
  - `src/pages/AreaPage.tsx`
  - `src/i18n/ja.ts`, `src/i18n/en.ts`
  - `tests/area-genre-page.test.tsx`
- **作業内容**:
  - `tests/area-genre-page.test.tsx` を作成し、`/a/東京/新宿/焼肉` および英語 `/en/a/東京/新宿/焼肉` のレンダリング、店舗絞り込み、パンくず表示を検証（RED）
  - `src/routes.tsx` に `/a/:prefecture/:area/:genre` と `/en/a/:prefecture/:area/:genre` を追加
  - `src/pages/AreaPage.tsx` で `useParams` の `genre` を扱い、パンくずリスト（ホーム > エリア > エリア×ジャンル）、見出し、店舗絞り込みを実装（GREEN）
- **検証**: `npx vitest run tests/area-genre-page.test.tsx tests/area.test.tsx`
- **コミット**: `feat: AreaPageにジャンル指定とパンくずリスト対応を追加`

### Task 3: SSGプリレンダ拡張と全体検証
- **対象ファイル**:
  - `scripts/prerender.mjs`
  - `tests/prerender.test.tsx`
- **作業内容**:
  - `scripts/prerender.mjs` にエリア×ジャンル全ペアのHTML生成（日英）を追加
  - `npm test`（全テスト通過）
  - `npm run lint`（oxlint通過）
  - `npm run build`（ビルド通過）
  - `npm run build:ssg`（SSGプリレンダ生成正常）
- **検証**: 全チェック正常通過
- **コミット**: `feat: エリア×ジャンルページのSSGプリレンダ生成を実装`

### Task 4: PR作成と引き渡し
- **作業内容**:
  - 作業ブランチ `feature/m1-area-genre-ssg` から GitHub PR を作成
  - PR概要と検証結果を報告
