import type { Genre, Store } from '../catalog/schema';
import { AREA_EN, STATION_EN } from '../catalog/en-names';
import { en } from '../i18n/en';

export const SITE_URL = 'https://tabeho.example.invalid';

export function topTitle(): string {
  return '今日は好きなだけ食べよう。｜タベホー';
}

export function topDescription(): string {
  return '東京・神奈川の食べ放題を、料金・制限時間・最寄り駅などの条件で探せるグルメ情報サイトです。';
}

export function searchTitle(): string {
  return '東京・神奈川の食べ放題を料金と時間で探す｜タベホー';
}

export function searchDescription(): string {
  return '東京・神奈川の食べ放題だけを料金と制限時間で切る条件帳。焼肉・しゃぶしゃぶ・寿司・スイーツ・ピザ・串揚げ・宴会・パン・お好み焼き・サラダバーから探せます。';
}

export interface AreaKey {
  prefecture: string;
  area: string;
}

export interface AreaGenreKey {
  prefecture: string;
  area: string;
  genre: Genre;
}

export function cheapestPrice(store: Store): number {
  return Math.min(...store.courses.map((c) => c.priceInclTax));
}

export function storeTitle(store: Store): string {
  return `${store.name}｜${store.area}の食べ放題・料金と時間｜タベホー`;
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
  const isEn = !!pagePath && (pagePath === '/en/' || pagePath.startsWith('/en/'));
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: isEn ? store.nameEn : store.name,
    servesCuisine: isEn ? store.genres.map((g) => en.genres[g]) : store.genres,
    priceRange: `¥${price}〜`,
    address: {
      '@type': 'PostalAddress',
      addressRegion: isEn ? prefectureEn(store.prefecture) : store.prefecture,
      addressLocality: isEn ? (AREA_EN[store.area] ?? store.area) : store.area,
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
  return `${area}の食べ放題${count}件｜料金と時間で切る｜タベホー`;
}

export function areaDescription(prefecture: string, area: string, count: number): string {
  return `${prefecture}・${area}の食べ放題${count}件を料金と制限時間で整理。${area}駅周辺で食べ放題を探すならタベホー。行く前に公式の最新情報を確認してください。`;
}

export function listAreaGenres(stores: Store[]): AreaGenreKey[] {
  const map = new Map<string, AreaGenreKey>();
  for (const s of stores) {
    const allGenres = [...s.genres, ...(s.subGenres ?? [])];
    for (const g of allGenres) {
      const key = `${s.prefecture}/${s.area}/${g}`;
      if (!map.has(key)) {
        map.set(key, { prefecture: s.prefecture, area: s.area, genre: g });
      }
    }
  }
  return [...map.values()].sort((a, b) =>
    `${a.prefecture}${a.area}${a.genre}`.localeCompare(`${b.prefecture}${b.area}${b.genre}`, 'ja'),
  );
}

export function areaGenrePath(prefecture: string, area: string, genre: string): string {
  return `/a/${encodeURIComponent(prefecture)}/${encodeURIComponent(area)}/${encodeURIComponent(genre)}/`;
}

export function areaGenrePageUrl(prefecture: string, area: string, genre: string, base: string = SITE_URL): string {
  return `${base}${areaGenrePath(prefecture, area, genre)}`;
}

export function areaGenreTitle(_prefecture: string, area: string, genre: string, count: number): string {
  return `${area}の${genre}食べ放題${count}件｜料金と時間で切る｜タベホー`;
}

export function areaGenreDescription(prefecture: string, area: string, genre: string, count: number): string {
  return `${prefecture}・${area}の${genre}食べ放題${count}件を料金と制限時間で整理。${area}駅周辺で${genre}食べ放題を探すならタベホー。行く前に公式の最新情報を確認してください。`;
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
  return 'Today, eat to your heart’s content.｜Tabeho';
}

export function topDescriptionEn(): string {
  return 'Find all-you-can-eat restaurants in Tokyo and Kanagawa by price, time limit, nearest station, and more.';
}

export function searchTitleEn(): string {
  return 'Tabeho｜All-you-can-eat in Tokyo & Kanagawa by price and time';
}

export function searchDescriptionEn(): string {
  return 'All-you-can-eat shops in Tokyo and Kanagawa, filtered by price and time limit. Yakiniku, shabu-shabu, sushi, sweets, pizza, party buffets and more.';
}

export function contactTitle(): string {
  return '情報提供・修正依頼｜みんなで更新する食べ放題の条件帳｜タベホー';
}

export function contactDescription(): string {
  return 'タベホーの掲載内容の修正依頼や、新しい食べ放題店の情報提供はこちら。公式ページや訪問情報を添えて、運営に知らせてください。';
}

export function contactTitleEn(): string {
  return 'Contribute a correction or shop tip｜Tabeho';
}

export function contactDescriptionEn(): string {
  return 'Suggest a correction, a new all-you-can-eat shop, or an ended offer for Tabeho. Share an official source or firsthand details with the team.';
}

export function storeTitleEn(store: Store): string {
  return `${store.nameEn}｜All-you-can-eat in ${AREA_EN[store.area] ?? store.area}: prices & time｜Tabeho`;
}

export function storeDescriptionEn(store: Store): string {
  const price = cheapestPrice(store).toLocaleString('en-US');
  return `${prefectureEn(store.prefecture)} · ${AREA_EN[store.area] ?? store.area}, “${store.nameEn}”: all-you-can-eat courses with prices and time limits. ¥${price}〜. ${STATION_EN[store.station] ?? store.station} Sta., ${store.walkMinutes}-min walk. Check the official source before you go.`;
}

export function areaTitleEn(_prefecture: string, area: string, count: number): string {
  return `All-you-can-eat in ${AREA_EN[area] ?? area}: ${count} places by price and time｜Tabeho`;
}

export function areaDescriptionEn(prefecture: string, area: string, count: number): string {
  return `${prefectureEn(prefecture)} · ${AREA_EN[area] ?? area}: ${count} all-you-can-eat places with prices and time limits. Check the official source before you go.`;
}

export function areaGenreTitleEn(_prefecture: string, area: string, genre: string, count: number): string {
  const g = en.genres[genre as Genre] ?? genre;
  const a = AREA_EN[area] ?? area;
  return `All-you-can-eat ${g} in ${a}: ${count} places by price and time｜Tabeho`;
}

export function areaGenreDescriptionEn(prefecture: string, area: string, genre: string, count: number): string {
  const p = prefectureEn(prefecture);
  const a = AREA_EN[area] ?? area;
  const g = (en.genres[genre as Genre] ?? genre).toLowerCase();
  return `${p} · ${a}: ${count} all-you-can-eat ${g} places with prices and time limits. Check the official source before you go.`;
}

export function areaGenreJsonLd(
  prefecture: string,
  area: string,
  genre: string,
  base: string = SITE_URL,
  pagePath?: string,
): Record<string, unknown> {
  const isEn = !!pagePath && (pagePath === '/en/' || pagePath.startsWith('/en/'));
  const homeUrl = isEn ? `${base}/en/` : `${base}/`;
  const areaUrl = isEn ? `${base}/en${areaPath(prefecture, area)}` : `${base}${areaPath(prefecture, area)}`;
  const currentUrl = pagePath ? `${base}${pagePath}` : `${base}${areaGenrePath(prefecture, area, genre)}`;

  const a = isEn ? (AREA_EN[area] ?? area) : area;
  const g = isEn ? (en.genres[genre as Genre] ?? genre) : genre;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: isEn ? 'Tabeho' : 'タベホー',
        item: homeUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: isEn ? `${a}` : `${area}の食べ放題`,
        item: areaUrl,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: isEn ? `${g} in ${a}` : `${area}の${genre}食べ放題`,
        item: currentUrl,
      },
    ],
  };
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

export function sitemapEntries(
  stores: Store[],
  areas: AreaKey[],
  base: string,
  today: string,
  areaGenres?: AreaGenreKey[],
): SitemapEntry[] {
  const entries: SitemapEntry[] = [
    { loc: `${base}/`, lastmod: today },
    { loc: `${base}/en/`, lastmod: today },
    { loc: `${base}/search/`, lastmod: today },
    { loc: `${base}/en/search/`, lastmod: today },
    { loc: `${base}/contact/`, lastmod: today },
    { loc: `${base}/en/contact/`, lastmod: today },
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
  if (areaGenres) {
    for (const ag of areaGenres) {
      const path = areaGenrePath(ag.prefecture, ag.area, ag.genre);
      entries.push({ loc: `${base}${path}`, lastmod: today });
      entries.push({ loc: `${base}/en${path}`, lastmod: today });
    }
  }
  return entries;
}
