import { afterEach, describe, expect, it } from 'vitest';
import { cleanup } from '@testing-library/react';
import { BundledCatalogRepository } from '../src/catalog/repository';
import {
  areaDescription,
  areaPath,
  areaTitle,
  contactDescription,
  contactTitle,
  listAreas,
  sitemapXml,
  storeDescription,
  storeJsonLd,
  storeTitle,
} from '../src/seo/meta';

afterEach(() => cleanup());

const repo = new BundledCatalogRepository();
const stores = repo.listStores();
const first = stores[0];

describe('seo meta', () => {
  it('店タイトルに店名・エリア・タベホーが入る', () => {
    const t = storeTitle(first);
    expect(t).toContain(first.name);
    expect(t).toContain(first.area);
    expect(t).toContain('タベホー');
  });

  it('店説明文に最安料金と駅徒歩が入る', () => {
    const d = storeDescription(first);
    expect(d).toContain(first.station);
    expect(d).toContain(`徒歩${first.walkMinutes}分`);
    expect(d).toMatch(/¥[\d,]+〜/);
  });

  it('JSON-LDがRestaurant型で料金帯を持つ', () => {
    const ld = storeJsonLd(first, 'https://example.invalid');
    expect(ld['@type']).toBe('Restaurant');
    expect(ld.name).toBe(first.name);
    expect(ld.priceRange).toMatch(/^¥/);
    expect(ld.url ?? ld.identifier ?? '').toBeTruthy();
  });

  it('エリアパスが都県＋エリアで一意になる', () => {
    expect(areaPath('東京', '新宿')).toBe(`/a/${encodeURIComponent('東京')}/${encodeURIComponent('新宿')}/`);
  });

  it('エリア一覧が重複なく取れる', () => {
    const areas = listAreas(stores);
    const keys = areas.map((a) => `${a.prefecture}/${a.area}`);
    expect(new Set(keys).size).toBe(keys.length);
    expect(keys.length).toBeGreaterThan(0);
  });

  it('エリアタイトルにエリア名と件数が入る', () => {
    const t = areaTitle('東京', '新宿', 5);
    expect(t).toContain('新宿');
    expect(t).toContain('5');
    const d = areaDescription('東京', '新宿', 5);
    expect(d).toContain('新宿');
  });

  it('問い合わせページのタイトルと説明がある', () => {
    expect(contactTitle()).toContain('情報提供');
    expect(contactDescription()).toContain('修正依頼');
  });

  it('sitemapがloc列を出す', () => {
    const xml = sitemapXml([
      { loc: 'https://example.invalid/' },
      { loc: 'https://example.invalid/r/abc/' },
    ]);
    expect(xml).toContain('<loc>https://example.invalid/</loc>');
    expect(xml).toContain('<loc>https://example.invalid/r/abc/</loc>');
  });
});
