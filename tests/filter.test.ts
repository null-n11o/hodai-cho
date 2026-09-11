import { describe, expect, it } from 'vitest';
import { filterStores } from '../src/filters/filter';
import { SEED_STORES } from '../src/catalog/seed';

describe('filterStores', () => {
  const base = { prefecture: '東京' as const, area: undefined, freeword: '', genres: [], slot: 'all' as const, timeLimit: 'all' as const, budget: undefined, sort: 'recommend' as const };

  it('神奈川に切ると東京の店が消える', () => {
    const got = filterStores(SEED_STORES, { ...base, prefecture: '神奈川' });
    expect(got.every((s) => s.prefecture === '神奈川')).toBe(true);
  });

  it('時間無制限は minutes == null のコースがある店だけ', () => {
    const got = filterStores(SEED_STORES, { ...base, timeLimit: 'unlimited' });
    expect(got.length).toBeGreaterThan(0);
    expect(got.every((s) => s.courses.some((c) => c.minutes === null))).toBe(true);
  });

  it('90分以内は無制限を含めない', () => {
    const got = filterStores(SEED_STORES, { ...base, timeLimit: 'le90' });
    expect(got.every((s) => s.courses.some((c) => c.minutes !== null && c.minutes <= 90))).toBe(true);
  });

  it('フリーワードはNFKC正規化の部分一致', () => {
    const got = filterStores(SEED_STORES, { ...base, freeword: 'ｼﾝｼﾞｭｸ' });
    expect(got.length).toBeGreaterThan(0);
  });

  it('宴会食放ジャンルで絞れる', () => {
    const got = filterStores(SEED_STORES, { ...base, genres: ['宴会食放'] });
    expect(got.every((s) => s.genres.includes('宴会食放') || (s.subGenres ?? []).includes('宴会食放'))).toBe(true);
  });

  it('駅からの徒歩時間の上限で絞れる', () => {
    const got = filterStores(SEED_STORES, { ...base, walkMax: 3 } as Parameters<typeof filterStores>[1]);
    expect(got.length).toBeGreaterThan(0);
    expect(got.every((s) => s.walkMinutes <= 3)).toBe(true);
  });

  describe('こだわり条件タグの絞り込み', () => {
    const testStores = [
      {
        ...SEED_STORES[0],
        id: 's1',
        name: 'ソロ向け店',
        prefecture: '東京' as const,
        soloFriendly: true,
        kidsDiscount: false,
        weekdayUnlimited: false,
      },
      {
        ...SEED_STORES[0],
        id: 's2',
        name: 'キッズ向け店',
        prefecture: '東京' as const,
        soloFriendly: false,
        kidsDiscount: true,
        weekdayUnlimited: false,
      },
      {
        ...SEED_STORES[0],
        id: 's3',
        name: '平日無制限店',
        prefecture: '東京' as const,
        soloFriendly: false,
        kidsDiscount: false,
        weekdayUnlimited: true,
      },
      {
        ...SEED_STORES[0],
        id: 's4',
        name: '全部入り店',
        prefecture: '東京' as const,
        soloFriendly: true,
        kidsDiscount: true,
        weekdayUnlimited: true,
      },
    ];

    it('soloFriendly で1人歓迎の店のみ絞れる', () => {
      const got = filterStores(testStores, { ...base, soloFriendly: true });
      expect(got.map((s) => s.id)).toEqual(['s1', 's4']);
    });

    it('kidsDiscount で子供料金・幼児無料の店のみ絞れる', () => {
      const got = filterStores(testStores, { ...base, kidsDiscount: true });
      expect(got.map((s) => s.id)).toEqual(['s2', 's4']);
    });

    it('weekdayUnlimited で平日時間無制限の店のみ絞れる', () => {
      const got = filterStores(testStores, { ...base, weekdayUnlimited: true });
      expect(got.map((s) => s.id)).toEqual(['s3', 's4']);
    });

    it('複数条件（AND）で一致する店のみ絞れる', () => {
      const got = filterStores(testStores, { ...base, soloFriendly: true, kidsDiscount: true });
      expect(got.map((s) => s.id)).toEqual(['s4']);
    });
  });
});
