import { describe, expect, it } from 'vitest';
import { SEED_STORES } from '../src/catalog/seed';
import { validateCatalog } from '../src/catalog/schema';
import { filterStores } from '../src/filters/filter';

describe('定食おかわり自由 catalog', () => {
  it('verified lunch refill stores are included and valid', () => {
    const stores = SEED_STORES.filter((store) => store.genres.includes('定食おかわり自由'));
    expect(stores.length).toBe(6);
    expect(validateCatalog(stores)).toEqual([]);
    expect(stores.every((store) => store.courses.some((course) => course.slot === 'lunch'))).toBe(true);
  });

  it('the refill genre filters separately from full buffets', () => {
    const got = filterStores(SEED_STORES, {
      prefecture: '東京', area: undefined, freeword: '', genres: ['定食おかわり自由'],
      slot: 'lunch', timeLimit: 'all', budget: undefined, sort: 'recommend',
    });
    expect(got.length).toBeGreaterThanOrEqual(5);
    expect(got.every((store) => store.genres.includes('定食おかわり自由'))).toBe(true);
  });
});
