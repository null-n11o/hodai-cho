import { describe, expect, it } from 'vitest';
import { SEED_STORES } from '../src/catalog/seed';
import { validateCatalog } from '../src/catalog/schema';
import { filterStores } from '../src/filters/filter';

describe('shakeys chain gap fill', () => {
  const baseCond = {
    area: undefined,
    freeword: '',
    genres: ['ピザ' as const],
    slot: 'all' as const,
    timeLimit: 'all' as const,
    budget: undefined,
    sort: 'recommend' as const,
  };

  it('シェーキーズ 新宿セノビル店が登録されており新宿検索でヒットする', () => {
    const got = filterStores(SEED_STORES, {
      ...baseCond,
      prefecture: '東京',
      freeword: '新宿',
    });
    const store = got.find((s) => s.id === 'shakeys-shinjuku-ceno');
    expect(store).toBeDefined();
    expect(store?.name).toBe('シェーキーズ 新宿セノビル店');
    expect(store?.station).toBe('新宿');
  });

  it('シェーキーズ 吉祥寺店が登録されており吉祥寺検索でヒットする', () => {
    const got = filterStores(SEED_STORES, {
      ...baseCond,
      prefecture: '東京',
      freeword: '吉祥寺',
    });
    const store = got.find((s) => s.id === 'shakeys-kichijoji');
    expect(store).toBeDefined();
    expect(store?.name).toBe('シェーキーズ 吉祥寺店');
    expect(store?.station).toBe('吉祥寺');
  });

  it('全シェーキーズ店舗が validateCatalog をパスする', () => {
    const shakeysStores = SEED_STORES.filter((s) => s.chain === 'シェーキーズ');
    expect(validateCatalog(shakeysStores)).toEqual([]);
  });
});
