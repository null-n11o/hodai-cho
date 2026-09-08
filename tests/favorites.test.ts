import { beforeEach, describe, expect, it } from 'vitest';
import { loadFavorites, toggleFavorite } from '../src/favorites/storage';

describe('favorites storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('トグルで追加・解除できキー tabeho に残る', () => {
    expect(toggleFavorite('syabuyo-shinjuku-nowa')).toContain('syabuyo-shinjuku-nowa');
    expect(JSON.parse(localStorage.getItem('tabeho') ?? '[]')).toContain('syabuyo-shinjuku-nowa');
    expect(toggleFavorite('syabuyo-shinjuku-nowa')).not.toContain('syabuyo-shinjuku-nowa');
  });

  it('壊れた中身でも空配列で落ちない', () => {
    localStorage.setItem('tabeho', 'broken{');
    expect(loadFavorites()).toEqual([]);
  });

  it('旧キー hodai-cho の値を新キー tabeho へ移行する', () => {
    localStorage.setItem('hodai-cho', JSON.stringify(['syabuyo-shinjuku-nowa']));
    expect(loadFavorites()).toEqual(['syabuyo-shinjuku-nowa']);
    expect(JSON.parse(localStorage.getItem('tabeho') ?? '[]')).toEqual(['syabuyo-shinjuku-nowa']);
    expect(localStorage.getItem('hodai-cho')).toBeNull();
  });

  it('両方のキーがある場合は新キー tabeho を優先し上書きしない', () => {
    localStorage.setItem('tabeho', JSON.stringify(['new-shop']));
    localStorage.setItem('hodai-cho', JSON.stringify(['old-shop']));
    expect(loadFavorites()).toEqual(['new-shop']);
    expect(JSON.parse(localStorage.getItem('tabeho') ?? '[]')).toEqual(['new-shop']);
  });
});
