import { describe, expect, it } from 'vitest';
import { BundledCatalogRepository } from '../src/catalog/repository';
import { AREA_EN, CHAIN_EN, STATION_EN } from '../src/catalog/en-names';
import { filterStores } from '../src/filters/filter';

const repo = new BundledCatalogRepository();
const stores = repo.listStores();

describe('catalog english completeness', () => {
  it('全店に英語フィールドが揃う', () => {
    for (const s of stores) {
      expect(s.nameEn, s.id).toBeTruthy();
      expect(s.hoursEn, s.id).toBeTruthy();
      expect(s.noticeEn, s.id).toBeTruthy();
      expect(s.highlightsEn.length, s.id).toBe(s.highlights.length);
      for (const c of s.courses) {
        expect(c.nameEn, `${s.id}/${c.name}`).toBeTruthy();
        if (c.note) expect(c.noteEn, `${s.id}/${c.name}`).toBeTruthy();
      }
      if (s.facility) expect(s.facilityEn, s.id).toBeTruthy();
    }
  });

  it('店名はすべてBranch終わりになる', () => {
    for (const s of stores) {
      expect(s.nameEn, s.id).toMatch(/Branch$/);
    }
  });

  it('全店の駅・エリア・チェーンがテーブルにある', () => {
    for (const s of stores) {
      expect(STATION_EN[s.station], s.id).toBeTruthy();
      expect(AREA_EN[s.area], s.id).toBeTruthy();
      expect(CHAIN_EN[s.chain], s.id).toBeTruthy();
    }
  });
});

describe('english freeword search', () => {
  const base = { prefecture: '東京' as const, area: undefined, freeword: '', genres: [], slot: 'all' as const, timeLimit: 'all' as const, budget: undefined, sort: 'recommend' as const };

  it('ローマ字でも店が見つかる', () => {
    const got = filterStores(stores, { ...base, freeword: 'shinjuku' });
    expect(got.length).toBeGreaterThan(0);
    expect(got.every((s) => s.prefecture === '東京')).toBe(true);
  });
});
