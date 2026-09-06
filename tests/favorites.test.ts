import { describe, expect, it } from 'vitest';
import { loadFavorites, toggleFavorite } from '../src/favorites/storage';

describe('favorites storage', () => {
  it('トグルで追加・解除できキー hodai-cho に残る', () => {
    localStorage.clear();
    expect(toggleFavorite('syabuyo-shinjuku-nowa')).toContain('syabuyo-shinjuku-nowa');
    expect(JSON.parse(localStorage.getItem('hodai-cho') ?? '[]')).toContain('syabuyo-shinjuku-nowa');
    expect(toggleFavorite('syabuyo-shinjuku-nowa')).not.toContain('syabuyo-shinjuku-nowa');
  });

  it('壊れた中身でも空配列で落ちない', () => {
    localStorage.setItem('hodai-cho', 'broken{');
    expect(loadFavorites()).toEqual([]);
  });
});
