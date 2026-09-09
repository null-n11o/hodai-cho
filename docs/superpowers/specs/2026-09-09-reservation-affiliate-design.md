# 予約リンクのアフィリエイト

- 日付: 2026-09-09
- 状態: 実装中（URLは未投入。スキーマ・CTA・開示のみ）
- 正本: `docs/superpowers/specs/2026-09-06-hodai-cho-design.md` の要件・UI・カタログ制約を継承する

## 目的

予約CTAだけをアフィリエイト対象にし、公式サイトは素リンクのままにする。景品表示法上の広告表示を日英の共通免責で出す。この変更では実アフィリエイトURLは入れない。

## 方針

- 予約は `reservationAffiliateUrl` があればそれを使い、なければ `reservationUrl` に倒す。
- `officialUrl` は素リンクのまま。
- アフィリエイトリンクは `rel="sponsored nofollow noreferrer"`。
- 共通免責に日英のアフィリエイト広告表示を出す。
- 予約アフィリエイトは明示した `reservationAffiliateUrl` で渡す。
- 在庫連動・決済・クーポンは別機能。秘密値はリポジトリに置かない。

## フィールド

- `reservationUrl`（任意）: 予約の正規URL。未設定のアフィリエイト時のフォールバック。
- `reservationAffiliateUrl`（任意）: 予約CTA用のアフィリエイトURL。あれば予約CTAに使う。
- `reservationAffiliateProvider`（任意）: `'valuecommerce' | 'linkshare' | 'a8'`。監査用。画面では使わない。
- `officialUrl`（任意）: 公式サイトの素リンク。

どの店も `reservationAffiliateUrl` を必須にしない。

## href と rel

解決は `getReservationLinkProps(store)`（および `getReservationHref`）に集約する。

1. `reservationAffiliateUrl` があればそれを使い、`affiliate: true`。
2. なければ `reservationUrl` を使い、`affiliate: false`。
3. どちらも無ければ予約CTAは出さない。

- 予約アフィリエイト: `target="_blank"`、`rel="sponsored nofollow noreferrer"`
- 素の予約・公式・地図: 現行どおり `target="_blank"`、`rel="noreferrer"`

## 広告表示

`SiteDisclaimer` に日英の短い表示を常時出す。掲載店にアフィリエイトURLがまだ無くても出す。

- 日本語: 「アフィリエイト広告を利用しています」
- 英語: 「This site uses affiliate advertising.」

既存の料金・制限時間の免責文は残す。

## ASPの段階

文書上の方針のみ。この変更ではライブURLを入れない。

1. ValueCommerce を第一（ホットペッパー／食べログ）
2. ぐるなびは LinkShare
3. A8.net は Retty 等が増えた場合のみ

## 受け入れ条件

- スキーマが任意の `reservationAffiliateUrl` を受け付け、未設定の店でも動く。
- 予約CTAはアフィリエイトURLを優先し、なければ `reservationUrl`。
- アフィリエイト予約は `sponsored nofollow noreferrer`。`officialUrl` は素リンクのまま。
- 日英の免責にアフィリエイト表示がある。
- カタログにプレースホルダのアフィリエイトURLを置かない。
