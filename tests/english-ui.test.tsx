import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AppRoutes } from '../src/routes';
import { DetailPage } from '../src/pages/DetailPage';
import { EmptyState } from '../src/components/EmptyState';
import { BundledCatalogRepository } from '../src/catalog/repository';
import { renderRoute } from '../src/seo/prerender';

afterEach(() => cleanup());

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  );
}

describe('English search page', () => {
  it('英語の探す画面に英訳チップと操作が出る', () => {
    renderAt('/en/search/');
    expect(screen.getAllByText('Yakiniku').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Sushi').length).toBeGreaterThan(0);
    expect(screen.getByPlaceholderText(/shop or station/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Filters' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Reset' })).toBeTruthy();
    expect(screen.getByText(/\d+ results/)).toBeTruthy();
  });

  it('英語でも日本語と同じ件数のカードが出る', () => {
    const { unmount } = renderAt('/search/');
    const jaCount = screen.getAllByRole('article').length;
    unmount();
    cleanup();
    renderAt('/en/search/');
    expect(screen.getAllByRole('article').length).toBe(jaCount);
    expect(jaCount).toBeGreaterThan(0);
  });

  it('店名は英語で出る', () => {
    const first = new BundledCatalogRepository().listStores()[0];
    renderAt('/en/search/');
    expect(screen.getByText(first.nameEn)).toBeTruthy();
  });
});

describe('English detail page', () => {
  it('英語の詳細に見出しと操作が出る', () => {
    const first = new BundledCatalogRepository().listStores()[0];
    render(
      <MemoryRouter initialEntries={[`/en/r/${first.id}`]}>
        <Routes><Route path="/en/r/:id" element={<DetailPage />} /></Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Courses')).toBeTruthy();
    expect(screen.getByText('Before you go')).toBeTruthy();
    expect(screen.getByText('Back')).toBeTruthy();
    expect(screen.getByText('Open in Maps')).toBeTruthy();
    expect(screen.getByRole('heading', { level: 1, name: first.nameEn })).toBeTruthy();
  });

  it('英語の未知IDは英語の案内と探す導線がある', () => {
    render(
      <MemoryRouter initialEntries={['/en/r/no-such-shop']}>
        <Routes><Route path="/en/r/:id" element={<DetailPage />} /></Routes>
      </MemoryRouter>,
    );
    expect(screen.getByText('Shop not found')).toBeTruthy();
    const back = screen.getByText('Back to search');
    expect(back.closest('a')?.getAttribute('href')).toBe('/en/search/');
  });
});

describe('English saved page', () => {
  it('英語の保存画面に見出しと空状態が出る', () => {
    localStorage.clear();
    renderAt('/en/saved');
    expect(screen.getByText('Saved shops')).toBeTruthy();
    expect(screen.getByText('No saved shops yet')).toBeTruthy();
  });
});

describe('English empty state', () => {
  it('英語パスでは既定の空状態が英語になる', () => {
    render(
      <MemoryRouter initialEntries={['/en/']}>
        <EmptyState />
      </MemoryRouter>,
    );
    expect(screen.getByText('No shops match these filters')).toBeTruthy();
  });
});

describe('English prerender', () => {
  it('/en/search/ の断片に英語UIと英語店名が出る', () => {
    const html = renderRoute('/en/search/');
    expect(html).toContain('Yakiniku');
    expect(html).toContain('results');
    const first = new BundledCatalogRepository().listStores()[0];
    expect(html).toContain(first.nameEn);
  });

  it('英語詳細の断片に英語見出しと英語店名が出る', () => {
    const first = new BundledCatalogRepository().listStores()[0];
    const html = renderRoute(`/en/r/${first.id}`);
    expect(html).toContain('Courses');
    expect(html).toContain(first.nameEn);
  });

  it('/en/a/... の断片に英語エリア名が出る', () => {
    const html = renderRoute(`/en/a/${encodeURIComponent('東京')}/${encodeURIComponent('新宿')}/`);
    expect(html).toContain('All-you-can-eat in Shinjuku');
  });
});
