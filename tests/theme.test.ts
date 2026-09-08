import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = readFileSync('src/index.css', 'utf8');
const html = readFileSync('index.html', 'utf8');
const main = readFileSync('src/main.tsx', 'utf8');

describe('light editorial theme', () => {
  it('Noto Sans JPを日本語UIの標準フォントとして読み込む', () => {
    expect(html).toContain('Noto+Sans+JP');
    expect(css).toContain("font-family: 'Noto Sans JP'");
  });

  it('検索以外の画面もライトベースのトークンを使う', () => {
    expect(css).toContain('color-scheme: light');
    expect(css).toContain('--page: #f3efe8');
    expect(css).toContain('.content-page');
    expect(css).toContain('.detail-hero, .detail-section');
    expect(css).toContain('.contact-panel, .contact-aside');
    expect(css).toContain('.mobile-nav');
    expect(main).not.toContain('min-h-svh bg-ink');
  });

  it('検索パネルの見出しと条件入力の間に余白を取る', () => {
    expect(css).toMatch(/\.search-panel-heading \{[^}]*margin-bottom: 40px;/s);
    expect(css).toMatch(/@media \(max-width: 767px\)[\s\S]*?\.search-panel-heading \{[^}]*margin-bottom: 22px;/);
  });

  it('検索パネルと条件入力の背景をページと揃える', () => {
    expect(css).toMatch(/\.search-page \.search-panel \{[\s\S]*?background: var\(--paper\);/);
    expect(css).toMatch(/\.search-page \.keyword-field input, \.search-page \.select-field select, \.search-page \.sort-field select \{[\s\S]*?background: var\(--paper\);/);
  });

  it('空状態の見出しはライトベースで読める色になる', () => {
    expect(css).toContain('.search-page .empty-state > p');
    expect(css).toContain('.content-page .empty-state > p');
    expect(css).not.toContain('.header-nav a.active,\n.mobile-nav a[aria-current=page] { color: var(--text); }');
  });
});
