// SSG prerender: `npm run build` の後に実行し、dist/ へ店別・エリア別HTML＋sitemap＋robotsを書く。
// 使い方: npm run build:ssg（SITE_URL 環境変数で本番URLを上書き可能）
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');
const base = (process.env.SITE_URL ?? 'https://hodai-cho.example.invalid').replace(/\/$/, '');
const today = '2026-09-06';

const server = await createServer({ root, server: { middlewareMode: true }, appType: 'custom', logLevel: 'silent' });
try {
  const { renderRoute } = await server.ssrLoadModule('/src/seo/prerender.tsx');
  const { BundledCatalogRepository } = await server.ssrLoadModule('/src/catalog/repository.ts');
  const meta = await server.ssrLoadModule('/src/seo/meta.ts');

  const repo = new BundledCatalogRepository();
  const stores = repo.listStores();
  const areas = meta.listAreas(stores);

  const template = readFileSync(join(dist, 'index.html'), 'utf8');

  const escapeHtml = (s) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const buildPage = ({ path, title, description, jsonLd }) => {
    const body = renderRoute(path);
    let html = template.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`);
    const headExtra = `    <meta name="description" content="${escapeHtml(description)}" />\n    <link rel="canonical" href="${base}${path}" />${
      jsonLd ? `\n    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ''
    }`;
    html = html.replace('</title>', `</title>\n${headExtra}`);
    html = html.replace('<div id="root"></div>', `<div id="root">${body}</div>`);
    return html;
  };

  const writePage = (path, page) => {
    const file = join(dist, decodeURIComponent(path), 'index.html');
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, buildPage(page));
  };

  const entries = [{ loc: `${base}/`, lastmod: today }];

  writePage('/', {
    path: '/',
    title: '放題帖｜東京・神奈川の食べ放題だけを、料金と時間で切る',
    description:
      '東京・神奈川の食べ放題だけを料金と制限時間で切る条件帳。焼肉・しゃぶしゃぶ・寿司・スイーツ・ピザ・串揚げ・宴会・パン・お好み焼き・サラダバーから探せます。',
  });

  for (const store of stores) {
    const path = `/r/${store.id}/`;
    writePage(path, {
      path,
      title: meta.storeTitle(store),
      description: meta.storeDescription(store),
      jsonLd: meta.storeJsonLd(store, base),
    });
    entries.push({ loc: `${base}${path}`, lastmod: today });
  }

  for (const { prefecture, area } of areas) {
    const path = meta.areaPath(prefecture, area);
    const inArea = stores.filter((s) => s.prefecture === prefecture && s.area === area);
    writePage(path, {
      path,
      title: meta.areaTitle(prefecture, area, inArea.length),
      description: meta.areaDescription(prefecture, area, inArea.length),
    });
    entries.push({ loc: `${base}${path}`, lastmod: today });
  }

  writeFileSync(join(dist, 'sitemap.xml'), meta.sitemapXml(entries));
  writeFileSync(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`);

  console.log(`prerendered ${stores.length} stores + ${areas.length} areas + sitemap (${entries.length} urls)`);
} finally {
  await server.close();
}
