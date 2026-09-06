import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from '../src/routes';

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

  it('未知エリアで落ちず探すへの導線がある', () => {
    renderArea('東京', 'ないエリア');
    expect(screen.getByText('探すへ戻る')).toBeTruthy();
  });
});
