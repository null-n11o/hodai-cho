import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from '../src/routes';
import { BundledCatalogRepository } from '../src/catalog/repository';

afterEach(() => cleanup());

function renderArea(prefecture: string, area: string) {
  render(
    <MemoryRouter initialEntries={[`/a/${encodeURIComponent(prefecture)}/${encodeURIComponent(area)}`]}>
      <AppRoutes />
    </MemoryRouter>,
  );
}

describe('AreaPage', () => {
  it('そのエリアの店だけ出て件数が表示される', () => {
    renderArea('東京', '新宿');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('新宿の食べ放題');
    expect(screen.getByText(/\d+件/)).toBeTruthy();
  });

  it('エリア一覧は10件ずつ表示しさらに表示で追加する', () => {
    const total = new BundledCatalogRepository().listStores().filter((store) => store.prefecture === '東京' && store.area === '新宿').length;
    renderArea('東京', '新宿');
    expect(screen.getAllByRole('article')).toHaveLength(Math.min(total, 10));
    fireEvent.click(screen.getByRole('button', { name: 'さらに表示' }));
    expect(screen.getAllByRole('article')).toHaveLength(Math.min(total, 20));
  });

  it('未知エリアで落ちず探すへの導線がある', () => {
    renderArea('東京', 'ないエリア');
    expect(screen.getByText('探すへ戻る')).toBeTruthy();
    expect(screen.getByRole('contentinfo')).toBeTruthy();
  });
});
