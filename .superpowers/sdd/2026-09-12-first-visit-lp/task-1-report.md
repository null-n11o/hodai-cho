# Task 1 report: LPと検索導線の統合

## Status

Implemented and committed the bilingual first-visit landing page and moved the existing search experience to `/search/` and `/en/search/`.

## RED

- Command: `npx vitest run tests/landing.test.tsx tests/prerender.test.tsx`
- Result: 6 failures, 4 passes.
- Expected failures proved the missing behavior: `/` still rendered search, `/search/` matched no route, `searchPath` was absent, and SSR did not contain the approved landing copy.

## GREEN and verification

- Focused: `npx vitest run tests/landing.test.tsx tests/prerender.test.tsx tests/search.test.tsx tests/seo.test.ts tests/seo-en.test.ts` — 39/39 passed.
- Full suite: `npm test` — 204/204 passed across 38 files.
- Lint: `npm run lint` — exit 0; two pre-existing `react(only-export-components)` warnings in `GenreImage.tsx` and `FoodImage.tsx`.
- Production SSG: `npm run build:ssg` — exit 0; Vite built successfully and prerender produced 594 sitemap URLs.
- Generated output inspection confirmed canonical and ja/en/x-default hreflang tags for `/`, `/en/`, `/search/`, and `/en/search/`; LP copy/CTA appears in both languages; search output includes genres, real stores, and yen prices; sitemap contains both search routes.

## Changed files

- Added `src/pages/LandingPage.tsx`, `src/pages/landing.css`, and `tests/landing.test.tsx`.
- Updated routes and shared navigation destinations in `src/routes.tsx`, `src/i18n/language.ts`, `src/components/SiteHeader.tsx`, `src/components/MainNav.tsx`, and content pages.
- Extended `SiteDisclaimer` with optional image-disclaimer visibility.
- Updated SEO/SSG in `src/seo/meta.ts`, `scripts/prerender.mjs`, and `index.html`.
- Updated relevant route, language, search, prerender, and sitemap tests.
- Added `@phosphor-icons/react` for the CTA arrow and search icons.

## Commit

- `feat: add bilingual first-visit landing page and search entry`

## Concerns

- Lint retains two unrelated Fast Refresh warnings noted above.
- `npm install` reports three high-severity audit findings in the dependency tree; no automatic dependency remediation was run because it is outside this task.
- Browser QA and final visual comparison remain with the controller as assigned.
