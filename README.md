# タベホー Tabeho

東京・神奈川の食べ放題を、**料金・制限時間・駅からの距離**で比べられる条件帳です。

一般的なグルメ検索では、食べ放題ではない店や「飲み放題」の情報も混ざり、食べ放題の条件を横並びで確認しにくいことがあります。タベホーは、食べ放題を目的に店を探すときに必要な条件だけを、店ごとに整理します。

## できること

### 条件から店を探す

トップページ（`/`）では、東京・神奈川を切り替えながら次の条件で絞り込めます。

- エリア、ジャンル、フリーワード（店名・系列・駅・施設など）
- ランチ、ディナー、終日などの時間帯
- 予算の上限（税込）
- 時間無制限、90分以内、120分以内
- 駅からの徒歩時間（3分、5分、10分、15分以内）
- おすすめ、安い順、近い順、短い順の並び替え

検索結果では、店ごとのジャンル、駅からの距離、ランチ・ディナーの目安料金と制限時間を見比べられます。

### 店の条件を詳しく見る

店の詳細ページ（`/r/:id`）では、次の情報を確認できます。

- コースごとの時間帯、税込料金、制限時間
- 食べ放題のポイントと、行く前に確認したい注意事項
- 営業時間、駅からの徒歩時間、施設名
- Google Maps、公式サイト、予約ページへの外部リンク（掲載がある場合）
- 近い店、同じ系列の店

### 気になる店を保存する

保存ページ（`/saved`）では、気になる店をハートで保存できます。アカウントは不要で、保存した店のIDだけをブラウザの `localStorage` に保存します。検索条件や個人情報は保存しません。

### エリア別に見る

エリアページ（`/a/:prefecture/:area`）では、エリアごとの掲載店を一覧できます。検索結果からエリアを起点に探したいときや、検索エンジンから直接店を見つけたいときの入口です。

### 日本語・英語で見る

日本語を標準とし、英語ページは `/en/` 以下に用意しています。

- 日本語: `/`、`/r/:id`、`/saved`、`/a/:prefecture/:area`、`/contact`
- 英語: `/en/`、`/en/r/:id`、`/en/saved`、`/en/a/:prefecture/:area`、`/en/contact`

英語ページでは、画面文言、店名、コース名、駅名・エリア名などを英語で表示します。

## 掲載ジャンル

現在は、次の12ジャンルを掲載しています。

焼肉、しゃぶしゃぶ、寿司、スイーツ、ピザ、串揚げ、宴会食放、パン食べ放題、お好み焼き、サラダバー、バイキング、定食おかわり自由

「定食おかわり自由」は料理全品の食べ放題ではなく、ご飯・味噌汁・キャベツなど、定食に含まれる一部が無料でおかわりできる店を指します。通常の食べ放題と混同しないよう、詳細ページのコース注記で対象品を説明しています。

## 掲載情報について

- 2026年9月8日時点で107店を収録しています。
- 店舗情報は人手で確認したものだけを掲載しています。
- 料金は税込の平日目安です。曜日、店舗、季節フェア、提供時間によって変わる場合があります。
- 掲載内容は公開情報や利用者からの情報をもとに編集しています。来店前に必ず店舗の公式情報を確認してください。
- 店舗写真ではなく、ジャンルを示す料理イメージを使用しています。
- 口コミ点数、アフィリエイト、在庫連動、決済、クーポン機能はありません。

## 情報提供・修正依頼

掲載内容の間違い、新しい店、閉店・提供終了などは、情報提供ページ（`/contact`）から知らせることができます。

タベホーはデータベースを持たないため、入力内容はGitHub Issuesの新規投稿画面に引き渡されます。運営が公式情報や訪問情報を確認してから、カタログへ反映します。すぐに自動掲載される仕組みではありません。

## 技術構成

タベホーは、サーバーやデータベースを使わずに配信できる静的SPAです。

```text
同梱カタログ（src/catalog/data/）
  → CatalogRepository（src/catalog/repository.ts）
  → メモリ内フィルタ（src/filters/filter.ts）
  → 探す・詳細・保存・エリア・情報提供の各画面
```

- Vite + React + TypeScript + Tailwind CSS
- React Routerによる画面遷移
- Vitestによるロジック・画面・日英対応・SEOのテスト
- 店舗カタログは `src/catalog/data/*.ts` に同梱
- お気に入りだけを `localStorage` に保存。検索条件は永続化しない
- 画面は `CatalogRepository` に依存し、将来カタログの取得元をAPIやCMSへ差し替えられる構成

## 開発環境で動かす

```bash
npm install
npm run dev
```

主なコマンド:

```bash
npm test                    # Vitestの全テスト
npx vitest run tests/<name> # 個別テスト
npm run lint                # oxlint
npm run build               # 型チェック＋本番ビルド
npm run build:ssg           # 静的HTML、sitemap.xml、robots.txtを生成
npm run preview             # 本番ビルドをローカル確認
```

`npm run build:ssg` では、トップ、情報提供、店別、エリア別の日本語・英語HTMLと `sitemap.xml`、`robots.txt` を `dist/` に生成します。公開URLを設定する場合は `SITE_URL` を指定してください。

```bash
SITE_URL=https://example.com npm run build:ssg
```

## CloudflareでPreview・配信する

Cloudflare上のサービス名は `tabeho` です。現在はデータベースを使わず、SSGで生成した `dist/` をCloudflare Workers Static Assetsとして配信します。

```bash
npm run build:cloudflare
npm run cf:dev
npx wrangler deploy --dry-run
```

本番URLを設定してビルドする場合:

```bash
SITE_URL=https://<本番ドメイン> npm run build:cloudflare
```

本番デプロイは、リリース承認後に次を実行します。

```bash
npx wrangler login
SITE_URL=https://<本番ドメイン> npm run cf:deploy
```

カスタムドメインの接続はCloudflareダッシュボードで行います。アカウントID、APIトークン、データベースID、秘密値はリポジトリへ保存しません。現在はD1や動的APIを設定していません。

## リポジトリ内の主な場所

- `src/catalog/` — 店舗データ、型、カタログ検証、Repository
- `src/pages/` — 探す、詳細、保存、エリア、情報提供の画面
- `src/components/` — 店カード、条件シート、コース表、共通ナビなど
- `src/filters/` — フリーワード、時間帯、予算、制限時間、並び替え
- `src/i18n/` — 日本語・英語の文言と表示整形
- `src/seo/`、`scripts/prerender.mjs` — メタ情報、JSON-LD、SSG、sitemap
- `tests/` — カタログ、絞り込み、画面、保存、日英、SEOのテスト
- `docs/superpowers/specs/2026-09-06-hodai-cho-design.md` — 要件・設計の正本
- `docs/superpowers/plans/2026-09-06-hodai-cho-implementation.md` — 実装計画

本番URLの確定、デプロイ、Search Console登録はこのリポジトリの実装範囲外です。
