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

export function storeJsonLd(store: Store, base: string = SITE_URL, pagePath?: string): Record<string, unknown> {
  const price = cheapestPrice(store).toLocaleString('ja-JP');
  const page = pagePath ? `${base}${pagePath}` : storePageUrl(store, base);
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
    url: store.officialUrl ?? page,
    identifier: page,
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

// --- English (UI文言のみ英訳。店名・料金数値・分数値はカタログのまま) ---

function prefectureEn(prefecture: string): string {
  if (prefecture === '東京') return 'Tokyo';
  if (prefecture === '神奈川') return 'Kanagawa';
  return prefecture;
}

export function topTitleEn(): string {
  return 'Hodai-cho｜All-you-can-eat in Tokyo & Kanagawa by price and time';
}

export function topDescriptionEn(): string {
  return 'All-you-can-eat shops in Tokyo and Kanagawa, filtered by price and time limit. Yakiniku, shabu-shabu, sushi, sweets, pizza, party buffets and more.';
}

export function storeTitleEn(store: Store): string {
  return `${store.name}｜All-you-can-eat in ${store.area}: prices & time｜Hodai-cho`;
}

export function storeDescriptionEn(store: Store): string {
  const price = cheapestPrice(store).toLocaleString('en-US');
  return `${prefectureEn(store.prefecture)} · ${store.area}, “${store.name}”: all-you-can-eat courses with prices and time limits. ¥${price}〜. ${store.station} Sta., ${store.walkMinutes}-min walk. Check the official source before you go.`;
}

export function areaTitleEn(_prefecture: string, area: string, count: number): string {
  return `All-you-can-eat in ${area}: ${count} places by price and time｜Hodai-cho`;
}

export function areaDescriptionEn(prefecture: string, area: string, count: number): string {
  return `${prefectureEn(prefecture)} · ${area}: ${count} all-you-can-eat places with prices and time limits. Check the official source before you go.`;
}

export function hreflangHead(jaPath: string, enPath: string, base: string = SITE_URL): string {
  const j = `${base}${jaPath}`;
  const e = `${base}${enPath}`;
  return [
    `<link rel="alternate" hreflang="ja" href="${j}" />`,
    `<link rel="alternate" hreflang="en" href="${e}" />`,
    `<link rel="alternate" hreflang="x-default" href="${j}" />`,
  ].join('\n    ');
}

export function sitemapEntries(stores: Store[], areas: AreaKey[], base: string, today: string): SitemapEntry[] {
  const entries: SitemapEntry[] = [
    { loc: `${base}/`, lastmod: today },
    { loc: `${base}/en/`, lastmod: today },
  ];
  for (const store of stores) {
    entries.push({ loc: `${base}/r/${store.id}/`, lastmod: today });
    entries.push({ loc: `${base}/en/r/${store.id}/`, lastmod: today });
  }
  for (const a of areas) {
    const path = areaPath(a.prefecture, a.area);
    entries.push({ loc: `${base}${path}`, lastmod: today });
    entries.push({ loc: `${base}/en${path}`, lastmod: today });
  }
  return entries;
}
