import { describe, it, expect } from 'vitest';
import { BundledCatalogRepository } from '../src/catalog/repository';
import {
  listAreaGenres,
  areaGenrePath,
  areaGenrePageUrl,
  areaGenreTitle,
  areaGenreDescription,
  areaGenreTitleEn,
  areaGenreDescriptionEn,
  areaGenreJsonLd,
  sitemapEntries,
  listAreas,
} from '../src/seo/meta';

describe('Area x Genre SEO meta functions', () => {
  const repo = new BundledCatalogRepository();
  const stores = repo.listStores();

  it('listAreaGenres extracts unique area x genre pairs where stores exist', () => {
    const pairs = listAreaGenres(stores);
    expect(pairs.length).toBeGreaterThan(30);

    const shinjukuYakiniku = pairs.find(
      (p) => p.prefecture === '東京' && p.area === '新宿' && p.genre === '焼肉'
    );
    expect(shinjukuYakiniku).toBeDefined();

    const yokohamaSushi = pairs.find(
      (p) => p.prefecture === '神奈川' && p.area === '横浜' && p.genre === '寿司'
    );
    expect(yokohamaSushi).toBeDefined();
  });

  it('generates area x genre paths and URLs', () => {
    const path = areaGenrePath('東京', '新宿', '焼肉');
    expect(path).toBe('/a/%E6%9D%B1%E4%BA%AC/%E6%96%B0%E5%AE%BF/%E7%84%BC%E8%82%89/');
    expect(areaGenrePageUrl('東京', '新宿', '焼肉', 'https://tabeho.com')).toBe(
      'https://tabeho.com/a/%E6%9D%B1%E4%BA%AC/%E6%96%B0%E5%AE%BF/%E7%84%BC%E8%82%89/'
    );
  });

  it('generates Japanese titles and descriptions with count', () => {
    const title = areaGenreTitle('東京', '新宿', '焼肉', 5);
    expect(title).toBe('新宿の焼肉食べ放題5件｜料金と時間で切る｜タベホー');

    const desc = areaGenreDescription('東京', '新宿', '焼肉', 5);
    expect(desc).toContain('東京・新宿の焼肉食べ放題5件を料金と制限時間で整理。');
  });

  it('generates English titles and descriptions with count', () => {
    const title = areaGenreTitleEn('東京', '新宿', '焼肉', 5);
    expect(title).toBe('All-you-can-eat Yakiniku in Shinjuku: 5 places by price and time｜Tabeho');

    const desc = areaGenreDescriptionEn('東京', '新宿', '焼肉', 5);
    expect(desc).toContain('Tokyo · Shinjuku: 5 all-you-can-eat yakiniku places with prices and time limits.');
  });

  it('generates BreadcrumbList JSON-LD for area x genre', () => {
    const jsonLd = areaGenreJsonLd('東京', '新宿', '焼肉', 'https://tabeho.com', '/a/東京/新宿/焼肉/');
    expect(jsonLd['@context']).toBe('https://schema.org');
    expect(jsonLd['@type']).toBe('BreadcrumbList');
    const items = jsonLd.itemListElement as Array<{ position: number; name: string; item: string }>;
    expect(items).toHaveLength(3);
    expect(items[0].name).toBe('タベホー');
    expect(items[1].name).toBe('新宿の食べ放題');
    expect(items[2].name).toBe('新宿の焼肉食べ放題');
  });

  it('sitemapEntries includes area x genre pages in ja and en', () => {
    const areas = listAreas(stores);
    const areaGenres = listAreaGenres(stores);
    const entries = sitemapEntries(stores, areas, 'https://tabeho.com', '2026-09-11', areaGenres);
    const urls = entries.map((e) => e.loc);

    const targetJa = 'https://tabeho.com' + areaGenrePath('東京', '新宿', '焼肉');
    const targetEn = 'https://tabeho.com/en' + areaGenrePath('東京', '新宿', '焼肉');
    expect(urls).toContain(targetJa);
    expect(urls).toContain(targetEn);
  });
});
