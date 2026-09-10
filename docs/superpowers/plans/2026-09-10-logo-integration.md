# タベホー ロゴ反映 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Steps use checkbox syntax for tracking.

**Goal:** ユーザーが選択・反映承認した1案（お皿と箸のタ）を共通ヘッダーとファビコンに反映し、PRを作成する。
**Architecture:** 同梱のRGB PNGを共通SiteHeaderから使用する。ヘッダー用は黒背景を `mix-blend-mode: lighten` でブランドシェルになじませ、faviconは生成り背景のシンボルを使う。既存の言語別ホームリンクとナビゲーションを維持する。SSGのHTMLでも同じ画像が参照される。
**Tech Stack:** React / TypeScript / CSS / Vitest。依存追加なし。
**Spec:** `docs/superpowers/specs/2026-09-06-hodai-cho-design.md` と2026-09-10チャットで承認された1案。朱色のお皿と箸で「タ」を表現したシンボル、タベホーとTABEHOの横組み。暗いヘッダー用は文字のみ生成りにする。

## Global Constraints

- 日英対応、ホームリンクのaccessible nameは日本語「タベホー ホーム」、英語「Tabeho home」。
- ヘッダー `#171512`、accent `#c4543a`、明色 `#fbfaf7`。既存本文のNoto Sans JPとパレットを維持。
- タップ面44px以上、ページ全体の横スクロール禁止。モバイル320px以上とPCで確認。
- カタログ・予約・保存・SEOの既存挙動を変更しない。追加依存なし。
- 選択済みロゴの形を保持。マージ・デプロイは実施しない。

### Task 1: 共通ブランド表示とファビコンを反映

**Files:**
- Create: `public/brand/tabeho-logo-header.png`, `public/brand/tabeho-symbol.png`
- Modify: `src/components/SiteHeader.tsx`, `src/index.css`, `index.html`
- Test: `tests/brand.test.tsx`
- Documentation: `public/brand/README.md`

**Interfaces:** controller supplies RGB assets: a black-backed header logo and an ivory-backed favicon. SiteHeader consumes `/brand/tabeho-logo-header.png`; favicon consumes `/brand/tabeho-symbol.png`. Set HTML image width/height from actual dimensions, preserve aspect ratio, and blend the header image into the dark shell with `mix-blend-mode: lighten`.

- [x] Step 1: RED: add focused tests rendering SiteHeader in MemoryRouter for `/` and `/en/`, asserting the accessible home link targets the right language root and contains an image pointing at the local asset. Verify index.html favicon resolves to existing PNG after assets are ready. Run `npx vitest run tests/brand.test.tsx` before replacing header and capture expected failures.
- [x] Step 2: Replace the two brand spans with `<img className="brand-logo" src="/brand/tabeho-logo-header.png" alt="" width={actualWidth} height={actualHeight} />`; accessible name stays on the Link. Remove obsolete brand-mark/brand-reading styles. Use `.brand-logo { display: block; width: 190px; height: auto; }` and 168px mobile width as starting points, adjusting if actual asset aspect ratio requires it. Preserve minimum 44px hit target and language toggle.
- [x] Step 3: Change favicon to `<link rel="icon" type="image/png" href="/brand/tabeho-symbol.png" />`. Document source selected concept and asset usage. Do not commit unused concept alternatives.
- [x] Step 4: GREEN: run focused tests, `npm test`, `npm run lint`, `npm run build:ssg`. Controller visually checks mobile/desktop JA/EN, the black header background blend, and the ivory favicon background. Fix any overflow or fuzzy/mismatched asset before handoff.
- [ ] Step 5: Commit cohesive implementation, review spec compliance and code quality, then push feature branch and create PR to main with test evidence. No merge/deploy.
