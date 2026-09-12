# タベホー 設計書（要件・設計）

旧称：放題帖（hodai-cho）。2026-09-08にタベホーへ改名

- 日付: 2026-09-06（実装: 2026-09-06〜08、107店・SSG・英語対応まで拡張済み）
- 状態: 実装済み。新規開発はこの設計を土台にし、変更時はこのファイルを更新する。

## 1. ゴール

東京・神奈川の食べ放題だけを「いくら・何分・どの駅」で切れる条件帳。既存グルメサイトは食べ放題以外が混ざり、制限時間で切れない問題を解く。

## 2. スコープ / 非スコープ

- 対象: 東京・神奈川の食べ放題店（2026-09-08時点で107店）。焼肉・しゃぶしゃぶ・寿司・スイーツ・ピザ・串揚げ・宴会食放・パン食べ放題・お好み焼き・サラダバー・バイキング・定食おかわり自由の12ジャンル。
- 採否: 食べ放題が来店目的になりうる店・宴会コースまで可。飲み放題本体の居酒屋・バー、カラオケは除外。
- 予約は `reservationAffiliateUrl` があればそれを使い、なければ `reservationUrl` に倒す。アフィリエイトリンクは `rel="sponsored nofollow noreferrer"`。`officialUrl` は素リンクのまま。共通免責に日英のアフィリエイト広告表示を出す。詳細は `docs/superpowers/specs/2026-09-09-reservation-affiliate-design.md`。
- 在庫連動・決済・クーポン発行はしない。
- 本番公開URLの確定・DNS切替・Search Console登録は実装外（別作業）。Cloudflare Workers Static Assetsの設定とPreview検証手順は実装する。

## 3. アーキテクチャ

静的SPA（Vite + React + TypeScript + Tailwind、Vitest）。サーバDBなし。

```text
同梱カタログ（src/catalog/）→ Repository抽象（repository.ts）→ メモリ内即時フィルタ（src/filters/filter.ts）
→ 画面（src/pages/）／お気に入りはlocalStorage adapter（src/favorites/storage.ts）のみ
```

- 画面は `CatalogRepository` 抽象（`listStores()` / `getStore(id)` / `catalogVersion()`）にだけ依存する。将来API/CMSへ差し替えても画面は変更しない。
- フィルタ条件は永続化しない（再訪時は初期条件＝都県:東京）。永続化するのはお気に入りIDのみ（キー `tabeho`）。
- 公開基盤は Cloudflare Workers Static Assets とする。`npm run build:ssg` が生成する `dist/` を配信し、現時点では Worker の動的APIとD1は使わない。
- Cloudflare上のサービス名は `tabeho` とする。`/api/*` は将来のWorker API用に予約し、D1が必要になった場合も画面から直接接続せず、Worker APIとRepository実装を介して接続する。
- ドメイン・DNS・HTTPS・エッジ配信はCloudflareで管理する。ソースコードのGitリポジトリはCloudflare外でもよく、Git pushを起点にCloudflareへデプロイする。

## 4. カタログ

- 型とバリデーション: `src/catalog/schema.ts`（`CATALOG_VERSION` 付き、`validateCatalog()` で重複ID・空コース・不正価格/分数・不正pickを検出）。
- 実データ: `src/catalog/seed.ts` ＋ `src/catalog/data/*.ts`（チェーン別分割）。追加は人手精査済みのみ。未精査店は入れない。
- 店舗の必須項目: id・店名・かな・チェーン・都県・エリア・駅・徒歩分数・ジャンル・編集ピック（1〜5、外部点数ではない）・コース（時間帯/コース名/税込価格/制限分数、`null`＝無制限）・営業時間・ハイライト・行く前の注意。`closed` と `familyFriendly` はデータとして持つが画面に出さない。
- コースの `banquet` 旗＝宴会コース由来の食べ放題。店舗の `reservationUrl`＝予約の正規URL（任意・素リンク）。任意の `reservationAffiliateUrl` があれば予約CTAだけそれを使う。`officialUrl` は公式サイトの素リンク。
- 料金は税込の平日目安（2026年時点の公開情報）。土日加算・締切・店差は `notice` またはコース `note` に書く。

## 5. 画面

2026-09-12更新: トップ `/` と `/en/` は初回入口LP。検索は `/search/` と `/en/search/` に移動する。ロゴはLPへ、探す・戻る導線は検索へ。LP設計の正本は `2026-09-12-first-visit-lp-design.md`。LP写真の「ジャンルイメージ」表示はユーザー指定により省略する。

- トップLP（`/`、`/en/`）: サービス紹介と主・副CTAを表示し、各言語の検索へ案内する。初回判定や強制リダイレクトは行わない。
- 探す（`/search/`、`/en/search/`）: 検索用見出し・フリーワード・時間帯・予算を常時表示。都県/エリア/ジャンルはPC左サイドバー、モバイルはチップ横列。件数・並び替えの下に比較用の縦型店舗一覧。詳細条件ドロワーも維持。条件変更は即時反映。都県切替時は他条件を初期化、リセットは都県を維持。2026-09-08のUI刷新設計を参照。
- 一覧カード: ジャンル・店名・駅と徒歩（施設併記）・ランチ/ディナー最安と分数・ハイライト先頭1文・保存ボタン（カードのリンクとは別のボタン要素、`aria-label`＋`aria-pressed`）。
- 詳細（`/r/:id`）: 店情報・コース表（時間帯/コース名/税込/制限時間、注記は表の下）・ハイライト全文・行く前に・「地図で探す」（Google Maps外部リンク）・予約リンク（ある店のみ、別タブ。アフィリエイトなら `rel="sponsored nofollow noreferrer"`、素リンクなら `rel="noreferrer"`）・近い店/同じ系列（最大4件）・戻る・保存ボタン。未知IDは「店が見つからない」＋探す導線。
- 保存（`/saved`）: 保存順（新しいものが末尾）。0件なら空状態＋探す導線。フィルタ条件は読まない。
- エリア（`/a/:prefecture/:area`）: エリア名・件数・店カード一覧・探す導線。SEOの楔。
- ナビ: 共通ヘッダーのブランドロゴは各言語のLPへ遷移する。LPヘッダーはブランドと日英切替を表示する。LP以外のPCヘッダーは探す/保存/情報提供リンク、モバイル下部は同じ3タブを表示し、探すは `/search/`（英語は `/en/search/`）へ遷移してセーフエリアを避ける。
- 空状態: 「その条件の店はない」と緩和案内を文で出す。イラストやダミー店を出さない。

## 6. 絞り込み・並び

- 都県・エリア・ジャンル（副ジャンル含む）・フリーワード（NFKC正規化の部分一致、店名/かな/チェーン/駅/施設）・時間帯（ランチ/ディナー、`all-day` は両方にヒット）・分数（無制限/`le90`/`le120`、`le90` は無制限を含めない）・上限金額・並び（おすすめ/安い/近い/短い）。
- おすすめ順: 編集ピック降順→コース最安→徒歩分数。

## 7. デザイン制約（抜粋・全文は AGENTS.md）

- UIは日英対応（既定は日本語、`/en/` 以下に英語ページ、`hreflang` 付き。英語店名データは `src/catalog/en-names.ts`）。
- コンテンツ面はライトベースの「食卓の新聞」。地 `#f3efe8`、面 `#fbfaf7`、本文 `#29231e`、補助 `#756b61`、罫線 `#d5cbbf`、強調 `#c4543a`。ヘッダーとモバイルナビは `#171512` のブランドシェルとする。ネオン・紫・金・絵文字・人物写真・外部口コミ星の表示は禁止。
- 見出しと本文は Noto Sans JP。動き150–400ms（`prefers-reduced-motion` で無効化）。タップ面44px以上。文書言語は日本語を既定とし、`/en/` 以下では `lang="en"` にする。
- 料金は `¥` ＋ `toLocaleString('ja-JP')`。ページ全体の横スクロール禁止（横スクロールはチップ列のみ）。モバイルは1列、既存レスポンシブ実装に合わせPC最大幅1024pxで中央寄せ。
- ジャンル画像は料理静物の共通イメージ。人物・ロゴ・口コミ画面を含めず、「ジャンルイメージ」と明示する。
- 共通免責を探す画面フッターに出す。「掲載は東京・神奈川の食べ放題店に限った目安です。料金・制限時間は2026年時点の公開情報を編集したもので、店舗・曜日・フェアで変わります。行く前に公式を確認してください。」アフィリエイト広告の表示（「アフィリエイト広告を利用しています」／ "This site uses affiliate advertising."）も常時出す。

## 8. SSG・SEO・多言語

- `npm run build:ssg` で店別・エリア別静的HTML（日英）＋ `sitemap.xml` ＋ `robots.txt` を `dist/` へ生成。`SITE_URL` 環境変数で本番URL上書き可（既定は仮置きURL）。
- Cloudflareへの初期デプロイは `build:ssg` 後の `dist/` をWorkers Static Assetsとして公開する。店別・エリア別の静的HTMLを優先し、未知IDや未生成パスはSPAフォールバックで既存の専用表示へ委譲する。
- プリレンダはJS無効でも店名・料金・分数・リンクが読めること。localStorage参照はSSRで落ちないこと（`try/catch` 済み）。
- 基盤: `src/seo/meta.ts`（タイトル・説明・JSON-LD・sitemap）・`src/seo/prerender.tsx`・`scripts/prerender.mjs`・`src/routes.tsx`（Routes木）。

## 9. 受け入れ条件

- カタログが `validateCatalog()` を通る。
- ジャンル絞り込みで該当店だけが残り、除外対象（飲み放題居酒屋・カラオケ相当）が出ない。
- ランチ指定でランチ食べ放題のない店が消える。無制限/90分以内/120分以内の判定が仕様通り。
- 保存の追加・解除・再訪残存、未知ID表示、0件案内、地図・予約リンクの別タブ遷移、a11y（`aria-pressed`/`label`、44px、`lang="ja"`）。
- 全テストPASS＋`npm run build` 成功で `dist/` が静的配信可能な状態。

## 10. 関連ファイル

- 実装計画: `docs/superpowers/plans/2026-09-06-hodai-cho-implementation.md`（Task 1〜8は実施済み。以降の拡張は新規planを作る）
- 旧コピー: `docs/PLAN-20260906-300-hodai-cho-expansion.md`、`docs/PLAN-20260906-301-hodai-cho-implementation-plan.md`（内容は本設計書＋実装計画書に統合済み。履歴参照用に残す）

- UI刷新設計: `docs/superpowers/specs/2026-09-08-search-redesign-design.md`（ユーザー承認済みの「食卓の新聞」方向）。
- LPの料理画像・気分検索・モーション: `docs/superpowers/specs/2026-09-12-appetizing-landing-design.md`（2026-09-12承認済み）。検索機能の上部に料理を主役とした入口を追加。
- 予約アフィリエイト: `docs/superpowers/specs/2026-09-09-reservation-affiliate-design.md`（予約CTAのみ。公式は素リンク）。
