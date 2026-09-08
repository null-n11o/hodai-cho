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

- [x] **Step 1: 設定契約の失敗テストを書く**

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

- [x] **Step 2: 失敗を確認する**

Run: `npx vitest run tests/cloudflare-config.test.ts`

Expected: FAIL because `wrangler.jsonc` does not exist yet.

- [x] **Step 3: 最小設定とCLIスクリプトを追加する**

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

- [x] **Step 4: 設定とdry-runを検証する**

```bash
npx vitest run tests/cloudflare-config.test.ts
npm run build:ssg
npx wrangler deploy --dry-run
```

Expected: the config test passes, `dist/` contains the existing SSG output, and Wrangler produces a dry-run deployment without changing DNS or production resources.

- [x] **Step 5: コミットする**

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

- [x] **Step 1: 生成物チェックの失敗テストを書く**

```ts
import { existsSync, mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('Cloudflare build output', () => {
  it('accepts the required public entry points', () => {
    const fixture = mkdtempSync(join(tmpdir(), 'tabeho-cloudflare-'));
    mkdirSync(join(fixture, 'en'), { recursive: true });
    writeFileSync(join(fixture, 'index.html'), '<html lang="ja"></html>');
    writeFileSync(join(fixture, 'en/index.html'), '<html lang="en"></html>');
    writeFileSync(join(fixture, 'sitemap.xml'), '<urlset />');
    writeFileSync(join(fixture, 'robots.txt'), 'User-agent: *');

    const output = execFileSync(process.execPath, [resolve(process.cwd(), 'scripts/verify-cloudflare-build.mjs')], {
      env: { ...process.env, TABEHO_DIST_DIR: fixture, SITE_URL: 'https://tabeho.example.com' },
      encoding: 'utf8',
    });

    expect(output).toContain('Cloudflare build verified');
    expect(existsSync(join(fixture, 'sitemap.xml'))).toBe(true);
  });

  it('fails when a required entry point is missing', () => {
    const fixture = mkdtempSync(join(tmpdir(), 'tabeho-cloudflare-'));
    writeFileSync(join(fixture, 'sitemap.xml'), '<urlset />');

    expect(() =>
      execFileSync(process.execPath, [resolve(process.cwd(), 'scripts/verify-cloudflare-build.mjs')], {
        env: { ...process.env, TABEHO_DIST_DIR: fixture },
        encoding: 'utf8',
        stdio: 'pipe',
      }),
    ).toThrow(/missing/);
  });
});
```

- [x] **Step 2: 生成物がない状態で失敗することを確認する**

Temporarily move the generated directory aside, run the test, and restore it without deleting source files:

```bash
mv dist .tabeho-dist-backup
set +e
npx vitest run tests/cloudflare-build.test.ts
result=$?
set -e
mv .tabeho-dist-backup dist
exit $result
```

Expected: FAIL because the generated output has not been created. The committed test uses a temporary fixture for repeatable pass/fail checks; `npm run verify:cloudflare` checks the real `dist/` directory.

- [x] **Step 3: 検証スクリプトとREADME手順を追加する**

Create `scripts/verify-cloudflare-build.mjs` that checks the four entry files above, reads `dist/sitemap.xml`, fails when `SITE_URL` is set but the generated sitemap still contains `hodai-cho.example.invalid`, prints checked paths, and exits with code 1 naming a missing artifact. Support `TABEHO_DIST_DIR` as a test-only override for the checked directory.

Add these scripts:

```json
{
  "scripts": {
    "verify:cloudflare": "node scripts/verify-cloudflare-build.mjs",
    "build:cloudflare": "npm run build:ssg && npm run verify:cloudflare"
  }
}
```

Update `README.md` with the `tabeho` service name, `SITE_URL=https://<本番ドメイン> npm run build:cloudflare`, `npm run cf:dev`, `npx wrangler deploy --dry-run`, and the explicitly approved `SITE_URL=https://<本番ドメイン> npm run cf:deploy` release command. Make `cf:deploy` fail when `SITE_URL` is absent so the placeholder URL cannot reach Production. State that custom-domain attachment is a Cloudflare dashboard operation and that credentials, account IDs, database IDs, and secrets must not be committed.

- [x] **Step 4: 生成物とローカル検証を通す**

```bash
npm run build:cloudflare
npx vitest run tests/cloudflare-build.test.ts
npm run cf:dev
```

While `cf:dev` runs, verify `/`, `/en/`, `/r/syabuyo-tachikawa/`, `/a/神奈川/溝の口/`, and `/r/no-such-shop`. The generated detail and area pages returned 200 with their prerendered markers; the unknown ID returned the SPA shell with 200 for the existing React empty state.

- [x] **Step 5: 全体検証とコミットする**

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
