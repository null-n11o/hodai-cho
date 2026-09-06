import type { Store } from '../catalog/schema';

export const SITE_URL = 'https://hodai-cho.example.invalid';

export interface AreaKey {
  prefecture: string;
  area: string;
}

export function cheapestPrice(store: Store): number {
  return Math.min(...store.courses.map((c) => c.priceInclTax));
}

export function storeTitle(store: Store): string {
  return `${store.name}｜${store.area}の食べ放題・料金と時間｜放題帖`;
}

export function storeDescription(store: Store): string {
  const price = cheapestPrice(store).toLocaleString('ja-JP');
  return `${store.prefecture}・${store.area}「${store.name}」の食べ放題コースを料金と制限時間で整理。最安¥${price}〜。${store.station}駅徒歩${store.walkMinutes}分。行く前に公式の最新情報を確認してください。`;
}

export function storePageUrl(store: Store, base: string = SITE_URL): string {
  return `${base}/r/${store.id}/`;
}

export function storeJsonLd(store: Store, base: string = SITE_URL): Record<string, unknown> {
  const price = cheapestPrice(store).toLocaleString('ja-JP');
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: store.name,
    servesCuisine: store.genres,
    priceRange: `¥${price}〜`,
    address: {
      '@type': 'PostalAddress',
      addressRegion: store.prefecture,
      addressLocality: store.area,
    },
    url: store.officialUrl ?? storePageUrl(store, base),
    identifier: storePageUrl(store, base),
  };
}

export function listAreas(stores: Store[]): AreaKey[] {
  const map = new Map<string, AreaKey>();
  for (const s of stores) {
    const key = `${s.prefecture}/${s.area}`;
    if (!map.has(key)) map.set(key, { prefecture: s.prefecture, area: s.area });
  }
  return [...map.values()].sort((a, b) =>
    `${a.prefecture}${a.area}`.localeCompare(`${b.prefecture}${b.area}`, 'ja'),
  );
}

export function areaPath(prefecture: string, area: string): string {
  return `/a/${encodeURIComponent(prefecture)}/${encodeURIComponent(area)}/`;
}

export function areaPageUrl(prefecture: string, area: string, base: string = SITE_URL): string {
  return `${base}${areaPath(prefecture, area)}`;
}

export function areaTitle(_prefecture: string, area: string, count: number): string {
  return `${area}の食べ放題${count}件｜料金と時間で切る｜放題帖`;
}

export function areaDescription(prefecture: string, area: string, count: number): string {
  return `${prefecture}・${area}の食べ放題${count}件を料金と制限時間で整理。${area}駅周辺で食べ放題を探すなら放題帖。行く前に公式の最新情報を確認してください。`;
}

export interface SitemapEntry {
  loc: string;
  lastmod?: string;
}

export function sitemapXml(entries: SitemapEntry[]): string {
  const urls = entries
    .map((e) => `  <url><loc>${e.loc}</loc>${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ''}</url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}
