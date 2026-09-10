import { existsSync, readFileSync } from 'node:fs';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { SiteHeader } from '../src/components/SiteHeader';

function renderHeader(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <SiteHeader />
    </MemoryRouter>,
  );
}

describe('brand', () => {
  it.each([
    { path: '/', name: 'タベホー ホーム', href: '/' },
    { path: '/en/', name: 'Tabeho home', href: '/en/' },
  ])('uses the local logo in the $name link', ({ path, name, href }) => {
    renderHeader(path);

    const homeLink = screen.getByRole('link', { name });
    expect(homeLink.getAttribute('href')).toBe(href);
    const logo = homeLink.querySelector('img');
    expect(logo?.getAttribute('src')).toBe('/brand/tabeho-logo-header.png');
    expect(logo?.getAttribute('alt')).toBe('');
  });

  it('uses the local symbol PNG as the favicon', () => {
    const html = readFileSync('index.html', 'utf8');

    expect(html).toContain('<link rel="icon" type="image/png" href="/brand/tabeho-symbol.png" />');
    expect(existsSync('public/brand/tabeho-symbol.png')).toBe(true);
  });
});
