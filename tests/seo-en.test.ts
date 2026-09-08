import { describe, expect, it } from 'vitest';
import { BundledCatalogRepository } from '../src/catalog/repository';
import { AREA_EN, STATION_EN } from '../src/catalog/en-names';
import { renderRoute } from '../src/seo/prerender';
import {
  areaDescriptionEn,
  areaTitleEn,
  contactDescriptionEn,
  contactTitleEn,
  hreflangHead,
  listAreas,
  sitemapEntries,
  sitemapXml,
  storeDescriptionEn,
  storeJsonLd,
  storeTitleEn,
  topDescriptionEn,
  topTitleEn,
} from '../src/seo/meta';

const repo = new BundledCatalogRepository();
const stores = repo.listStores();
const areas = listAreas(stores);
const first = stores[0];
const base = 'https://example.invalid';

describe('english meta', () => {
  it('英語の店タイトルに英語店名とブランドが入る', () => {
    const t = storeTitleEn(first);
    expect(t).toContain(first.nameEn);
    expect(t).toContain(AREA_EN[first.area]);
    expect(t).toContain('Tabeho');
  });

  it('英語の店説明文に料金と駅と公式確認が入る', () => {
    const d = storeDescriptionEn(first);
    expect(d).toContain(STATION_EN[first.station]);
    expect(d).toMatch(/¥[\d,]+〜/);
    expect(d).toMatch(/official/i);
  });

  it('英語のエリアタイトルと説明文に英語エリア名と件数が入る', () => {
    expect(areaTitleEn('東京', '新宿', 5)).toContain('Shinjuku');
    expect(areaTitleEn('東京', '新宿', 5)).toContain('5');
    expect(areaDescriptionEn('東京', '新宿', 5)).toContain('Shinjuku');
  });

  it('英語トップのタイトルと説明文がある', () => {
    expect(topTitleEn()).toContain('Tabeho');
    expect(topDescriptionEn()).toBeTruthy();
  });

  it('英語の問い合わせページのタイトルと説明文がある', () => {
    expect(contactTitleEn()).toContain('Contribute');
    expect(contactDescriptionEn()).toContain('Suggest');
  });

  it('JSON-LDのidentifierに英語パスを渡せる', () => {
    const ld = storeJsonLd(first, base, `/en/r/${first.id}/`);
    expect(String(ld.identifier)).toContain(`/en/r/${first.id}/`);
  });

  it('英語ページのJSON-LD名は英語店名になる', () => {
    const ld = storeJsonLd(first, base, `/en/r/${first.id}/`);
    expect(ld.name).toBe(first.nameEn);
    const ja = storeJsonLd(first, base, `/r/${first.id}/`);
    expect(ja.name).toBe(first.name);
  });
});

describe('hreflang', () => {
  it('日英とx-defaultの3本を出す', () => {
    const head = hreflangHead('/r/abc/', '/en/r/abc/', base);
    expect(head).toContain(`hreflang="ja" href="${base}/r/abc/"`);
    expect(head).toContain(`hreflang="en" href="${base}/en/r/abc/"`);
    expect(head).toContain(`hreflang="x-default" href="${base}/r/abc/"`);
  });
});

describe('sitemap entries', () => {
  it('日英のトップ・店・エリアを列挙する', () => {
    const entries = sitemapEntries(stores, areas, base, '2026-09-06');
    expect(entries.length).toBe(2 * (2 + stores.length + areas.length));
    const locs = entries.map((e) => e.loc);
    expect(locs).toContain(`${base}/`);
    expect(locs).toContain(`${base}/en/`);
    expect(locs).toContain(`${base}/contact/`);
    expect(locs).toContain(`${base}/en/contact/`);
    expect(locs).toContain(`${base}/en/r/${first.id}/`);
    expect(locs).toContain(`${base}/r/${first.id}/`);
  });

  it('英語URLがsitemap XMLに出る', () => {
    const xml = sitemapXml(sitemapEntries(stores, areas, base, '2026-09-06'));
    expect(xml).toContain(`<loc>${base}/en/</loc>`);
    expect(xml).toContain(`<loc>${base}/en/r/${first.id}/</loc>`);
  });
});

describe('english area prerender', () => {
  it('/en/a/... の断片に英語見出しが出る', () => {
    const html = renderRoute(`/en/a/${encodeURIComponent('東京')}/${encodeURIComponent('新宿')}/`);
    expect(html).toContain('All-you-can-eat in');
  });
});
