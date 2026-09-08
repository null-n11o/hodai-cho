import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = resolve(process.env.TABEHO_DIST_DIR ?? join(root, 'dist'));
const required = ['index.html', 'en/index.html', 'sitemap.xml', 'robots.txt'];

if (process.argv.includes('--require-site-url') && !process.env.SITE_URL) {
  console.error('SITE_URL is required for a Cloudflare deployment');
  process.exit(1);
}

const missing = required.filter((relativePath) => !existsSync(join(dist, relativePath)));

if (missing.length > 0) {
  console.error(`Cloudflare build is missing: ${missing.join(', ')}`);
  process.exit(1);
}

const sitemap = readFileSync(join(dist, 'sitemap.xml'), 'utf8');
if (process.env.SITE_URL && sitemap.includes('hodai-cho.example.invalid')) {
  console.error('Cloudflare build still contains the placeholder SITE_URL in sitemap.xml');
  process.exit(1);
}

console.log(`Cloudflare build verified: ${dist}`);
for (const relativePath of required) {
  console.log(`- ${relativePath}`);
}
