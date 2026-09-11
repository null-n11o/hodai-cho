import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from '../src/routes';
import { BundledCatalogRepository } from '../src/catalog/repository';

afterEach(() => cleanup());

function renderAreaGenre(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  );
}

describe('Area x Genre Page', () => {
  const repo = new BundledCatalogRepository();
  const allStores = repo.listStores();

  it('renders Japanese area x genre page with heading, breadcrumb, and filtered stores', () => {
    const path = `/a/${encodeURIComponent('東京')}/${encodeURIComponent('新宿')}/${encodeURIComponent('焼肉')}`;
    renderAreaGenre(path);

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('新宿の焼肉食べ放題');
    expect(screen.getByText(/\d+件/)).toBeTruthy();

    const breadcrumb = screen.getByRole('navigation', { name: 'パンくずリスト' });
    expect(breadcrumb).toBeTruthy();
    expect(within(breadcrumb).getByRole('link', { name: '探す' })).toBeTruthy();
    expect(within(breadcrumb).getByRole('link', { name: '新宿の食べ放題' })).toBeTruthy();

    const expectedCount = allStores.filter(
      (s) => s.prefecture === '東京' && s.area === '新宿' && (s.genres.includes('焼肉') || (s.subGenres ?? []).includes('焼肉'))
    ).length;
    expect(screen.getAllByRole('article').length).toBe(Math.min(expectedCount, 10));
  });

  it('renders English area x genre page with English heading and breadcrumbs', () => {
    const path = `/en/a/${encodeURIComponent('東京')}/${encodeURIComponent('新宿')}/${encodeURIComponent('焼肉')}`;
    renderAreaGenre(path);

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('All-you-can-eat Yakiniku in Shinjuku');
    expect(screen.getByText(/\d+ results/)).toBeTruthy();

    const breadcrumb = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(breadcrumb).toBeTruthy();
    expect(within(breadcrumb).getByRole('link', { name: 'Search' })).toBeTruthy();
    expect(within(breadcrumb).getByRole('link', { name: 'All-you-can-eat in Shinjuku' })).toBeTruthy();
  });

  it('handles empty area x genre with friendly advice and link back', () => {
    const path = `/a/${encodeURIComponent('東京')}/${encodeURIComponent('新宿')}/${encodeURIComponent('串揚げ')}`;
    renderAreaGenre(path);

    // 新宿の串揚げが0件の場合、あるいは未知ジャンルの場合
    const unknownPath = `/a/${encodeURIComponent('東京')}/${encodeURIComponent('新宿')}/${encodeURIComponent('存在しないジャンル')}`;
    cleanup();
    renderAreaGenre(unknownPath);
    expect(screen.getByText('探すへ戻る')).toBeTruthy();
  });
});
