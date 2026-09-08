# タベホー コミュニティ問い合わせ・修正依頼 実装計画

## Task 1: ルートと辞書の受け皿

- 対象: `src/routes.tsx`, `src/components/SiteHeader.tsx`, `src/components/MainNav.tsx`, `src/i18n/ja.ts`, `src/i18n/en.ts`
- `/contact` と `/en/contact` を追加し、情報提供リンクを全画面のナビへ追加する。
- 辞書へ日英のナビ・ページ文言を追加する。
- 検証: ルートが型エラーなく解決する。
- コミット: `feat: add community contact route`（完了）

## Task 2: 問い合わせページと投稿URL

- 対象: `src/pages/ContactPage.tsx`, `src/index.css`, `tests/contact.test.tsx`
- フォーム、参加方法、確認方針、GitHub Issues下書き生成を実装する。
- 店名は自由入力とし、既存店の候補 datalist を補助に使う。未掲載店も投稿できるようにする。
- 検証: 必須入力、言語表示、投稿URLのタイトル・本文、送信後表示をテストする。
- コミット: `feat: add community contact page`（完了）

## Task 3: SSG・SEO・全体検証

- 対象: `src/seo/meta.ts`, `scripts/prerender.mjs`, `tests/seo.test.ts`, `tests/seo-en.test.ts`
- 問い合わせページの日英タイトル・説明・hreflang・sitemapを追加する。
- 検証: `npm test`, `npm run build`, `npm run build:ssg`, `npm run lint`。
- コミット: `feat: prerender community contact page`（完了）
