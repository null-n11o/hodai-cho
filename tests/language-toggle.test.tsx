import { describe, expect, it, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { LanguageToggle } from '../src/components/LanguageToggle';
import { LANG_STORAGE_KEY } from '../src/i18n/language';

afterEach(() => cleanup());

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <LanguageToggle />
    </MemoryRouter>,
  );
}

describe('LanguageToggle', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('日本語パスで English へのリンクを出す', () => {
    renderAt('/');
    const link = screen.getByRole('link', { name: /english/i });
    expect(link.getAttribute('href')).toBe('/en/');
  });

  it('英語パスで日本語へのリンクを出す', () => {
    renderAt('/en/');
    const link = screen.getByRole('link', { name: /japanese/i });
    expect(link.getAttribute('href')).toBe('/');
  });

  it('詳細ルートを保ったまま切り替える', () => {
    renderAt('/r/abc');
    expect(screen.getByRole('link').getAttribute('href')).toBe('/en/r/abc');
  });

  it('英語詳細から日本語詳細へ戻す', () => {
    renderAt('/en/r/abc');
    expect(screen.getByRole('link').getAttribute('href')).toBe('/r/abc');
  });

  it('タップ面44px以上とaria-labelを持つ', () => {
    renderAt('/');
    const link = screen.getByRole('link');
    expect(link.className).toMatch(/min-h-\[44px\]/);
    expect(link.getAttribute('aria-label')).toBeTruthy();
  });

  it('押すと言語設定が保存される', () => {
    renderAt('/');
    fireEvent.click(screen.getByRole('link'));
    expect(localStorage.getItem(LANG_STORAGE_KEY)).toBe('en');
  });
});
