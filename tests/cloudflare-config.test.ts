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
