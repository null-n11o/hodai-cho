# タベホー Cloudflareアーキテクチャ設計

- 日付: 2026-09-08
- 状態: approved
- 対象: 現在の静的SPAをCloudflareで配信し、将来のAPI・D1追加に備える基盤
- 正本: `docs/superpowers/specs/2026-09-06-hodai-cho-design.md` の要件・UI・カタログ制約を継承する

## 1. 目的

タベホーをCloudflare上で公開できる状態にする。初期リリースでは現在の静的・SSG構成を維持し、DBを導入せず、将来必要になった場合にWorker APIとD1へ段階的に拡張できる境界を固定する。

## 2. 採用判断

- Cloudflare上のサービス名は `tabeho` とする。
- Web配信はCloudflare Workers Static Assetsを使う。
- `npm run build:ssg`で生成した`dist/`を公開物の正本とする。
- 現在のカタログ正本はGit管理下の`src/catalog/`とする。
- 現在はD1、R2、KV、Queues、認証、管理画面を導入しない。
- `/api/*`は将来のWorker API用に予約する。
- ドメイン、DNS、HTTPS、エッジ配信はCloudflareで管理する。
- GitリポジトリはCloudflare外でもよい。Git連携またはCIからCloudflareへデプロイする。

## 3. 目標構成

```text
Git repository
  └─ push / pull request
       └─ npm test && npm run lint && npm run build:ssg
            └─ dist/
                 └─ Cloudflare Workers Static Assets (tabeho)
                      ├─ /, /en/                 探す
                      ├─ /r/:id, /en/r/:id       店詳細SSG
                      ├─ /a/:pref/:area          エリアSSG
                      ├─ /saved                   localStorage中心の画面
                      └─ /api/*                   将来のWorker API予約領域

将来:
ブラウザ → Worker /api/* → D1
```

初期状態では静的ファイル配信だけを使い、API処理を追加する時点でWorkerコードを有効化する。

## 4. データ所有権

### 初期

- 店舗・コース・翻訳名・ジャンル画像: Git管理下のソース
- 公開ページ: SSGで生成された静的HTML
- お気に入り: ブラウザのlocalStorage
- 情報提供: 既存仕様に従い、DBへ保存しない

カタログは人手精査が必要な編集コンテンツであり、変更履歴・レビュー・再現可能なビルドを優先する。107店規模で公開リクエストのたびにDBを読む理由はない。

### D1導入後

D1を使う条件は、管理画面編集、頻繁な更新、情報提供の保存、アカウントをまたぐお気に入り同期のいずれかが必要になった時とする。

- ブラウザはD1へ直接接続しない。
- Worker APIが入力検証、認可、SQL実行を担当する。
- 画面は`CatalogRepository`に依存し、`BundledCatalogRepository`から`D1CatalogRepository`へ差し替える。
- 本番とPreviewのD1は分離する。
- スキーマ変更はSQL migrationをGit管理する。

## 5. ルーティングと失敗時の扱い

- 生成済みの店別・エリア別HTMLは静的アセットとして返す。
- 未知IDや未生成パスはSPAフォールバックでReact Routerへ委譲し、既存の「店が見つからない」または0件表示を出す。
- `/api/*`は初期公開時には未実装とし、将来のWorker APIにだけ使う。
- 外部予約・地図リンクの失敗はブラウザに委譲する。

## 6. 環境

- Production: 本番ドメイン、Cloudflare Workers本番デプロイ
- Preview: ブランチまたはPRごとのCloudflare Preview URL
- `SITE_URL`: SSGのcanonical URL、sitemap、robots生成用。Productionでは本番URLを設定する。
- Production URL: `https://tabeho.com`
- Custom Domain: `tabeho.com`。`www.tabeho.com`は別ホスト名として未設定。
- 秘密値: 将来のWorker Secretに保存し、リポジトリやViteの公開環境変数へ入れない。

## 7. 採用しないもの

- 初期からのD1化
- ブラウザからのD1直接アクセス
- 店舗情報を管理画面で編集できる前提の先行実装
- R2への既存ジャンル画像の移行
- KVをデータベース代わりにする設計
- Cloudflare Accessを一般ユーザー向けログインとして使う設計

## 8. 受け入れ条件

- `npm run build:ssg`で現在の店別・エリア別・日英HTML、sitemap、robotsが生成される。
- Cloudflare Workers Static Assetsの設定が`tabeho`の`dist/`を公開する。
- 生成済みの主要URLと未知IDのSPAフォールバックをローカルで確認できる。
- `tabeho.com`をProductionのカスタムドメインとして設定でき、`SITE_URL=https://tabeho.com`でcanonical URL、sitemap、robotsが生成される。
- D1や動的APIを追加せずに、現在のカタログ検索・詳細・保存・SEOの挙動が維持される。
