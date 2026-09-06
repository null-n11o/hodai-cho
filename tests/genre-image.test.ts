import { describe, expect, it } from 'vitest';
import { genreImageSrc } from '../src/components/GenreImage';
import type { Genre } from '../src/catalog/schema';

describe('genreImageSrc', () => {
  it('7ジャンルすべてに画像パスが返る', () => {
    const genres: Genre[] = ['焼肉', 'しゃぶしゃぶ', '寿司', 'スイーツ', 'ピザ', '串揚げ', '宴会食放'];
    for (const g of genres) {
      expect(genreImageSrc(g)).toMatch(/^\/genre\/.+\.svg$/);
    }
  });

  it('ジャンルごとに異なる画像になる', () => {
    const genres: Genre[] = ['焼肉', 'しゃぶしゃぶ', '寿司', 'スイーツ', 'ピザ', '串揚げ', '宴会食放'];
    const srcs = new Set(genres.map((g) => genreImageSrc(g)));
    expect(srcs.size).toBe(genres.length);
  });
});
