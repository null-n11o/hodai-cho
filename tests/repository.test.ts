import { describe, expect, it } from 'vitest';
import { BundledCatalogRepository } from '../src/catalog/repository';

describe('catalog repository', () => {
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
