import { afterEach, describe, expect, it } from 'vitest';
import { cleanup } from '@testing-library/react';
import { BundledCatalogRepository } from '../src/catalog/repository';
import { renderRoute } from '../src/seo/prerender';

afterEach(() => cleanup());

describe('prerender', () => {
  it('トップがJSなしで読める断片を出す', () => {
    const html = renderRoute('/');
    expect(html).toContain('今日は好きなだけ食べよう。');
    expect(html).toContain('食べ放題を探す');
  });

  it('英語トップがJSなしでコピーとCTAを出す', () => {
    const html = renderRoute('/en/');
    expect(html).toContain('Today, eat to your heart’s content.');
    expect(html).toContain('Find all-you-can-eat');
    expect(html).toContain('href="/en/search/"');
  });

  it('検索ページの断片に全ジャンルのチップが入る', () => {
    const html = renderRoute('/search/');
    for (const g of ['焼肉', 'しゃぶしゃぶ', '寿司', 'スイーツ', 'ピザ', '串揚げ', '宴会食放', 'パン食べ放題', 'お好み焼き', 'サラダバー', 'バイキング']) {
      expect(html).toContain(g);
    }
  });

  it.each([
    ['/search/', 'name'],
    ['/en/search/', 'nameEn'],
  ] as const)('%s が実店舗と料金をSSRする', (path, nameKey) => {
    const first = new BundledCatalogRepository().listStores()[0];
    const price = Math.min(...first.courses.map((course) => course.priceInclTax)).toLocaleString('ja-JP');
    const html = renderRoute(path);
    expect(html).toContain(first[nameKey]);
    expect(html).toContain(`¥${price}`);
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

  it('エリア×ジャンルページの断片が見出しと店名を含む', () => {
    const path = `/a/${encodeURIComponent('東京')}/${encodeURIComponent('新宿')}/${encodeURIComponent('焼肉')}`;
    const html = renderRoute(path);
    expect(html).toContain('新宿の焼肉食べ放題');
    expect(html).toContain('牛角');
  });

  it('英語のエリア×ジャンルページの断片が英語見出しを含む', () => {
    const path = `/en/a/${encodeURIComponent('東京')}/${encodeURIComponent('新宿')}/${encodeURIComponent('焼肉')}`;
    const html = renderRoute(path);
    expect(html).toContain('All-you-can-eat Yakiniku in Shinjuku');
    expect(html).toContain('Gyu-kaku');
  });
});
