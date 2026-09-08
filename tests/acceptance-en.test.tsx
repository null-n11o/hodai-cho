import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from '../src/routes';
import { SiteHeader } from '../src/components/SiteHeader';
import { BundledCatalogRepository } from '../src/catalog/repository';
import { filterStores } from '../src/filters/filter';
import { LANG_STORAGE_KEY } from '../src/i18n/language';

afterEach(() => cleanup());

function renderNavAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <SiteHeader />
    </MemoryRouter>,
  );
}

function renderAppAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  );
}

describe('acceptance: language switch on all screens', () => {
  it('ナビの切替が探す・詳細・保存の各パスで往復する', () => {
    const pairs: [string, string][] = [
      ['/', '/en/'],
      ['/r/syabuyo-shinjuku-nowa', '/en/r/syabuyo-shinjuku-nowa'],
      ['/saved', '/en/saved'],
    ];
    for (const [ja, en] of pairs) {
      const { unmount } = renderNavAt(ja);
      expect(screen.getByRole('link', { name: /switch to english/i }).getAttribute('href')).toBe(en);
      unmount();
      cleanup();
      renderNavAt(en);
      expect(screen.getByRole('link', { name: /japanese/i }).getAttribute('href')).toBe(ja);
      cleanup();
    }
  });

  it('言語選択はlocalStorageに残りリロード後もURLで維持される', () => {
    localStorage.clear();
    renderNavAt('/');
    fireEvent.click(screen.getByRole('link', { name: /switch to english/i }));
    expect(localStorage.getItem(LANG_STORAGE_KEY)).toBe('en');
    // リロード相当：英語URLで開き直しても英語のまま
    cleanup();
    renderAppAt('/en/saved');
    expect(screen.getByText('Saved shops')).toBeTruthy();
  });
});

describe('acceptance: english filtering equals japanese', () => {
  it('英語UIのジャンル絞り込みがロジックと一致する', () => {
    localStorage.clear();
    renderAppAt('/en/');
    const before = screen.getAllByRole('article').length;
    fireEvent.click(screen.getByRole('button', { name: 'Yakiniku' }));
    const after = screen.getAllByRole('article').length;
    expect(after).toBeLessThan(before);
    const repo = new BundledCatalogRepository();
    const expected = filterStores(repo.listStores(), {
      prefecture: '東京',
      area: undefined,
      freeword: '',
      genres: ['焼肉'],
      slot: 'all',
      timeLimit: 'all',
      budget: undefined,
      sort: 'recommend',
    }).length;
    expect(after).toBe(expected);
  });

  it('英語UIの保存が日本語UIと同一キーに残る', () => {
    localStorage.clear();
    renderAppAt('/en/');
    fireEvent.click(screen.getAllByLabelText('Save')[0]);
    const saved = JSON.parse(localStorage.getItem('hodai-cho') ?? '[]');
    expect(saved.length).toBe(1);
    cleanup();
    renderAppAt('/saved');
    const kept = new BundledCatalogRepository().getStore(saved[0]);
    expect(kept).toBeTruthy();
    expect(screen.getByText(kept!.name)).toBeTruthy();
  });

  it('英語UIの0件案内が出る', () => {
    localStorage.clear();
    renderAppAt('/en/');
    fireEvent.change(screen.getByPlaceholderText(/shop or station/i), { target: { value: '存在しない店xyz' } });
    expect(screen.getByText('No shops match these filters')).toBeTruthy();
  });
});
