import { describe, expect, it } from 'vitest';
import { SEED_STORES } from '../src/catalog/seed';
import { validateCatalog } from '../src/catalog/schema';
import { filterStores } from '../src/filters/filter';

describe('sushi chain gap fill', () => {
  const baseCond = {
    area: undefined,
    freeword: '',
    genres: ['寿司' as const],
    slot: 'all' as const,
    timeLimit: 'all' as const,
    budget: undefined,
    sort: 'recommend' as const,
  };

  it('きづなすし 秋葉原店が登録されており秋葉原検索でヒットする', () => {
    const got = filterStores(SEED_STORES, {
      ...baseCond,
      prefecture: '東京',
      freeword: '秋葉原',
    });
    const store = got.find((s) => s.id === 'kizuna-akihabara');
    expect(store).toBeDefined();
    expect(store?.name).toBe('きづなすし 秋葉原店');
    expect(store?.chain).toBe('きづなすし');
    expect(store?.station).toBe('秋葉原');
  });

  it('雛鮨 西銀座デパート店が登録されており有楽町・銀座検索でヒットする', () => {
    const got = filterStores(SEED_STORES, {
      ...baseCond,
      prefecture: '東京',
      freeword: '有楽町',
    });
    const store = got.find((s) => s.id === 'hina-nishi-ginza');
    expect(store).toBeDefined();
    expect(store?.name).toBe('雛鮨 西銀座デパート店');
    expect(store?.chain).toBe('雛鮨');
    expect(store?.station).toBe('有楽町');
    expect(store?.area).toBe('銀座・有楽町');
  });

  it('雛鮨 新宿マルイアネックス店が登録されている', () => {
    const store = SEED_STORES.find((s) => s.id === 'hina-shinjuku-annex');
    expect(store).toBeDefined();
    expect(store?.name).toBe('雛鮨 新宿マルイアネックス店');
    expect(store?.area).toBe('新宿');
  });

  it('雛鮨 上野の森さくらテラス店が登録されており上野検索でヒットする', () => {
    const got = filterStores(SEED_STORES, {
      ...baseCond,
      prefecture: '東京',
      freeword: '上野',
    });
    const store = got.find((s) => s.id === 'hina-ueno-sakura');
    expect(store).toBeDefined();
    expect(store?.name).toBe('雛鮨 上野の森さくらテラス店');
    expect(store?.station).toBe('上野');
  });

  it('祭雛 ヨドバシ横浜店が登録されており横浜検索でヒットする', () => {
    const got = filterStores(SEED_STORES, {
      ...baseCond,
      prefecture: '神奈川',
      freeword: '横浜',
    });
    const store = got.find((s) => s.id === 'hina-yokohama-matsuri');
    expect(store).toBeDefined();
    expect(store?.name).toBe('祭雛 ヨドバシ横浜店');
    expect(store?.chain).toBe('雛鮨');
    expect(store?.station).toBe('横浜');
  });

  it('全寿司店が validateCatalog をパスする', () => {
    const sushiStores = SEED_STORES.filter((s) => s.genres.includes('寿司'));
    expect(validateCatalog(sushiStores)).toEqual([]);
  });
});
