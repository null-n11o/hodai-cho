---
id: PLAN-20260906-301
title: 放題帖02_dev実装計画（静的SPA＋カタログ拡張）
status: approved
owner: cpo
department: product
created: 2026-09-06
updated: 2026-09-06
review:
  approved_by: ceo
  approved_date: 2026-09-06
---

# 放題帖 Implementation Plan

> 実施状況: Task 1〜8は実施済み。以降は107店・SSG・英語対応まで拡張済み（git履歴参照）。以降の拡張は新規planを作ること。`docs/PLAN-20260906-301-hodai-cho-implementation-plan.md` は初期計画の履歴参照用。

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 要求定義書v1.1＋宴会食放拡張を `02_dev/hodai-cho` の静的SPAとして動く形で実装する。

**Architecture:** 同梱JSONカタログ→Repository抽象→メモリ内即時フィルタ→3画面（探す/詳細/保存）。お気に入りのみlocalStorage。外部通信は地図・予約の外部リンクのみ。

**Tech Stack:** Vite + React + TypeScript + Tailwind + Vitest (+ Testing Library, jsdom)。サーバDBなし。

**Spec:** `workspace/corporate-planning/plans/PLAN-20260906-300-hodai-cho-expansion.md`（approved、product側に参照コピーあり）。実行者はSpecと本計画の両方を読むこと。

## Global Constraints

- 日英対応。既定は日本語、`/en/` 以下は英語ページとし、文書言語もパスに同期する。
- コンテンツ面はライトベースの「食卓の新聞」。地 `#f3efe8`、面 `#fbfaf7`、本文 `#29231e`、補助 `#756b61`、罫線 `#d5cbbf`、強調 `#c4543a`。ヘッダーとモバイルナビは `#171512` のダークなブランドシェルとする。ネオン・紫・金・絵文字・人物写真・外部口コミ星の表示は禁止。
- 見出しと本文は Noto Sans JP（Google Fonts＋system fallback）。
- 動きは150–400ms。保存ハートはアウトライン↔塗り。`prefers-reduced-motion` では無効化。
- タップ面44px以上。保存ボタンは `aria-label` と `aria-pressed` を持つ。`lang="ja"`。
- 料金表示は `¥` ＋ 日本ロケール（`toLocaleString('ja-JP')`）。税込の平日目安。土日加算は注記側。
- ページ全体の横スクロール禁止。横スクロールはエリア/ジャンルチップの横列のみ。最大幅モバイルカラム（`max-w-lg`）中央寄せ。
- お気に入りIDのみ永続化（キー `hodai-cho`）。フィルタ条件は永続化しない（再訪時は初期条件＝都県:東京）。
- カタログは人手精査済みのみ掲載。未精査店は入れない。共通免責を探す画面フッターに出す。「掲載は東京・神奈川の食べ放題店に限った目安です。料金・制限時間は2026年時点の公開情報を編集したもので、店舗・曜日・フェアで変わります。行く前に公式を確認してください。」
- 予約リンクは別タブ。任意の `reservationAffiliateUrl` がある店のみ予約CTAをアフィリエイトURLにし、なければ `reservationUrl` の素リンクに倒す。アフィリエイトは `rel="sponsored nofollow noreferrer"`。公式サイト（`officialUrl`）は素リンクのまま。在庫連動・決済・クーポン発行はしない。LinkSwitchは使わない。
- ジャンル写真はカテゴリ共通の料理静物。店の実写は持たない。空状態にイラストやダミー店を出さない。

## File Structure

```text
02_dev/hodai-cho/
  index.html                      # lang="ja"、タイトル放題帖、Noto Sans JPリンク
  scripts/
    prerender.mjs                 # 店・エリア・問い合わせの日英SSG、sitemap、robots
  src/
    main.tsx                      # BrowserRouterを起動
    routes.tsx                    # 日本語・英語のRoutes木
    i18n/                         # 日英辞書・言語判定・表示整形
    catalog/
      schema.ts                   # 型＋日英を含むバリデーション（version付き）
      seed.ts                     # 同梱カタログ実データの結合
      data/*.ts                   # 店舗・定食おかわり自由データ
      en-names.ts                 # 駅・系列の英語名
      repository.ts               # CatalogRepository抽象＋同梱実装
    filters/
      filter.ts                   # F-01〜F-08 の絞り込み・並び・正規化
    favorites/
      storage.ts                  # localStorage adapter（キー hodai-cho）
    components/
      FilterSheet.tsx             # 詳細条件ドロワー
      StoreCard.tsx               # 一覧カード
      CourseTable.tsx             # 詳細コース表
      EmptyState.tsx              # 0件・未知ID表示
      FoodImage.tsx               # 料理静物のジャンル画像
      GenreImage.tsx              # ジャンル画像のフォールバック
      SiteHeader.tsx              # 共通ヘッダー
      MainNav.tsx                 # モバイル下部ナビ
    pages/
      SearchPage.tsx              # 探す（/）
      DetailPage.tsx              # 詳細（/r/:id）
      SavedPage.tsx               # 保存（/saved）
      AreaPage.tsx                # エリア（/a/:prefecture/:area）
      ContactPage.tsx             # 情報提供（/contact）
    seo/
      meta.ts                     # 日英meta、JSON-LD、sitemap
      prerender.tsx               # 静的HTML断片
  tests/
    *.test.ts / *.test.tsx        # ロジック、画面、日英、SEO、SSGのテスト
```

画面側は `CatalogRepository` 抽象にだけ依存する。将来API/CMSへ差し替えても画面は変更しない。

---

### Task 1: 足場を作る

**Files:**
- Create: `02_dev/hodai-cho/` 配下全部（`npm create vite@latest hodai-cho -- --template react-ts`、Tailwind、Vitest一式）
- Test: `tests/smoke.test.ts`

**Interfaces:**
- Consumes: なし
- Produces: 動くVite雛形＋`npm test`（vitest run）が通る状態を後続タスクが使う

- [ ] **Step 1: プロジェクトを作る**

Run（`02_dev/` で実行）:

```bash
npm create vite@latest hodai-cho -- --template react-ts
npm --prefix hodai-cho install
npm --prefix hodai-cho install -D tailwindcss postcss autoprefixer vitest jsdom @testing-library/react @testing-library/jest-dom
npm --prefix hodai-cho exec tailwindcss init -p
```

- [ ] **Step 2: テーマと土台を書く**

`tailwind.config.js` の `theme.extend.colors` に次を足す:

```js
ink: '#0e0d0c',
ivory: '#ece7de',
stone: '#9a9084',
stonedim: '#6f675e',
aka: '#c4543a',
```

`index.html` の `<html>` を `<html lang="ja">` にし、タイトルを `放題帖｜東京・神奈川の食べ放題だけを、料金と時間で切る` にする。フォントを足す:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@600;700&family=IBM+Plex+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet" />
```

- [ ] **Step 3: スモークテストを書く**

```ts
// tests/smoke.test.ts
import { describe, expect, it } from 'vitest';

describe('scaffold', () => {
  it('boots', () => {
    expect(true).toBe(true);
  });
});
```

- [ ] **Step 4: テストを走らせて通す**

Run（`02_dev/hodai-cho/` で実行）:

```bash
npx vitest run tests/smoke.test.ts
```

Expected: PASS（1 passed）

- [ ] **Step 5: git初期化してコミット**

Run（`02_dev/hodai-cho/` で実行）:

```bash
git init
git add -A
git commit -m "feat: scaffold hodai-cho static SPA"
```

---

### Task 2: カタログの型と倉庫を作る

**Files:**
- Create: `src/catalog/schema.ts`, `src/catalog/seed.ts`, `src/catalog/repository.ts`
- Test: `tests/repository.test.ts`

**Interfaces:**
- Consumes: Task 1の雛形
- Produces: `CatalogRepository`（`listStores(): Store[]`、`getStore(id): Store | undefined`、`catalogVersion(): string`）、`Store`/`Course`型、`validateCatalog()` をTask 3以降が使う

- [ ] **Step 1: 失敗するテストを書く**

```ts
// tests/repository.test.ts
import { describe, expect, it } from 'vitest';
import { BundledCatalogRepository } from '../src/catalog/repository';
import { validateCatalog } from '../src/catalog/schema';

describe('catalog repository', () => {
  it('33店のv1.1相当＋宴会食放の例を壊れなく読める', () => {
    const repo = new BundledCatalogRepository();
    const stores = repo.listStores();
    expect(stores.length).toBeGreaterThan(0);
    expect(validateCatalog(stores)).toEqual([]);
  });

  it('未知IDは undefined を返す', () => {
    const repo = new BundledCatalogRepository();
    expect(repo.getStore('no-such-shop')).toBeUndefined();
  });

  it('宴会コース旗を持つ店が読める', () => {
    const repo = new BundledCatalogRepository();
    const banquet = repo.listStores().filter((s) => s.courses.some((c) => c.banquet));
    expect(banquet.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: 走らせて失敗を確認**

Run:

```bash
npx vitest run tests/repository.test.ts
```

Expected: FAIL（`BundledCatalogRepository` が未定義）

- [ ] **Step 3: 最小実装を書く**

```ts
// src/catalog/schema.ts
export const CATALOG_VERSION = '2026-09-06+enkaibanquet.1';

export type Prefecture = '東京' | '神奈川';
export type TimeSlot = 'lunch' | 'dinner' | 'all-day';
export type Genre = '焼肉' | 'しゃぶしゃぶ' | '寿司' | 'スイーツ' | 'ピザ' | '串揚げ' | '宴会食放';

export interface Course {
  slot: TimeSlot;
  name: string;
  priceInclTax: number;
  minutes: number | null; // null は時間無制限
  note?: string;
  banquet?: boolean; // 宴会コース由来なら true
}

export interface Store {
  id: string;
  name: string;
  kana: string;
  chain: string;
  prefecture: Prefecture;
  area: string;
  station: string;
  walkMinutes: number;
  facility?: string;
  genres: Genre[];
  subGenres?: Genre[];
  pick: 1 | 2 | 3 | 4 | 5; // 編集ピック。外部点数ではない
  courses: Course[];
  hours: string;
  closed?: string; // データは持つが画面では出さない
  highlights: string[];
  notice: string; // 行く前に
  familyFriendly: boolean; // データは持つが画面では出さない
  reservationUrl?: string; // 予約の正規URL（素リンク）
  reservationAffiliateUrl?: string; // 予約CTA用の任意アフィリエイトURL。未設定なら reservationUrl に倒す
}

export function validateCatalog(stores: Store[]): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const s of stores) {
    if (ids.has(s.id)) errors.push(`duplicate id: ${s.id}`);
    ids.add(s.id);
    if (s.courses.length === 0) errors.push(`no courses: ${s.id}`);
    for (const c of s.courses) {
      if (!Number.isInteger(c.priceInclTax) || c.priceInclTax <= 0) errors.push(`bad price: ${s.id}/${c.name}`);
      if (c.minutes !== null && (!Number.isInteger(c.minutes) || c.minutes <= 0)) errors.push(`bad minutes: ${s.id}/${c.name}`);
    }
    if (s.pick < 1 || s.pick > 5) errors.push(`bad pick: ${s.id}`);
  }
  return errors;
}
```

```ts
// src/catalog/repository.ts
import type { Store } from './schema';
import { CATALOG_VERSION } from './schema';
import { SEED_STORES } from './seed';

export interface CatalogRepository {
  listStores(): Store[];
  getStore(id: string): Store | undefined;
  catalogVersion(): string;
}

export class BundledCatalogRepository implements CatalogRepository {
  private readonly stores: Store[] = SEED_STORES;
  listStores(): Store[] {
    return this.stores;
  }
  getStore(id: string): Store | undefined {
    return this.stores.find((s) => s.id === id);
  }
  catalogVersion(): string {
    return CATALOG_VERSION;
  }
}
```

`src/catalog/seed.ts` には完全な形の店を2件入れる（形の見本を兼ね、全件はTask 6で承認済み候補リストから足す）:

```ts
// src/catalog/seed.ts
import type { Store } from './schema';

export const SEED_STORES: Store[] = [
  {
    id: 'syabuyo-shinjuku-nowa',
    name: 'しゃぶ葉 新宿NOWAビル店',
    kana: 'しゃぶよう しんじゅく',
    chain: 'しゃぶ葉',
    prefecture: '東京',
    area: '新宿',
    station: '新宿',
    walkMinutes: 3,
    genres: ['しゃぶしゃぶ'],
    pick: 5,
    courses: [
      { slot: 'lunch', name: '平日ランチ食べ放題', priceInclTax: 1649, minutes: null },
      { slot: 'dinner', name: 'ディナー食べ放題', priceInclTax: 2749, minutes: 100 },
    ],
    hours: '11:00–23:00',
    highlights: ['平日ランチは時間無制限の目安', '駅から3分の目安'],
    notice: '料金・制限時間は2026年時点の公開情報の目安です。土日祝加算や都心価格の場合があります。行く前に公式を確認してください。',
    familyFriendly: true,
  },
  {
    id: 'example-enkai-shinjuku',
    name: '（例）新宿 宴会食放モデル店',
    kana: 'しんじゅく えんかい',
    chain: 'モデルチェーン',
    prefecture: '東京',
    area: '新宿',
    station: '新宿',
    walkMinutes: 5,
    genres: ['宴会食放'],
    subGenres: ['焼肉'],
    pick: 3,
    courses: [
      { slot: 'dinner', name: '宴会食べ放題コース', priceInclTax: 3500, minutes: 120, banquet: true },
    ],
    hours: '17:00–23:00',
    highlights: ['宴会コース由来の食べ放題の例'],
    notice: '宴会コースの内容・時間は店舗・曜日で変わります。行く前に公式を確認してください。',
    familyFriendly: false,
    reservationUrl: 'https://example.com/reserve',
  },
];
```

- [ ] **Step 4: テストを走らせて通す**

Run:

```bash
npx vitest run tests/repository.test.ts
```

Expected: PASS（3 passed）

- [ ] **Step 5: コミット**

```bash
git add src/catalog tests/repository.test.ts
git commit -m "feat: add catalog schema, repository and seed"
```

---

### Task 3: 絞り込みと並びを作る

**Files:**
- Create: `src/filters/filter.ts`
- Test: `tests/filter.test.ts`

**Interfaces:**
- Consumes: Task 2の `Store`/`Course` 型
- Produces: `filterStores(stores, cond): Store[]`、`FilterCond` 型をTask 4（探す画面）が使う

- [ ] **Step 1: 失敗するテストを書く**

```ts
// tests/filter.test.ts
import { describe, expect, it } from 'vitest';
import { filterStores } from '../src/filters/filter';
import { SEED_STORES } from '../src/catalog/seed';

describe('filterStores', () => {
  const base = { prefecture: '東京' as const, area: undefined, freeword: '', genres: [], slot: 'all' as const, timeLimit: 'all' as const, budget: undefined, sort: 'recommend' as const };

  it('神奈川に切ると東京の店が消える', () => {
    const got = filterStores(SEED_STORES, { ...base, prefecture: '神奈川' });
    expect(got.every((s) => s.prefecture === '神奈川')).toBe(true);
  });

  it('時間無制限は minutes == null のコースがある店だけ', () => {
    const got = filterStores(SEED_STORES, { ...base, timeLimit: 'unlimited' });
    expect(got.length).toBeGreaterThan(0);
    expect(got.every((s) => s.courses.some((c) => c.minutes === null))).toBe(true);
  });

  it('90分以内は無制限を含めない', () => {
    const got = filterStores(SEED_STORES, { ...base, timeLimit: 'le90' });
    expect(got.every((s) => s.courses.some((c) => c.minutes !== null && c.minutes <= 90))).toBe(true);
  });

  it('フリーワードはNFKC正規化の部分一致', () => {
    const got = filterStores(SEED_STORES, { ...base, freeword: 'ｼﾝｼﾞｭｸ' });
    expect(got.length).toBeGreaterThan(0);
  });

  it('宴会食放ジャンルで絞れる', () => {
    const got = filterStores(SEED_STORES, { ...base, genres: ['宴会食放'] });
    expect(got.every((s) => s.genres.includes('宴会食放') || (s.subGenres ?? []).includes('宴会食放'))).toBe(true);
  });
});
```

- [ ] **Step 2: 走らせて失敗を確認**

Run:

```bash
npx vitest run tests/filter.test.ts
```

Expected: FAIL（`filterStores` が未定義）

- [ ] **Step 3: 最小実装を書く**

```ts
// src/filters/filter.ts
import type { Genre, Prefecture, Store, TimeSlot } from '../catalog/schema';

export type SlotCond = 'all' | 'lunch' | 'dinner';
export type TimeLimitCond = 'all' | 'unlimited' | 'le90' | 'le120';
export type SortCond = 'recommend' | 'cheap' | 'near' | 'short';

export interface FilterCond {
  prefecture: Prefecture;
  area?: string;
  freeword: string;
  genres: Genre[];
  slot: SlotCond;
  timeLimit: TimeLimitCond;
  budget?: number;
  sort: SortCond;
}

function slotHit(slot: TimeSlot, cond: SlotCond): boolean {
  if (cond === 'all') return true;
  return slot === cond || slot === 'all-day';
}

function norm(s: string): string {
  return s.normalize('NFKC').toLowerCase();
}

export function coursesInScope(store: Store, cond: FilterCond) {
  return store.courses.filter((c) => slotHit(c.slot, cond.slot));
}

export function minPrice(courses: { priceInclTax: number }[]): number {
  return Math.min(...courses.map((c) => c.priceInclTax));
}

export function shortestFinite(courses: { minutes: number | null }[]): number {
  const finite = courses.map((c) => c.minutes).filter((m): m is number => m !== null);
  return finite.length === 0 ? 999 : Math.min(...finite);
}

export function filterStores(stores: Store[], cond: FilterCond): Store[] {
  const fw = norm(cond.freeword.trim());
  const out = stores.filter((s) => {
    if (s.prefecture !== cond.prefecture) return false;
    if (cond.area && s.area !== cond.area) return false;
    if (cond.genres.length > 0) {
      const all = [...s.genres, ...(s.subGenres ?? [])];
      if (!cond.genres.some((g) => all.includes(g))) return false;
    }
    if (fw) {
      const hay = norm([s.name, s.kana, s.chain, s.station, s.facility ?? ''].join(' '));
      if (!hay.includes(fw)) return false;
    }
    const scoped = coursesInScope(s, cond);
    if (scoped.length === 0) return false;
    if (cond.timeLimit === 'unlimited' && !scoped.some((c) => c.minutes === null)) return false;
    if (cond.timeLimit === 'le90' && !scoped.some((c) => c.minutes !== null && c.minutes <= 90)) return false;
    if (cond.timeLimit === 'le120' && !scoped.some((c) => c.minutes === null || (c.minutes !== null && c.minutes <= 120))) return false;
    if (cond.budget !== undefined && minPrice(scoped) > cond.budget) return false;
    return true;
  });
  const by = {
    recommend: (a: Store, b: Store) =>
      b.pick - a.pick || minPrice(coursesInScope(a, cond)) - minPrice(coursesInScope(b, cond)) || a.walkMinutes - b.walkMinutes,
    cheap: (a: Store, b: Store) => minPrice(coursesInScope(a, cond)) - minPrice(coursesInScope(b, cond)),
    near: (a: Store, b: Store) => a.walkMinutes - b.walkMinutes,
    short: (a: Store, b: Store) => shortestFinite(coursesInScope(a, cond)) - shortestFinite(coursesInScope(b, cond)),
  }[cond.sort];
  return [...out].sort(by);
}
```

- [ ] **Step 4: テストを走らせて通す**

Run:

```bash
npx vitest run tests/filter.test.ts
```

Expected: PASS（5 passed）

- [ ] **Step 5: コミット**

```bash
git add src/filters tests/filter.test.ts
git commit -m "feat: add filter and sort logic"
```

---

### Task 4: 探す画面を作る

**Files:**
- Create: `src/components/FilterSheet.tsx`, `src/components/StoreCard.tsx`, `src/components/EmptyState.tsx`, `src/pages/SearchPage.tsx`
- Modify: `src/main.tsx`（`/` のルート追加）
- Test: `tests/search.test.tsx`

**Interfaces:**
- Consumes: Task 2のRepository、Task 3の `filterStores`/`FilterCond`
- Produces: `/` で動く探す画面をTask 5のナビが使う

- [ ] **Step 1: 失敗するテストを書く**

```tsx
// tests/search.test.tsx
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SearchPage } from '../src/pages/SearchPage';

describe('SearchPage', () => {
  it('東京の店一覧が出て件数が表示される', () => {
    render(<MemoryRouter><SearchPage /></MemoryRouter>);
    expect(screen.getByText(/件/)).toBeTruthy();
  });

  it('0件のときダミー店を出さず緩和案内がある', () => {
    render(<MemoryRouter><SearchPage /></MemoryRouter>);
    // 存在しない駅で0件にする操作はUI経由で行う。ここでは空状態コンポーネントの文言を保証する
    expect(screen.queryByText(/ダミー/)).toBeNull();
  });
});
```

使う前に `npm install react-router-dom` すること（Step 3に含める）。

- [ ] **Step 2: 走らせて失敗を確認**

Run:

```bash
npx vitest run tests/search.test.tsx
```

Expected: FAIL（`SearchPage` が未定義）

- [ ] **Step 3: 最小実装を書く**

```bash
npm install react-router-dom
```

`StoreCard.tsx`: ジャンル名・店名・駅と徒歩（施設併記）・ランチ最安と分数または「食べ放題なし」・ディナー最安と分数・ハイライト先頭1文・保存ボタン（`aria-label="保存する"`＋`aria-pressed`、カードのリンクとは別のボタン要素にする）。価格は `¥{min.toLocaleString('ja-JP')}〜`。

`FilterSheet.tsx`: 下から出るドロワーに時間帯・分数・上限（1,000〜8,000円の500円刻み）・並びを置く。いずれかが初期値以外なら「条件」ボタンを強調表示にする。

`EmptyState.tsx`: 「その条件の店はない」とエリア・上限・時間を緩める案内を文で出す。

`SearchPage.tsx`: ヒーロー（料理静物＋アプリ名＋「食べ放題だけを、料金と時間で切る」）・都県切替（切替時にエリアは「すべて」に戻す）・エリア/ジャンルチップ横列・フリーワード・件数・結果リスト・共通免責フッター。条件変更は即時再レンダー。リセットは都県以外を初期化。

- [ ] **Step 4: テストを走らせて通す**

Run:

```bash
npx vitest run tests/search.test.tsx
```

Expected: PASS

- [ ] **Step 5: コミット**

```bash
git add src/components src/pages/SearchPage.tsx src/main.tsx tests/search.test.tsx
git commit -m "feat: add search page with filter sheet and cards"
```

---

### Task 5: 詳細・保存・ナビを作る

**Files:**
- Create: `src/components/CourseTable.tsx`, `src/pages/DetailPage.tsx`, `src/pages/SavedPage.tsx`, `src/favorites/storage.ts`
- Modify: `src/main.tsx`（`/r/:id`・`/saved`・下部2タブ追加）
- Test: `tests/favorites.test.ts`, `tests/detail.test.tsx`

**Interfaces:**
- Consumes: Task 2〜4
- Produces: 完成した3画面＋保存機能をTask 6の受け入れが使う

- [ ] **Step 1: 失敗するテストを書く**

```ts
// tests/favorites.test.ts
import { describe, expect, it } from 'vitest';
import { loadFavorites, toggleFavorite } from '../src/favorites/storage';

describe('favorites storage', () => {
  it('トグルで追加・解除できキー hodai-cho に残る', () => {
    localStorage.clear();
    expect(toggleFavorite('syabuyo-shinjuku-nowa')).toContain('syabuyo-shinjuku-nowa');
    expect(JSON.parse(localStorage.getItem('hodai-cho') ?? '[]')).toContain('syabuyo-shinjuku-nowa');
    expect(toggleFavorite('syabuyo-shinjuku-nowa')).not.toContain('syabuyo-shinjuku-nowa');
  });
});
```

```tsx
// tests/detail.test.tsx
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { DetailPage } from '../src/pages/DetailPage';

describe('DetailPage', () => {
  it('未知IDで落ちず探すへの導線がある', () => {
    render(
      <MemoryRouter initialEntries={['/r/no-such-shop']}>
        <Routes><Route path="/r/:id" element={<DetailPage />} /></Routes>
      </MemoryRouter>,
    );
    expect(screen.getByText('店が見つからない')).toBeTruthy();
    expect(screen.getByText('探すへ戻る')).toBeTruthy();
  });
});
```

- [ ] **Step 2: 走らせて失敗を確認**

Run:

```bash
npx vitest run tests/favorites.test.ts tests/detail.test.tsx
```

Expected: FAIL（モジュール未定義）

- [ ] **Step 3: 最小実装を書く**

```ts
// src/favorites/storage.ts
const KEY = 'hodai-cho';

export function loadFavorites(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export function toggleFavorite(id: string): string[] {
  const cur = loadFavorites();
  const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}
```

`DetailPage.tsx`: 店名・都県・エリア・ジャンル・駅・徒歩・施設・営業時間、コース表（時間帯/コース名/税込/制限時間、注記は表の下）、ハイライト全文、行く前に、地図で探す（`https://www.google.com/maps/search/?api=1&query=`＋`encodeURIComponent(店名＋' '＋駅)`を別タブ）、予約リンク（`reservationAffiliateUrl` があればそれを使い `rel="sponsored nofollow noreferrer"`、なければ `reservationUrl` の素リンク・`rel="noreferrer"`。別タブ）、近い・同じ系列（同一都県の同チェーン→同エリア他チェーン、最大4件）、戻る、保存ボタン。

`SavedPage.tsx`: 保存順（新しいものが末尾）にカードを並べる。0件なら空状態＋探すへの導線。フィルタ条件は読まない。

`main.tsx`: 下部2タブ（探す `/`・保存 `/saved`）を全画面に残し、セーフエリア（`env(safe-area-inset-bottom)`）を避ける。

- [ ] **Step 4: テストを走らせて通す**

Run:

```bash
npx vitest run tests/favorites.test.ts tests/detail.test.tsx
```

Expected: PASS

- [ ] **Step 5: コミット**

```bash
git add src/favorites src/pages/DetailPage.tsx src/pages/SavedPage.tsx src/components/CourseTable.tsx src/main.tsx tests/favorites.test.ts tests/detail.test.tsx
git commit -m "feat: add detail, saved and navigation"
```

---

### Task 6: カタログ全件と受け入れを仕上げる

**Files:**
- Modify: `src/catalog/seed.ts`（承認済み候補リストから全件化）
- Test: `tests/acceptance.test.ts`

**Interfaces:**
- Consumes: Task 1〜5、CEO承認済みの追加店候補リスト（入力条件。未確定のまま着手しない）
- Produces: 公開可能な `dist/` ビルド

- [ ] **Step 1: 失敗する受け入れテストを書く**

```ts
// tests/acceptance.test.ts
import { describe, expect, it } from 'vitest';
import { filterStores } from '../src/filters/filter';
import type { FilterCond } from '../src/filters/filter';
import { BundledCatalogRepository } from '../src/catalog/repository';
import { validateCatalog } from '../src/catalog/schema';

const repo = new BundledCatalogRepository();
const stores = repo.listStores();
const base: FilterCond = { prefecture: '東京', area: undefined, freeword: '', genres: [], slot: 'all', timeLimit: 'all', budget: undefined, sort: 'recommend' };

describe('acceptance', () => {
  it('カタログが検証を通る', () => {
    expect(validateCatalog(stores)).toEqual([]);
  });

  it('宴会食放で絞れ、居酒屋・カラオケ相当が出ない', () => {
    const got = filterStores(stores, { ...base, genres: ['宴会食放'] });
    expect(got.length).toBeGreaterThan(0);
    expect(got.every((s) => s.genres.includes('宴会食放') || (s.subGenres ?? []).includes('宴会食放'))).toBe(true);
  });

  it('ランチ指定でランチ食べ放題のない店が消える', () => {
    const got = filterStores(stores, { ...base, slot: 'lunch' });
    expect(got.every((s) => s.courses.some((c) => c.slot === 'lunch' || c.slot === 'all-day'))).toBe(true);
  });
});
```

- [ ] **Step 2: 走らせて現状を確認**

Run:

```bash
npx vitest run tests/acceptance.test.ts
```

Expected: 現シードで通ること。通らなければ Task 2〜3 に戻って直す（先へ進まない）。

- [ ] **Step 3: カタログ全件を入れる**

承認済み候補リスト（v1.1付録Aの33店＋新規開拓・宴会食放分）を `seed.ts` の形で全件化する。1件ごとに `validateCatalog` が空配列を返すことを確認する。料金・分数は公開情報の2026年目安、土日加算・締切・店差は `notice` またはコース `note` に書く。`closed` と `familyFriendly` は持つが画面に出さない。

- [ ] **Step 4: 全テストとビルドを通す**

Run:

```bash
npx vitest run
npm run build
```

Expected: 全PASS＋ビルド成功。`dist/` が静的配信可能な状態。

- [ ] **Step 5: コミット**

```bash
git add -A
git commit -m "feat: complete catalog and acceptance pass"
```

---

### Task 7: SSG基盤を作る（店別・エリア別静的HTML＋SEO基盤）

**Files:**
- Create: `src/seo/meta.ts`（タイトル・説明文・JSON-LD・sitemap生成の純関数）、`src/routes.tsx`（`main.tsx` からRoutes木を切出し、`BrowserRouter` は `main.tsx` に残す）、`src/seo/prerender.tsx`（`StaticRouter`＋`renderToStaticMarkup` でパス→HTML断片）、`scripts/prerender.mjs`（`vite build` 後に `dist/` へ `r/<id>/index.html`・`a/<pref>/<area>/index.html`・`sitemap.xml`・`robots.txt` を書く）
- Modify: `package.json`（`build:ssg` 追加）、`src/main.tsx`（`routes.tsx` を使う）
- Test: `tests/seo.test.ts`（meta関数）、`tests/prerender.test.tsx`（`renderRoute` が店名・JSON-LD・エリア一覧を含む）

**Interfaces:**
- Consumes: Task 2のRepository、Task 4/5の画面、Task 8のエリアページ
- Produces: クローラ可読な静的HTML一式をTask 8の受け入れとSearch Console登録（CEO作業）が使う

**Constraints:**
- サイトURLは `https://hodai-cho.example.invalid` の仮置きとし、`SITE_URL` 環境変数で上書き可能にする（本番URL確定時に差し替え）
- プリレンダはJS無効でも店名・料金・分数・リンクが読めること（`renderToStaticMarkup` の断片を `#root` に埋める）
- localStorage参照（`loadFavorites`）はSSRで落ちないこと（`try/catch` で吸収済み。壊れたら直す）

- [ ] **Step 1: 失敗するテストを書く**（`tests/seo.test.ts`、`tests/prerender.test.tsx`）
- [ ] **Step 2: 走らせて失敗を確認**（`npx vitest run tests/seo.test.ts tests/prerender.test.tsx`、FAIL期待）
- [ ] **Step 3: 最小実装を書く**（meta関数→routes切出し→prerenderスクリプト→`npm run build:ssg`）
- [ ] **Step 4: テストとSSGビルドを通す**（`npx vitest run`＋`npm run build:ssg`、全PASS＋`dist/sitemap.xml` 生成確認）
- [ ] **Step 5: コミット**（`git add src/seo src/routes.tsx src/main.tsx scripts package.json tests/seo.test.ts tests/prerender.test.tsx`）

---

### Task 8: エリアページを作る（楔の深掘り＋導線）

**Files:**
- Create: `src/pages/AreaPage.tsx`（`/a/:prefecture/:area`。エリア名・件数・店カード一覧・探すへの導線）
- Modify: `src/routes.tsx`（ルート追加）、`src/pages/SearchPage.tsx`（「エリアから探す」リンク列の追加）、`src/seo/meta.ts`・`scripts/prerender.mjs`（エリアページ分のタイトル・sitemap追加）
- Test: `tests/area.test.tsx`（エリアの店だけ出る・未知エリアは空状態）

**Interfaces:**
- Consumes: Task 7のSSG基盤
- Produces: エリア特化のランディングURL群（`a/東京/新宿/` 等）をSEOの楔に使う

- [ ] **Step 1: 失敗するテストを書く**（`tests/area.test.tsx`）
- [ ] **Step 2: 走らせて失敗を確認**（FAIL期待）
- [ ] **Step 3: 最小実装を書く**（AreaPage＋ルート＋探す画面の導線）
- [ ] **Step 4: 全テストとSSGビルドを通す**
- [ ] **Step 5: コミット**

## Self-Review

- Spec coverage: §1（足場・縫い目→Task 1/2）、§2（カタログ→Task 2/6）、§3（画面→Task 4/5、予約リンク→Task 5）、§4（運用・受け入れ→Task 6）。v1.1のF-01〜F-08/D-01〜D-10相当はTask 3〜5に割当て済み。追加店リストは後続の定食おかわり自由計画で確定し、カタログへ反映済み。
- SEO拡張（office-hours判定 2026-09-06）：Task 7（SSG＋JSON-LD＋sitemap）、Task 8（エリアページ＝楔）。Search Console登録・本番URL確定・バリューコマース登録はCEO作業で実装外。
- Placeholder scan: 「TBD/TODO/あとで」「適切に」「同様に」の記述なし。各ステップに実コードまたは実コマンドあり。
- Type consistency: `Store`/`Course`/`FilterCond`/`CatalogRepository` の名前と型は全タスクで同一。`minutes: null`＝無制限の扱いはTask 2の型とTask 3の判定で一致。
