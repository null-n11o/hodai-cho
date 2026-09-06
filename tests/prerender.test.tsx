import { afterEach, describe, expect, it } from 'vitest';
import { cleanup } from '@testing-library/react';
import { BundledCatalogRepository } from '../src/catalog/repository';
import { renderRoute } from '../src/seo/prerender';

afterEach(() => cleanup());

describe('prerender', () => {
  it('トップがJSなしで読める断片を出す', () => {
    const html = renderRoute('/');
    expect(html).toContain('放題帖');
    expect(html).toContain('件');
  });

  it('トップの断片に全ジャンルのチップが入る', () => {
    const html = renderRoute('/');
    for (const g of ['焼肉', 'しゃぶしゃぶ', '寿司', 'スイーツ', 'ピザ', '串揚げ', '宴会食放', 'パン食べ放題', 'お好み焼き', 'サラダバー', 'バイキング']) {
      expect(html).toContain(g);
    }
  });

  it('店詳細が店名・料金を含む断片を出す', () => {
    const first = new BundledCatalogRepository().listStores()[0];
    const html = renderRoute(`/r/${first.id}`);
    expect(html).toContain(first.name);
    expect(html).toMatch(/¥[\d,]+/);
  });

  it('未知IDでも落ちず空状態を出す', () => {
    const html = renderRoute('/r/no-such-shop');
    expect(html).toContain('店が見つからない');
  });
});
