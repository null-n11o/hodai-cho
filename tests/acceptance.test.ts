import { describe, expect, it } from 'vitest';
import { filterStores } from '../src/filters/filter';
import type { FilterCond } from '../src/filters/filter';
import { BundledCatalogRepository } from '../src/catalog/repository';
import { validateCatalog } from '../src/catalog/schema';

const repo = new BundledCatalogRepository();
const stores = repo.listStores();
const base: FilterCond = { prefecture: '東京', area: undefined, freeword: '', genres: [], slot: 'all', timeLimit: 'all', budget: undefined, sort: 'recommend' };

describe('acceptance', () => {
  it('カタログが検証を通る', () => {
    expect(validateCatalog(stores)).toEqual([]);
  });

  it('33店相当＋新規開拓の件数が入っている', () => {
    expect(stores.length).toBeGreaterThanOrEqual(40);
  });

  it('閉店済みの川崎ダイス店が入っていない', () => {
    expect(stores.some((s) => s.id === 'suipara-kawasaki-dice')).toBe(false);
  });

  it('8ジャンルすべてに該当店がある', () => {
    const genres = ['焼肉', 'しゃぶしゃぶ', '寿司', 'スイーツ', 'ピザ', '串揚げ', '宴会食放', 'パン食べ放題'] as const;
    for (const g of genres) {
      const hit = stores.filter((s) => s.genres.includes(g) || (s.subGenres ?? []).includes(g));
      expect(hit.length, g).toBeGreaterThan(0);
    }
  });

  it('宴会食放で絞れ、居酒屋・カラオケ相当が出ない', () => {
    const got = filterStores(stores, { ...base, genres: ['宴会食放'] });
    expect(got.length).toBeGreaterThan(0);
    expect(got.every((s) => s.genres.includes('宴会食放') || (s.subGenres ?? []).includes('宴会食放'))).toBe(true);
  });

  it('ランチ指定でランチ食べ放題のない店が消える', () => {
    const got = filterStores(stores, { ...base, slot: 'lunch' });
    expect(got.every((s) => s.courses.some((c) => c.slot === 'lunch' || c.slot === 'all-day'))).toBe(true);
    expect(got.length).toBeLessThan(stores.filter((s) => s.prefecture === '東京').length);
  });

  it('全店に公式サイトのURLがある', () => {
    expect(stores.every((s) => s.officialUrl?.startsWith('https://'))).toBe(true);
  });

  it('神奈川に切ると東京の店が消える', () => {
    const got = filterStores(stores, { ...base, prefecture: '神奈川' });
    expect(got.length).toBeGreaterThan(0);
    expect(got.every((s) => s.prefecture === '神奈川')).toBe(true);
  });
});
