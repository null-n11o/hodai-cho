import { describe, expect, it } from 'vitest';
import { SEED_STORES } from '../src/catalog/seed';
import { validateCatalog } from '../src/catalog/schema';
import { filterStores } from '../src/filters/filter';

describe('torafuku and momo gap fill', () => {
  it('大かまど飯 寅福 ルミネ新宿店が登録されており新宿検索でヒットする', () => {
    const got = filterStores(SEED_STORES, {
      prefecture: '東京',
      area: undefined,
      freeword: '新宿',
      genres: ['定食おかわり自由'],
      slot: 'all',
      timeLimit: 'all',
      budget: undefined,
      sort: 'recommend',
    });
    const store = got.find((s) => s.id === 'torafuku-lumine-shinjuku');
    expect(store).toBeDefined();
    expect(store?.name).toBe('大かまど飯 寅福 ルミネ新宿店');
    expect(store?.station).toBe('新宿');
  });

  it('大かまど飯 寅福 池袋東武店が登録されており池袋検索でヒットする', () => {
    const got = filterStores(SEED_STORES, {
      prefecture: '東京',
      area: undefined,
      freeword: '池袋',
      genres: ['定食おかわり自由'],
      slot: 'all',
      timeLimit: 'all',
      budget: undefined,
      sort: 'recommend',
    });
    const store = got.find((s) => s.id === 'torafuku-ikebukuro-tobu');
    expect(store).toBeDefined();
    expect(store?.name).toBe('大かまど飯 寅福 池袋東武店');
    expect(store?.station).toBe('池袋');
  });

  it('モーモーパラダイス 新宿東口店が登録されており新宿検索でヒットする', () => {
    const got = filterStores(SEED_STORES, {
      prefecture: '東京',
      area: undefined,
      freeword: '新宿',
      genres: ['しゃぶしゃぶ'],
      slot: 'all',
      timeLimit: 'all',
      budget: undefined,
      sort: 'recommend',
    });
    const store = got.find((s) => s.id === 'momo-shinjuku-east');
    expect(store).toBeDefined();
    expect(store?.name).toBe('モーモーパラダイス 新宿東口店');
    expect(store?.station).toBe('新宿');
  });

  it('モーモーパラダイス 秋葉原店が登録されており秋葉原検索でヒットする', () => {
    const got = filterStores(SEED_STORES, {
      prefecture: '東京',
      area: undefined,
      freeword: '秋葉原',
      genres: ['しゃぶしゃぶ'],
      slot: 'all',
      timeLimit: 'all',
      budget: undefined,
      sort: 'recommend',
    });
    const store = got.find((s) => s.id === 'momo-akihabara');
    expect(store).toBeDefined();
    expect(store?.name).toBe('モーモーパラダイス 秋葉原店');
    expect(store?.station).toBe('秋葉原');
  });

  it('追加された店舗が validateCatalog をパスする', () => {
    const ids = ['torafuku-lumine-shinjuku', 'torafuku-ikebukuro-tobu', 'momo-shinjuku-east', 'momo-akihabara'];
    const stores = SEED_STORES.filter((s) => ids.includes(s.id));
    expect(stores.length).toBe(4);
    expect(validateCatalog(stores)).toEqual([]);
  });
});
