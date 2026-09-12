import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from '../src/routes';
import { searchPath } from '../src/i18n/language';
import { MainNav } from '../src/components/MainNav';
import { BundledCatalogRepository } from '../src/catalog/repository';

afterEach(cleanup);

describe('first-visit landing page', () => {
  it.each([
    ['/', 'お肉をがっつり', '焼肉', '料理ジャンル'],
    ['/en/', 'Room for dessert', 'スイーツ', 'Cuisine'],
  ])('keeps %s as a landing page and opens filtered search from a craving', (path, label, genre, field) => {
    render(<MemoryRouter initialEntries={[path]}><AppRoutes /></MemoryRouter>);
    expect(screen.queryByRole('searchbox')).toBeNull();
    fireEvent.click(screen.getByRole('link', { name: label }));
    expect(screen.getByRole('searchbox')).toBeTruthy();
    expect((screen.getByRole('combobox', { name: field }) as HTMLSelectElement).value).toBe(genre);
    expect(screen.queryByRole('group', { name: /今の気分|Follow your appetite/ })).toBeNull();
  });

  it('ignores an unknown genre in a direct search URL', () => {
    render(<MemoryRouter initialEntries={['/search/?genre=unknown']}><AppRoutes /></MemoryRouter>);
    expect((screen.getByRole('combobox', { name: '料理ジャンル' }) as HTMLSelectElement).value).toBe('');
  });

  it('opens Japanese search from the primary action', () => {
    render(<MemoryRouter initialEntries={['/']}><AppRoutes /></MemoryRouter>);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('お腹いっぱい、今日は何食べる？');
    expect(screen.queryByText('ジャンルイメージ')).toBeNull();
    fireEvent.click(screen.getByRole('link', { name: '食べ放題を探す' }));
    expect(screen.getByRole('searchbox')).toBeTruthy();
  });

  it('opens English search and switches the LP language', () => {
    render(<MemoryRouter initialEntries={['/en/']}><AppRoutes /></MemoryRouter>);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('A big appetite.What’s on your menu?');
    expect(screen.getAllByRole('link', { name: 'Find all-you-can-eat' })[0].getAttribute('href')).toBe('/en/search/');
    fireEvent.click(screen.getByRole('link', { name: 'Find all-you-can-eat' }));
    expect(screen.getByRole('searchbox')).toBeTruthy();
    cleanup();
    render(<MemoryRouter initialEntries={['/en/']}><AppRoutes /></MemoryRouter>);
    fireEvent.click(screen.getByRole('link', { name: /switch to japanese/i }));
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('お腹いっぱい、今日は何食べる？');
  });

  it.each([
    ['/', '条件を指定して探す'],
    ['/en/', 'Search by your preferences'],
  ])('opens search from the secondary action on %s', (path, action) => {
    render(<MemoryRouter initialEntries={[path]}><AppRoutes /></MemoryRouter>);
    fireEvent.click(screen.getByRole('link', { name: action }));
    expect(screen.getByRole('searchbox')).toBeTruthy();
  });

  it.each(['/', '/en/'])('hides mobile navigation on LP %s', (path) => {
    render(<MemoryRouter initialEntries={[path]}><MainNav /></MemoryRouter>);
    expect(screen.queryByRole('navigation')).toBeNull();
  });

  it.each(['/search/', '/en/search/'])('keeps mobile navigation on search route %s', (path) => {
    render(<MemoryRouter initialEntries={[path]}><MainNav /></MemoryRouter>);
    expect(screen.getByRole('navigation')).toBeTruthy();
  });

  it('routes all Japanese and English return links to their search entry', () => {
    const first = new BundledCatalogRepository().listStores()[0];
    const cases = [
      ['/r/no-such-shop', '/search/', /探すへ戻る$/],
      [`/r/${first.id}`, '/search/', /戻る$/],
      ['/a/東京/ないエリア', '/search/', /探すへ戻る$/],
      ['/saved', '/search/', /探すへ戻る$/],
      ['/contact', '/search/', /店を探す$/],
      ['/en/r/no-such-shop', '/en/search/', /Back to search$/],
      [`/en/r/${first.id}`, '/en/search/', /Back$/],
      ['/en/a/東京/ないエリア', '/en/search/', /Back to search$/],
      ['/en/saved', '/en/search/', /Back to search$/],
      ['/en/contact', '/en/search/', /Find a shop$/],
    ] as const;
    for (const [path, expected, returnName] of cases) {
      const view = render(<MemoryRouter initialEntries={[path]}><AppRoutes /></MemoryRouter>);
      const returnLink = within(screen.getByRole('main')).getByRole('link', { name: returnName });
      expect(returnLink.getAttribute('href')).toBe(expected);
      fireEvent.click(returnLink);
      expect(screen.getByRole('searchbox')).toBeTruthy();
      view.unmount();
      cleanup();
    }
  });

  it('keeps logo on the LP while search navigation points to search', () => {
    render(<MemoryRouter initialEntries={['/search/']}><AppRoutes /></MemoryRouter>);
    expect(screen.getByRole('link', { name: 'タベホー ホーム' }).getAttribute('href')).toBe('/');
    expect(screen.getByRole('link', { name: '探す' }).getAttribute('href')).toBe('/search/');
  });

  it('provides shared language-specific search paths', () => {
    expect(searchPath('ja')).toBe('/search/');
    expect(searchPath('en')).toBe('/en/search/');
  });
});
