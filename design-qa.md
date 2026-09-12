# First-visit LP — design QA

final result: passed

## Evidence

- Date: 2026-09-12. Browser: Chrome via CUA (in-app browser was unavailable).
- Source: user-selected `tabeho-lp.png`, with the requested headline/caption edits shown in `exec-98591822-d701-49c6-b9d4-d23ded497f9c.png` (683 × 2048 px).
- Implementation: `http://127.0.0.1:4179/` and `/en/`, generated production HTML. Development preview at port 4178 was also exercised.
- Local evidence directory: `.superpowers/sdd/2026-09-12-first-visit-lp/qa/` (ignored scratch artifacts).
- Full comparison: `comparison-final.png` shows source left and final implementation right. Both normalized to 390 CSS pixels wide, aspect ratio retained; the comparison canvas is exported at 2× density (1560 × 2620 px).
- Japanese: `ja-390-final.png` (390 × 1310 px, 390 × 844 viewport, full-page capture at 1× density); `ja-320-final.png`; `ja-1280-final.png`.
- English: `en-320-final.png` (320px-wide full-page capture, 320 × 812 viewport).
- State: default LP, Japanese or English as named, no filters, no overlays.
- Focused inspection: headline, header language links, primary CTA, and three feature rows were inspected at native screenshot size as well as in the combined comparison. Photo loaded from the original local asset; no UI is rasterized.

## Comparison and fixes

1. Initial 390px capture (`ja-390-initial.png`): [P1] existing fixed mobile nav covered the main CTA; [P2] header and fixed 300px photo pushed the CTA too far down. Fixed by hiding MainNav only on LP routes, reducing mobile header height, and making the photograph responsive at 1.7 aspect ratio.
2. Second capture (`ja-390-v2.png`, `comparison-v2.png`): [P2] excess row spacing/header height and small-screen English CTA wrapping. Fixed by reducing mobile logo/header height, using responsive row minimum height with vertical padding, and centering the CTA label with a separately positioned library arrow.
3. Final captures: Japanese header 61px and primary CTA y=656.7–724.7 at 390px. English CTA fits on one line at 320px; all headline words remain visible. No actionable P0/P1/P2 findings remain.

## Required fidelity surfaces

- Typography: Noto Sans JP loaded, headline weight 900. Approved Japanese wording is exact and split across three lines. English adapts to four lines at 320px. Sans-serif section numbers deliberately follow repository constraints rather than the mock's serif numerals.
- Layout: dark brand header, editorial kicker, headline, explanatory copy, food image, primary CTA, numbered sections, secondary CTA, disclaimer. LP width is 512px centered at a 1280px viewport. No viewport overflow at 320/390/1280px. CTA and feature spacing are responsive; footer is longer because it retains the complete required shared disclaimer.
- Colors: existing page/surface/text/muted/line/accent/shell tokens retained. No added gradients, shadows, neon, or unsupported accent colors. The white CTA label is large bold text; body contrast is sufficient for normal text.
- Images/icons: original local logo and food photograph, both confirmed loaded. Crop differs slightly from the generated mock while preserving the same meal and photographic direction. Phosphor arrow/search icons replace temporary text/CSS approximations. No photo caption is rendered on the LP.
- Copy: requested headline, service description, budget/time/station explanations, Japanese and English CTA labels, full disclaimer, and affiliate disclosure. No fictional restaurant cards, counts, or reviews.

## Interaction/accessibility verification

- Japanese secondary CTA and English primary CTA open the matching search route. Japanese primary CTA is covered by integration tests.
- English keyword search narrowed 87 results to 6 Kobeya records; a real store opened its course detail.
- Save → Saved displayed the selected store; removing it restored the empty state and its search link. Test-created saved state was removed.
- Breadcrumb/back links use the matching search route. Header logo returns to LP; language toggle switches LP language and document lang.
- LP controls: logo 156 × 52px; language links 44 × 44px; primary CTA 346 × 68px; secondary CTA height 58px at 390px.
- Focus styling and reduced-motion rules are inherited from the existing global stylesheet. Decorative photo/logo alt behavior retained.
- Fresh production-preview browser tab: zero captured console errors. Earlier development-only import/HMR errors during file creation/dependency installation disappeared on the completed build.

## Follow-up polish

- P3: mock photo crop and paragraph line breaks are not pixel-identical. Required shared disclaimer is intentionally more detailed; mock decorative serif numerals are intentionally replaced with Noto Sans JP.
- No blocking gaps. No merge or deployment was performed.


## 2026-09-12 PC・スマホ対応の追加確認

ユーザー指示により担当者が直接実装。PCでも512px幅だったLPを、900px以上で最大1180pxの2列hero・3列特徴に変更。900px未満は最大680pxで縦構成。既存検索画面の幅は変更なし。

修正前1440px: main幅512px、写真はコピー下（PC幅利用・横並び検証ともFAIL）。
修正後: ja/enそれぞれ320/390/414/768/1024/1440pxで文書横幅=viewport、画面外に出る子要素0。日本語1440px main幅1180px、写真はコピー右、CTA下端635px。320px英語と390px日本語、1440px日本語をスクリーンショットでも目視確認。英語の長いラベルは折り返し、文字切れなし。

検証: landing.test.tsx 11/11、lint成功（既存FoodImage/GenreImageの警告2件）、build:ssg成功594URL。スクリーンショットと寸法記録はローカルの .superpowers/responsive-qa/。
