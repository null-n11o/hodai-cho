import { describe, expect, it, beforeEach } from 'vitest';
import { en } from '../src/i18n/en';
import { ja } from '../src/i18n/ja';
import {
  LANG_STORAGE_KEY,
  getLangFromPath,
  loadLanguage,
  saveLanguage,
  toEnPath,
  toJaPath,
} from '../src/i18n/language';

describe('i18n dictionaries', () => {
  it('日英の辞書が同じキー構造を持つ', () => {
    expect(Object.keys(en.nav).sort()).toEqual(Object.keys(ja.nav).sort());
    expect(Object.keys(en.lang).sort()).toEqual(Object.keys(ja.lang).sort());
  });

  it('ナビ文言が空でない', () => {
    expect(ja.nav.search).toBeTruthy();
    expect(en.nav.search).toBeTruthy();
    expect(ja.nav.saved).toBeTruthy();
    expect(en.nav.saved).toBeTruthy();
  });
});

describe('getLangFromPath', () => {
  it('日本語パスを判定する', () => {
    expect(getLangFromPath('/')).toBe('ja');
    expect(getLangFromPath('/saved')).toBe('ja');
    expect(getLangFromPath('/r/abc')).toBe('ja');
  });

  it('英語パスを判定する', () => {
    expect(getLangFromPath('/en')).toBe('en');
    expect(getLangFromPath('/en/')).toBe('en');
    expect(getLangFromPath('/en/saved')).toBe('en');
    expect(getLangFromPath('/en/r/abc')).toBe('en');
  });
});

describe('toEnPath / toJaPath', () => {
  it('日本語パスを英語パスへ変える', () => {
    expect(toEnPath('/')).toBe('/en/');
    expect(toEnPath('/saved')).toBe('/en/saved');
    expect(toEnPath('/r/abc')).toBe('/en/r/abc');
  });

  it('英語パスはそのまま保つ', () => {
    expect(toEnPath('/en/')).toBe('/en/');
    expect(toEnPath('/en/saved')).toBe('/en/saved');
  });

  it('英語パスを日本語パスへ戻す', () => {
    expect(toJaPath('/en/')).toBe('/');
    expect(toJaPath('/en')).toBe('/');
    expect(toJaPath('/en/saved')).toBe('/saved');
    expect(toJaPath('/en/r/abc')).toBe('/r/abc');
  });

  it('日本語パスはそのまま保つ', () => {
    expect(toJaPath('/')).toBe('/');
    expect(toJaPath('/saved')).toBe('/saved');
  });

  it('往復で元に戻る', () => {
    for (const p of ['/', '/saved', '/r/abc']) {
      expect(toJaPath(toEnPath(p))).toBe(p);
    }
  });
});

describe('language storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('保存と読込が往復する', () => {
    saveLanguage('en');
    expect(loadLanguage()).toBe('en');
    saveLanguage('ja');
    expect(loadLanguage()).toBe('ja');
  });

  it('未設定・不正値は ja に倒す', () => {
    expect(loadLanguage()).toBe('ja');
    localStorage.setItem(LANG_STORAGE_KEY, 'fr');
    expect(loadLanguage()).toBe('ja');
  });

  it('お気に入りキー hodai-cho を壊さない', () => {
    localStorage.setItem('hodai-cho', JSON.stringify(['a']));
    saveLanguage('en');
    expect(JSON.parse(localStorage.getItem('hodai-cho') ?? '[]')).toEqual(['a']);
    expect(localStorage.getItem(LANG_STORAGE_KEY)).toBe('en');
  });
});
