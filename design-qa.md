# Product Design QA — 食卓の新聞

## Source and implementation

- Source visual truth: `/Users/nakanokentaro/.codex/generated_images/01a07f21-1c8c-7091-87ea-ae997a679a29/exec-f13edde8-6e6b-4e48-8e70-8b18314700b3.png`
- Implementation screenshot: `/tmp/hodai-cho-redesign-desktop-qa.png`
- Combined comparison input: `/tmp/hodai-cho-design-qa-comparison-final.png`
- Route: `/`
- State: Japanese default, Tokyo selected, no filters, 71 results, first result list visible
- Viewport: 1487 × 1058 CSS px
- Source pixels: 1487 × 1058
- Implementation pixels: 1487 × 1058
- Device scale factor: 1
- Density normalization: none required

## Evidence

The source and rendered implementation were opened together in the combined comparison input. The full-view comparison confirms the same editorial composition: dark brand header, warm ivory paper surface, Japanese Mincho headline, terracotta accent, food still-life hero, direct search controls, and an information-dense restaurant list.

Focused region checks were made against the hero/search region and the first two result rows. The hero title now stays on one line at the reference viewport. Result imagery uses food still-life assets throughout the visible catalog instead of mixing the refreshed surface with the former dark illustration blocks.

## Comparison history

### Pass 1

- Finding: `[P2]` legacy dark genre illustrations appeared between the new food still-life images, creating an inconsistent visual rhythm in the bright editorial list.
- Fix: generated and added real food still-life assets for the remaining catalog genres and mapped them through `FoodImage`.
- Post-fix evidence: `/tmp/hodai-cho-redesign-desktop-qa.png` and `/tmp/hodai-cho-design-qa-comparison-final.png`; all 71 visible cards resolve to food image assets.

### Pass 2

- Finding: `[P2]` the hero headline wrapped earlier than the selected reference at the matched desktop viewport.
- Fix: widened the hero copy region and tuned the desktop headline size/line-height.
- Post-fix evidence: the hero title bounding box is 560 × 52.2 CSS px at 1487 × 1058; it renders on one line in `/tmp/hodai-cho-redesign-desktop-qa.png`.

## Required fidelity surfaces

- Fonts and typography: preserved Shippori Mincho for headings and IBM Plex Sans JP for body/UI; the revised hero hierarchy and line wrapping are aligned with the source direction.
- Spacing and layout rhythm: paper surface, full-bleed hero, compact search band, sidebar/results split, and horizontal result rules are consistent with the source. The extra keyword/time/region controls are intentional because they preserve the existing product's working search flow.
- Colors and visual tokens: kept the existing dark brand shell and required ink/ivory/stone/aka palette, adding only warm paper tokens within the search page.
- Image quality and asset fidelity: hero and catalog imagery are real generated food still-life PNG assets with no people, text, logos, or CSS/HTML image approximations.
- Copy and content: retained real catalog names, prices, hours, and station distances; added clear Japanese/English labels for region, cuisine, budget, and walking distance.

## Interaction and responsive checks

- Playwright verified direct area, cuisine, and walking-distance selection.
- Playwright verified the detail-condition sheet's walking-distance select and close action.
- Playwright verified the first result links to a real detail route.
- Desktop: `scrollWidth === viewportWidth` (1487 px).
- Mobile: `scrollWidth === viewportWidth` (390 px), six direct controls render, and the fixed bottom navigation remains present.
- Console/page errors: none observed in the desktop and mobile checks.

## Findings

No actionable P0, P1, or P2 findings remain. The source visual is a design target rather than a fixed production wireframe, so preserving the existing immediate-filter behavior and adding the keyword/time controls is considered an intentional product constraint.

## Follow-up Polish

- `[P3]` If the product later wants a more literal match to the selected target, the direct filter band could be given a larger single CTA and the advanced multi-genre/sidebar controls could move behind a secondary affordance.
- `[P3]` Add a dedicated all-day course label to the compact card summary if catalog presentation rules expand beyond the current lunch/dinner summary.

## Implementation Checklist

- [x] Selected visual target used as source truth.
- [x] Same viewport/state captured and compared.
- [x] Desktop and mobile overflow checked.
- [x] Core filters and detail navigation exercised.
- [x] Console errors checked.
- [x] Full test suite, build, and lint run.

final result: passed
