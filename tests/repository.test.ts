import { describe, expect, it } from 'vitest';
import { BundledCatalogRepository } from '../src/catalog/repository';
import { validateCatalog } from '../src/catalog/schema';

describe('catalog repository', () => {
  it('33店のv1.1相当＋宴会食放の例を壊れなく読める', () => {
    const repo = new BundledCatalogRepository();
    const stores = repo.listStores();
    expect(stores.length).toBeGreaterThan(0);
    expect(validateCatalog(stores)).toEqual([]);
  });

  it('未知IDは undefined を返す', () => {
    const repo = new BundledCatalogRepository();
    expect(repo.getStore('no-such-shop')).toBeUndefined();
  });

  it('宴会コース旗を持つ店が読める', () => {
    const repo = new BundledCatalogRepository();
    const banquet = repo.listStores().filter((s) => s.courses.some((c) => c.banquet));
    expect(banquet.length).toBeGreaterThan(0);
  });
});
