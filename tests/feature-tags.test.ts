import { describe, it, expect } from 'vitest';
import { BundledCatalogRepository } from '../src/catalog/repository';
import { validateCatalog, type Store } from '../src/catalog/schema';

describe('Feature tags schema and validation', () => {
  it('Store schema allows soloFriendly, kidsDiscount, and weekdayUnlimited flags', () => {
    const dummyStore: Store = {
      id: 'test-store',
      name: 'テスト店',
      nameEn: 'Test Store',
      kana: 'てすとてん',
      chain: 'テスト',
      prefecture: '東京',
      area: '新宿',
      station: '新宿',
      walkMinutes: 3,
      genres: ['焼肉'],
      pick: 3,
      courses: [
        {
          slot: 'all-day',
          name: '基本コース',
          nameEn: 'Basic Course',
          priceInclTax: 3000,
          minutes: 90,
        },
      ],
      hours: '11:00-23:00',
      hoursEn: '11:00-23:00',
      highlights: ['名物カルビ'],
      highlightsEn: ['Famous Kalbi'],
      notice: '予約推奨',
      noticeEn: 'Reservation recommended',
      familyFriendly: true,
      soloFriendly: true,
      kidsDiscount: true,
      weekdayUnlimited: true,
    };

    const errors = validateCatalog([dummyStore]);
    expect(errors).toEqual([]);
  });

  it('bundled catalog loads stores without validation errors', () => {
    const repo = new BundledCatalogRepository();
    const stores = repo.listStores();
    expect(stores.length).toBeGreaterThan(100);
    const errors = validateCatalog(stores);
    expect(errors).toEqual([]);

    const soloCount = stores.filter((s) => s.soloFriendly).length;
    const kidsCount = stores.filter((s) => s.kidsDiscount).length;
    const unlimitedCount = stores.filter((s) => s.weekdayUnlimited).length;

    expect(soloCount).toBeGreaterThanOrEqual(30);
    expect(kidsCount).toBeGreaterThanOrEqual(40);
    expect(unlimitedCount).toBeGreaterThanOrEqual(20);
  });
});
