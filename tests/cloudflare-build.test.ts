import { existsSync, mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
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
