# 「エリア × ジャンル」複合SEOページのSSG展開

- 日付: 2026-09-11
- 状態: 設計完了・実装計画へ
- 正本: `docs/superpowers/specs/2026-09-06-hodai-cho-design.md` の要件・UI・カタログ制約を継承する

## 目的

「新宿 焼肉 食べ放題」「横浜 寿司 食べ放題」など、検索ボリュームの最も大きい複合クエリに対応する静的HTMLページ（日英）をSSG生成し、オーガニック検索流入を最大化する。

## 要件定義

### 1. ルーティング

`src/routes.tsx` に以下のルートを追加する：

- 日本語: `/a/:prefecture/:area/:genre/`
- 英語: `/en/a/:prefecture/:area/:genre/`

### 2. UI/UX (`AreaPage` 拡張)

既存の `AreaPage` を拡張し、`genre` パラメータを受け取れるようにする。

- **パンくずリスト (Breadcrumb)**:
  - 日本語: `探す` > `{エリア}の食べ放題` > `{エリア}の{ジャンル}食べ放題`
  - 英語: `Search` > `{Area}` > `{Genre} in {Area}`
  - セマンティックな `<nav aria-label="...">` とリンク構造。
- **見出し**:
  - 日本語: `{エリア}の{ジャンル}食べ放題`
  - 英語: `All-you-can-eat {Genre} in {Area}`
- **件数表示**:
  - 日本語: `{N}件`
  - 英語: `{N} places`
- **店舗一覧**:
  - 対象の都道府県・エリアかつ該当ジャンル（`genres` または `subGenres` に含まれる）の店舗を抽出。
  - 既存と同様に10件刻みで「さらに表示」対応。
- **0件時案内**:
  - 対象店舗がない場合、空状態表示（同エリア全体へのリンク、探すへのリンク）。

### 3. SEO & メタ情報 (`src/seo/meta.ts`)

- **ペア抽出 (`listAreaGenres`)**:
  - カタログ内の全店舗から、店舗が1件以上存在する `(prefecture, area, genre)` のユニークな組み合わせを抽出してソート。
- **URLパス (`areaGenrePath`)**:
  - `/a/${encodeURIComponent(prefecture)}/${encodeURIComponent(area)}/${encodeURIComponent(genre)}/`
- **タイトル (`areaGenreTitle` / `areaGenreTitleEn`)**:
  - 日本語: `{エリア}の{ジャンル}食べ放題{N}件｜料金と時間で切る｜タベホー`
  - 英語: `All-you-can-eat {Genre} in {Area}: {N} places by price and time｜Tabeho`
- **メタディスクリプション**:
  - 日本語: `{prefecture}・{area}の{genre}食べ放題{N}件を料金と制限時間で整理。{area}駅周辺で{genre}食べ放題を探すならタベホー。行く前に公式の最新情報を確認してください。`
  - 英語: `{Prefecture} · {Area}: {N} all-you-can-eat {genre} places with prices and time limits. Check the official source before you go.`
- **JSON-LD**:
  - `BreadcrumbList` 構造化データ（ホーム > エリア > エリア×ジャンル）を出力。
- **Hreflang & サイトマップ**:
  - 日英相互リンクタグ（`hreflang="ja"`, `hreflang="en"`, `x-default`）。
  - 全ペアを `sitemap.xml` のエントリに追加。

### 4. SSGプリレンダ (`scripts/prerender.mjs`)

- ビルド時に全ペアのHTML（日英）を `dist/a/{prefecture}/{area}/{genre}/index.html` および `dist/en/a/{prefecture}/{area}/{genre}/index.html` に生成。

## 受け入れ条件

1. `/a/:prefecture/:area/:genre` および `/en/a/:prefecture/:area/:genre` が正しく描画される。
2. パンくずリストが表示され、親エリアおよび探す画面へ遷移できる。
3. `meta.ts` にタイトル・説明文・JSON-LD生成関数が追加されテストを通過する。
4. `scripts/prerender.mjs` で全「エリア×ジャンル」ページの静的HTMLとサイトマップが正しく生成される。
5. 全自動テスト（`npm test`）、型チェック・ビルド（`npm run build`）、oxlint（`npm run lint`）が通過する。
