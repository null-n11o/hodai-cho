import { describe, expect, it } from 'vitest';
import { foodImageSrc } from '../src/components/FoodImage';

describe('foodImageSrc', () => {
  it('料理静物を用意したジャンルの画像パスを返す', () => {
    expect(foodImageSrc('焼肉')).toBe('/food/yakiniku.png');
    expect(foodImageSrc('パン食べ放題')).toBe('/food/bread.png');
    expect(foodImageSrc('串揚げ')).toBe('/food/kushikatsu.png');
    expect(foodImageSrc('定食おかわり自由')).toBe('/food/banquet.png');
  });
});
