import { describe, expect, it } from 'vitest';
import type { Genre, Prefecture } from '../src/catalog/schema';
import { en } from '../src/i18n/en';
import { ja } from '../src/i18n/ja';
import {
  areaCountLine,
  budgetLabel,
  durationLabel,
  priceCore,
  resultsCount,
  stationLine,
} from '../src/i18n/format';

function keysDeep(o: unknown, prefix = ''): string[] {
  if (typeof o !== 'object' || o === null) return [prefix];
  return Object.entries(o as Record<string, unknown>).flatMap(([k, v]) =>
    keysDeep(v, prefix ? `${prefix}.${k}` : k),
  );
}

const GENRES: Genre[] = ['焼肉', 'しゃぶしゃぶ', '寿司', 'スイーツ', 'ピザ', '串揚げ', '宴会食放', 'パン食べ放題', 'お好み焼き', 'サラダバー', 'バイキング'];
const PREFS: Prefecture[] = ['東京', '神奈川'];

describe('dictionary parity', () => {
  it('日英の辞書が同じキー構造を持つ（深さ込み）', () => {
    expect(keysDeep(en).sort()).toEqual(keysDeep(ja).sort());
  });

  it('全ジャンルに日英ラベルがある', () => {
    for (const g of GENRES) {
      expect(ja.genres[g]).toBeTruthy();
      expect(en.genres[g]).toBeTruthy();
    }
  });

  it('都県に日英ラベルがある', () => {
    for (const p of PREFS) {
      expect(ja.prefs[p]).toBeTruthy();
      expect(en.prefs[p]).toBeTruthy();
    }
  });
});

describe('format helpers', () => {
  it('料金は¥＋桁区切りを保ちカタログ数値を変えない', () => {
    expect(priceCore('ja', 2178)).toBe('¥2,178〜');
    expect(priceCore('en', 2178)).toBe('¥2,178〜');
  });

  it('分数を日英で出す', () => {
    expect(durationLabel('ja', null)).toBe('無制限');
    expect(durationLabel('en', null)).toBe('No time limit');
    expect(durationLabel('ja', 90)).toBe('90分');
    expect(durationLabel('en', 90)).toBe('90 min');
  });

  it('件数を日英で出す', () => {
    expect(resultsCount('ja', 5)).toBe('5件');
    expect(resultsCount('en', 1)).toBe('1 result');
    expect(resultsCount('en', 5)).toBe('5 results');
  });

  it('駅表示を日英で出す（駅名自体は変えない）', () => {
    expect(stationLine('ja', '新宿', 3, undefined)).toBe('新宿駅 徒歩3分');
    expect(stationLine('en', '新宿', 3, undefined)).toContain('新宿');
    expect(stationLine('en', '新宿', 3, undefined)).toContain('3');
  });

  it('エリア件数行を日英で出す', () => {
    expect(areaCountLine('ja', 4)).toContain('4件');
    expect(areaCountLine('en', 4)).toContain('4 results');
  });

  it('予算選択肢を日英で出す', () => {
    expect(budgetLabel('ja', undefined)).toBe('指定なし');
    expect(budgetLabel('en', undefined)).toBe('No limit');
    expect(budgetLabel('ja', 3000)).toContain('¥3,000');
    expect(budgetLabel('en', 3000)).toContain('¥3,000');
  });
});
