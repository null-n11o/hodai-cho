import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from '../src/routes';
import { searchPath } from '../src/i18n/language';
import { MainNav } from '../src/components/MainNav';
import { BundledCatalogRepository } from '../src/catalog/repository';

afterEach(cleanup);

describe('first-visit landing page', () => {
  it('opens Japanese search from the primary action', () => {
    render(<MemoryRouter initialEntries={['/']}><AppRoutes /></MemoryRouter>);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('今日は好きなだけ食べよう。');
    expect(screen.queryByText('ジャンルイメージ')).toBeNull();
    fireEvent.click(screen.getByRole('link', { name: '食べ放題を探す' }));
    expect(screen.getByRole('searchbox')).toBeTruthy();
  });

  it('opens English search and switches the LP language', () => {
    render(<MemoryRouter initialEntries={['/en/']}><AppRoutes /></MemoryRouter>);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Today, eat to your heart’s content.');
    expect(screen.getAllByRole('link', { name: 'Find all-you-can-eat' })[0].getAttribute('href')).toBe('/en/search/');
    fireEvent.click(screen.getByRole('link', { name: 'Find all-you-can-eat' }));
    expect(screen.getByRole('searchbox')).toBeTruthy();
    cleanup();
    render(<MemoryRouter initialEntries={['/en/']}><AppRoutes /></MemoryRouter>);
    fireEvent.click(screen.getByRole('link', { name: /switch to japanese/i }));
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('今日は好きなだけ食べよう。');
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
      ['/r/no-such-shop', '/search/'],
      [`/r/${first.id}`, '/search/'],
      [`/a/${encodeURIComponent(first.prefecture)}/${encodeURIComponent(first.area)}`, '/search/'],
      ['/saved', '/search/'],
      ['/contact', '/search/'],
      ['/en/r/no-such-shop', '/en/search/'],
      [`/en/r/${first.id}`, '/en/search/'],
      [`/en/a/${encodeURIComponent(first.prefecture)}/${encodeURIComponent(first.area)}`, '/en/search/'],
      ['/en/saved', '/en/search/'],
      ['/en/contact', '/en/search/'],
    ];
    for (const [path, expected] of cases) {
      const view = render(<MemoryRouter initialEntries={[path]}><AppRoutes /></MemoryRouter>);
      expect(screen.getAllByRole('link').some((link) => link.getAttribute('href') === expected)).toBe(true);
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
