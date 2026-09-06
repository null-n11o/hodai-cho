// SSG prerender: `npm run build` の後に実行し、dist/ へ店別・エリア別HTML（日英）＋sitemap＋robotsを書く。
// 使い方: npm run build:ssg（SITE_URL 環境変数で本番URLを上書き可能）
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');
const base = (process.env.SITE_URL ?? 'https://hodai-cho.example.invalid').replace(/\/$/, '');
const today = '2026-09-06';

const enPathOf = (jaPath) => (jaPath === '/' ? '/en/' : `/en${jaPath}`);

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

  const buildPage = ({ path, lang, title, description, jsonLd, jaPath, enPath }) => {
    const body = renderRoute(path);
    let html = template.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`);
    html = html.replace('<html lang="ja">', `<html lang="${lang}">`);
    const headExtra = `    <meta name="description" content="${escapeHtml(description)}" />\n    <link rel="canonical" href="${base}${path}" />\n    ${meta.hreflangHead(jaPath, enPath, base)}${
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

  const writePair = (jaPath, jaPage, enPage) => {
    const enPath = enPathOf(jaPath);
    writePage(jaPath, { ...jaPage, path: jaPath, lang: 'ja', jaPath, enPath });
    writePage(enPath, { ...enPage, path: enPath, lang: 'en', jaPath, enPath });
  };

  writePair(
    '/',
    {
      title: '放題帖｜東京・神奈川の食べ放題だけを、料金と時間で切る',
      description:
        '東京・神奈川の食べ放題だけを料金と制限時間で切る条件帳。焼肉・しゃぶしゃぶ・寿司・スイーツ・ピザ・串揚げ・宴会・パン・お好み焼き・サラダバーから探せます。',
    },
    {
      title: meta.topTitleEn(),
      description: meta.topDescriptionEn(),
    },
  );

  for (const store of stores) {
    const jaPath = `/r/${store.id}/`;
    writePair(
      jaPath,
      {
        title: meta.storeTitle(store),
        description: meta.storeDescription(store),
        jsonLd: meta.storeJsonLd(store, base, jaPath),
      },
      {
        title: meta.storeTitleEn(store),
        description: meta.storeDescriptionEn(store),
        jsonLd: meta.storeJsonLd(store, base, enPathOf(jaPath)),
      },
    );
  }

  for (const { prefecture, area } of areas) {
    const jaPath = meta.areaPath(prefecture, area);
    const inArea = stores.filter((s) => s.prefecture === prefecture && s.area === area);
    writePair(
      jaPath,
      {
        title: meta.areaTitle(prefecture, area, inArea.length),
        description: meta.areaDescription(prefecture, area, inArea.length),
      },
      {
        title: meta.areaTitleEn(prefecture, area, inArea.length),
        description: meta.areaDescriptionEn(prefecture, area, inArea.length),
      },
    );
  }

  const entries = meta.sitemapEntries(stores, areas, base, today);
  writeFileSync(join(dist, 'sitemap.xml'), meta.sitemapXml(entries));
  writeFileSync(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`);

  console.log(`prerendered ${stores.length} stores x2 langs + ${areas.length} areas x2 langs + top x2 + sitemap (${entries.length} urls)`);
} finally {
  await server.close();
}
