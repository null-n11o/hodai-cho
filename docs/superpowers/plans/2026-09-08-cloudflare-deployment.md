# タベホー Cloudflare配信基盤 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 現在の静的SSGアプリをCloudflare Workers Static Assetsへ配信できる設定にし、将来のWorker API・D1追加の境界を壊さずに固定する。

**Architecture:** `npm run build:ssg`で`dist/`を生成し、Cloudflare Workers Static Assetsの`tabeho`サービスが静的ページとSPAフォールバックを配信する。初期実装ではDBや動的APIを追加せず、カタログはGit管理下のソースを正本とする。

**Tech Stack:** Vite + React + TypeScript + Cloudflare Workers Static Assets + Wrangler + Vitest

**Spec:** `docs/superpowers/specs/2026-09-08-cloudflare-architecture-design.md`

## Global Constraints

- カタログの正本は人手精査済みのGit管理下データとし、未精査店やダミー店を追加しない。
- 現在はD1、R2、KV、Queues、認証、管理画面を導入しない。
- 画面は`CatalogRepository`抽象に依存し、Cloudflare固有の実装を画面へ持ち込まない。
- `npm run build:ssg`が生成する店別・エリア別・日英HTML、sitemap、robotsを公開物に含める。
- Cloudflareサービス名は`tabeho`とする。
- `/api/*`は将来のWorker API用に予約するが、今回の公開基盤実装では動的APIを追加しない。
- Productionの公開・DNS切替・本番デプロイは明示依頼があるまで実行しない。
- 実装はTDDで進め、タスクごとに狭い検証、最後に`npm test`、`npm run lint`、`npm run build`、`npm run build:ssg`を実行する。

---

### Task 1: Workers Static Assets設定を追加する

**Files:**
- Create: `wrangler.jsonc`
- Modify: `package.json`
- Modify: `package-lock.json`
- Test: `tests/cloudflare-config.test.ts`

**Interfaces:**
- Consumes: 既存の`npm run build:ssg`と`dist/`
- Produces: `tabeho`サービスが`dist/`を静的アセットとして扱う設定、`npm run cf:dev`、`npm run cf:deploy`のCLI入口

- [ ] **Step 1: 設定契約の失敗テストを書く**

```ts
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

type WranglerConfig = {
  name: string;
  assets: { directory: string; not_found_handling: string };
};

describe('Cloudflare Workers configuration', () => {
  it('publishes the SSG output and keeps SPA fallback for unknown routes', () => {
    const file = readFileSync(resolve(process.cwd(), 'wrangler.jsonc'), 'utf8');
    const config = JSON.parse(file) as WranglerConfig;

    expect(config.name).toBe('tabeho');
    expect(config.assets).toEqual({
      directory: './dist',
      not_found_handling: 'single-page-application',
    });
  });
});
```

- [ ] **Step 2: 失敗を確認する**

Run: `npx vitest run tests/cloudflare-config.test.ts`

Expected: FAIL because `wrangler.jsonc` does not exist yet.

- [ ] **Step 3: 最小設定とCLIスクリプトを追加する**

```bash
npm install -D wrangler
```

Create `wrangler.jsonc`:

```json
{
  "$schema": "./node_modules/wrangler/config-schema.json",
  "name": "tabeho",
  "compatibility_date": "2026-09-08",
  "assets": {
    "directory": "./dist",
    "not_found_handling": "single-page-application"
  }
}
```

Add to `package.json`:

```json
{
  "scripts": {
    "cf:dev": "npm run build:ssg && wrangler dev",
    "cf:deploy": "npm run build:ssg && wrangler deploy"
  }
}
```

Keep `npm run build:ssg` as the source of the `dist/` artifact. Do not add a D1 binding or Worker API file in this task.

- [ ] **Step 4: 設定とdry-runを検証する**

```bash
npx vitest run tests/cloudflare-config.test.ts
npm run build:ssg
npx wrangler deploy --dry-run
```

Expected: the config test passes, `dist/` contains the existing SSG output, and Wrangler produces a dry-run deployment without changing DNS or production resources.

- [ ] **Step 5: コミットする**

```bash
git add wrangler.jsonc package.json package-lock.json tests/cloudflare-config.test.ts
git commit -m "feat: add tabeho cloudflare static assets config"
```

### Task 2: Cloudflare用生成物チェックと運用手順を追加する

**Files:**
- Modify: `README.md`
- Create: `scripts/verify-cloudflare-build.mjs`
- Modify: `package.json`
- Test: `tests/cloudflare-build.test.ts`

**Interfaces:**
- Consumes: Task 1の`wrangler.jsonc`、既存の`dist/`、`SITE_URL`環境変数
- Produces: ローカル検証可能なCloudflare用ビルドチェックと、Productionを変更しない運用手順

- [ ] **Step 1: 生成物チェックの失敗テストを書く**

```ts
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('Cloudflare build output', () => {
  it('contains the public entry points after build:ssg', () => {
    expect(existsSync(resolve(process.cwd(), 'dist/index.html'))).toBe(true);
    expect(existsSync(resolve(process.cwd(), 'dist/en/index.html'))).toBe(true);
    expect(existsSync(resolve(process.cwd(), 'dist/sitemap.xml'))).toBe(true);
    expect(existsSync(resolve(process.cwd(), 'dist/robots.txt'))).toBe(true);
  });
});
```

- [ ] **Step 2: 生成物がない状態で失敗することを確認する**

Run: `rm -rf dist && npx vitest run tests/cloudflare-build.test.ts`

Expected: FAIL because the generated output has not been created. `dist/` is generated output only; do not remove source files.

- [ ] **Step 3: 検証スクリプトとREADME手順を追加する**

Create `scripts/verify-cloudflare-build.mjs` that checks the four entry files above, reads `dist/sitemap.xml`, fails when `SITE_URL` is set but the generated sitemap still contains `hodai-cho.example.invalid`, prints checked paths, and exits with code 1 naming a missing artifact.

Add these scripts:

```json
{
  "scripts": {
    "verify:cloudflare": "node scripts/verify-cloudflare-build.mjs",
    "build:cloudflare": "npm run build:ssg && npm run verify:cloudflare"
  }
}
```

Update `README.md` with the `tabeho` service name, `SITE_URL=https://<本番ドメイン> npm run build:cloudflare`, `npm run cf:dev`, `npx wrangler deploy --dry-run`, and the explicitly approved `npm run cf:deploy` release command. State that custom-domain attachment is a Cloudflare dashboard operation and that credentials, account IDs, database IDs, and secrets must not be committed.

- [ ] **Step 4: 生成物とローカル検証を通す**

```bash
npm run build:cloudflare
npx vitest run tests/cloudflare-build.test.ts
npm run cf:dev
```

While `cf:dev` runs, verify `/`, `/en/`, one generated `/r/<id>/`, one generated `/a/<prefecture>/<area>/`, and `/r/no-such-shop`. Generated pages must include static HTML, and the unknown ID must reach the existing React empty state.

- [ ] **Step 5: 全体検証とコミットする**

```bash
npm test
npm run lint
npm run build
npm run build:ssg
npm run verify:cloudflare
git add README.md scripts/verify-cloudflare-build.mjs package.json tests/cloudflare-build.test.ts
git commit -m "docs: add tabeho cloudflare deployment workflow"
```

### Task 3: 引き渡し前レビュー

**Files:**
- Review: `docs/superpowers/specs/2026-09-08-cloudflare-architecture-design.md`
- Review: `docs/superpowers/plans/2026-09-08-cloudflare-deployment.md`
- Review: `wrangler.jsonc`
- Review: `README.md`

**Interfaces:**
- Consumes: Task 1〜2の設定、テスト、ドキュメント
- Produces: 本番デプロイを実行せずに、Cloudflare配信の引き渡し判断ができるレビュー結果

- [ ] **Step 1: 既存制約との差分を確認する**

Confirm there is no D1 dependency, `CatalogRepository` is preserved, `SITE_URL` is build-time only, and no credentials or production identifiers are committed.

- [ ] **Step 2: 全検証を確認する**

Require `npm test`, `npm run lint`, `npm run build`, `npm run build:ssg`, and `npm run verify:cloudflare` to pass before requesting a release PR.

- [ ] **Step 3: PRを作成して引き渡す**

Use the repository review and ship workflow to create a PR from the work branch. Do not merge, attach the production domain, or deploy production without explicit user approval.
