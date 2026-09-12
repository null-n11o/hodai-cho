# First Visit LP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 選択済みLPをトップに実装し、日英の検索に接続する。

**Architecture:** LandingPageをトップに置き、既存SearchPageをsearchパスへ移す。共有searchPathで検索導線を統一する。既存静的SPA/SSG構成を維持する。

**Tech Stack:** Vite / React / TypeScript / Tailwind / Vitest。

**Spec:** docs/superpowers/specs/2026-09-12-first-visit-lp-design.md

## Global Constraints

- UIは日英対応（既定は日本語、`/en/` 以下に英語、`hreflang` 付き）。文書言語もパスに同期。
- page #f3efe8 / surface #fbfaf7 / text #29231e / muted #756b61 / line #d5cbbf / accent #c4543a / shell #171512。見出し・本文・番号はNoto Sans JP。
- LP最大幅512px中央寄せ。既存検索等の幅は変更しない。ページ横スクロール禁止。44px以上の操作面、可視フォーカス、150–400msの動き、prefers-reduced-motionで無効。
- 写真は既存 `/food/hero-all-day.png`、ロゴは既存 `/brand/tabeho-logo-header.png`。LP写真は装飾画像としてalt=""、ユーザー指定で「ジャンルイメージ」は表示しない。既存店カードの画像説明は変更しない。
- ネオン・紫・金・絵文字・人物写真・外部口コミ星・ダミー店・実績捏造は禁止。
- 店舗はCatalogRepository経由、保存・料金表示・予約リンク・公式リンクの既存仕様を維持。店舗追加なし。
- LPにも共通の料金・条件免責と日英アフィリエイト広告表示を出す。画像説明のみLPで省略可能なSiteDisclaimer拡張を使う。
- マージ・デプロイはしない。既存未マージの作業ブランチを基底とする差分PRを作成。

### Task 1: LPと検索導線の統合

**Files:**
- Create: `src/pages/LandingPage.tsx`, `src/pages/landing.css`, `tests/landing.test.tsx`
- Modify: `src/routes.tsx`, `src/i18n/language.ts`, `src/components/SiteHeader.tsx`, `src/components/SiteDisclaimer.tsx`
- Modify: `src/pages/DetailPage.tsx`, `src/pages/AreaPage.tsx`, `src/pages/SavedPage.tsx`, `src/pages/ContactPage.tsx`
- Modify: `src/seo/meta.ts`, `scripts/prerender.mjs`, `index.html`, relevant existing route/SEO tests

**Interfaces:**
- Consumes: useLanguage(), dictionary(lang), existing SearchPage, shared SiteHeader/LanguageToggle/SiteDisclaimer, renderRoute(path).
- Produces: LandingPage(): JSX, searchPath(lang: Lang): string returning `/search/` or `/en/search/`; SiteDisclaimer({ showImageDisclaimer = true }: { showImageDisclaimer?: boolean }).

- [x] **Step 1: RED — add meaningful navigation/SSR tests**

```tsx
render(<MemoryRouter initialEntries={['/']}><AppRoutes /></MemoryRouter>);
expect(screen.getByRole('heading', {level: 1})).toHaveTextContent('今日は好きなだけ食べよう。');
expect(screen.queryByText('ジャンルイメージ')).toBeNull();
fireEvent.click(screen.getByRole('link', {name: '食べ放題を探す'}));
expect(screen.getByRole('searchbox')).toBeInTheDocument();
```

同じ方式で英語CTA→英語検索、LP言語切替、ロゴ→LP、保存0件/未知ID/詳細/エリアの探す→searchを確認。SSRはトップにコピーとCTA、searchに既存ジャンル・実店舗・料金。sitemapは日英search追加を検証。既存トップ検索テストの入口をsearchへ修正する。

Run: `npx vitest run tests/landing.test.tsx tests/prerender.test.tsx`。現行トップが検索のため失敗を確認。

- [x] **Step 2: GREEN — implement selected design and route contract**

```tsx
export function searchPath(lang: Lang): string {
  return lang === 'en' ? '/en/search/' : '/search/';
}
// Routes: / and /en/ -> LandingPage; /search and /en/search -> SearchPage.
// Both LP actions use <Link to={searchPath(lang)}>.
```

LandingPageの3行見出しはspan＋display:blockで上記全文を保持。本文と3項目は設計書/添付通り。実画像を使う。LPヘッダーのみ512px、ブランド説明/検索ナビを省略して日本語/ENを表示。その他ヘッダーではsearchのNavLinkだけ付け替え。既存全searchToを共有関数へ。LPのSiteDisclaimerはshowImageDisclaimer=falseで画像説明を除き、既存免責/広告表示を継承。CSSはlanding専用セレクタ、本文と番号はNoto Sans JP、写真は横幅100%・高さ約300px at 512px・右寄せobject-positionで料理が見えるようにする。アイコンは既存アセットまたは正式ライブラリを利用し、手描きSVGを増やさない。

SSGトップのタイトルに新コピーを反映、searchの日英ページをwritePairで追加。sitemapEntriesにsearchを追加。既存検索SEOの説明をsearchに継承し、LPメタはサービス紹介にする。

- [x] **Step 3: focused verification and refactor**

Run: `npx vitest run tests/landing.test.tsx tests/prerender.test.tsx tests/search.test.tsx tests/seo.test.ts tests/seo-en.test.ts`。新旧導線が通るまで修正。コピーやパス重複を整理する。

- [x] **Step 4: complete verification**

Run: `npm test`, `npm run lint`, `npm run build:ssg`。生成HTMLのトップ/search日英canonical・hreflang・本文を確認。ブラウザ確認はcontrollerが行う。

- [x] **Step 5: commit**

```bash
git add src tests scripts/prerender.mjs index.html package.json package-lock.json
git commit -m "feat: add bilingual first-visit landing page and search entry"
```

Task後は仕様準拠・品質レビューとブラウザ比較を行う。検証記録を追記してコミットし、`feature/m1-area-genre-ssg` をbaseにPRを作成する。

## Verification result

2026-09-12: baseline198 → 212 tests passing (38 files). lint succeeds with two existing Fast Refresh warnings. build:ssg succeeds (594 sitemap URLs). Browser QA passed at320/390/1280px; see design-qa.md. Implementation cac01a0; review coverage e97ae6a.
