import { describe, expect, it } from 'vitest';
import { SEED_STORES } from '../src/catalog/seed';
import { validateCatalog } from '../src/catalog/schema';
import { filterStores } from '../src/filters/filter';

describe('sizzler chain gap fill', () => {
  const baseCond = {
    area: undefined,
    freeword: '',
    genres: ['サラダバー' as const],
    slot: 'all' as const,
    timeLimit: 'all' as const,
    budget: undefined,
    sort: 'recommend' as const,
  };

  it('シズラー 新宿東宝ビル店が登録されており新宿検索でヒットする', () => {
    const got = filterStores(SEED_STORES, {
      ...baseCond,
      prefecture: '東京',
      freeword: '新宿',
    });
    const store = got.find((s) => s.id === 'sizzler-shinjuku-toho');
    expect(store).toBeDefined();
    expect(store?.name).toBe('シズラー 新宿東宝ビル店');
    expect(store?.chain).toBe('シズラー');
    expect(store?.station).toBe('新宿');
  });

  it('シズラー アクアシティお台場店が登録されておりお台場検索でヒットする', () => {
    const got = filterStores(SEED_STORES, {
      ...baseCond,
      prefecture: '東京',
      freeword: 'お台場',
    });
    const store = got.find((s) => s.id === 'sizzler-aquacity-odaiba');
    expect(store).toBeDefined();
    expect(store?.name).toBe('シズラー アクアシティお台場店');
    expect(store?.area).toBe('お台場');
  });

  it('シズラー 東京ドームホテル店が登録されており水道橋検索でヒットする', () => {
    const got = filterStores(SEED_STORES, {
      ...baseCond,
      prefecture: '東京',
      freeword: '水道橋',
    });
    const store = got.find((s) => s.id === 'sizzler-tokyo-dome-hotel');
    expect(store).toBeDefined();
    expect(store?.name).toBe('シズラー 東京ドームホテル店');
    expect(store?.station).toBe('水道橋');
    expect(store?.area).toBe('水道橋');
  });

  it('シズラー 大井町トラックス店が登録されており大井町検索でヒットする', () => {
    const got = filterStores(SEED_STORES, {
      ...baseCond,
      prefecture: '東京',
      freeword: '大井町',
    });
    const store = got.find((s) => s.id === 'sizzler-oimachi');
    expect(store).toBeDefined();
    expect(store?.name).toBe('シズラー 大井町トラックス店');
    expect(store?.station).toBe('大井町');
    expect(store?.area).toBe('大井町');
  });

  it('シズラー 三鷹店が登録されており三鷹検索でヒットする', () => {
    const got = filterStores(SEED_STORES, {
      ...baseCond,
      prefecture: '東京',
      freeword: '三鷹',
    });
    const store = got.find((s) => s.id === 'sizzler-mitaka');
    expect(store).toBeDefined();
    expect(store?.name).toBe('シズラー 三鷹店');
    expect(store?.station).toBe('三鷹');
    expect(store?.area).toBe('三鷹');
  });

  it('全シズラー店舗が東京・神奈川で12店舗となり validateCatalog をパスする', () => {
    const sizzlerStores = SEED_STORES.filter((s) => s.chain === 'シズラー');
    expect(sizzlerStores.length).toBe(12);
    expect(validateCatalog(sizzlerStores)).toEqual([]);
  });
});
