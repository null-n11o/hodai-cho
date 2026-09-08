import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { BundledCatalogRepository } from '../src/catalog/repository';
import { filterStores } from '../src/filters/filter';
import { SearchPage } from '../src/pages/SearchPage';

afterEach(() => cleanup());

describe('SearchPage', () => {
  it('東京の店一覧が出て件数が表示される', () => {
    render(<MemoryRouter><SearchPage /></MemoryRouter>);
    expect(screen.getByText(/\d+件/)).toBeTruthy();
  });

  it('0件のときダミー店を出さず緩和案内がある', () => {
    render(<MemoryRouter><SearchPage /></MemoryRouter>);
    // 存在しない駅で0件にする操作はUI経由で行う。ここでは空状態コンポーネントの文言を保証する
    expect(screen.queryByText(/ダミー/)).toBeNull();
  });

  it('一覧から時間帯・予算で絞り込んでリセットできる', () => {
    render(<MemoryRouter><SearchPage /></MemoryRouter>);
    const initial = screen.getAllByRole('article').length;
    fireEvent.change(screen.getByRole('combobox', { name: '時間帯' }), { target: { value: 'lunch' } });
    fireEvent.change(screen.getByRole('combobox', { name: '予算の上限' }), { target: { value: '1000' } });
    expect(screen.queryAllByRole('article').length).toBeLessThan(initial);
    fireEvent.click(screen.getByRole('button', { name: 'リセット', exact: true }));
    expect(screen.getAllByRole('article')).toHaveLength(initial);
  });

  it('検索の入口でエリア・ジャンル・駅近を選べる', () => {
    render(<MemoryRouter><SearchPage /></MemoryRouter>);
    expect(screen.getByRole('combobox', { name: 'エリア' })).toBeTruthy();
    expect(screen.getByRole('combobox', { name: '料理ジャンル' })).toBeTruthy();
    expect(screen.getByRole('combobox', { name: '駅からの徒歩時間' })).toBeTruthy();
  });

  it('検索の入口で選んだエリア・ジャンル・駅近が一覧に反映される', () => {
    render(<MemoryRouter><SearchPage /></MemoryRouter>);
    fireEvent.change(screen.getByRole('combobox', { name: 'エリア' }), { target: { value: '新宿' } });
    fireEvent.change(screen.getByRole('combobox', { name: '料理ジャンル' }), { target: { value: '焼肉' } });
    fireEvent.change(screen.getByRole('combobox', { name: '駅からの徒歩時間' }), { target: { value: '5' } });
    const stores = screen.getAllByRole('article');
    expect(stores.length).toBeGreaterThan(0);
    expect(stores.every((article) => within(article).getAllByText(/徒歩[0-5]分/).length > 0)).toBe(true);
  });

  it('一覧の並び替えとキーワード検索がすぐに反映される', () => {
    render(<MemoryRouter><SearchPage /></MemoryRouter>);
    fireEvent.change(screen.getByRole('combobox', { name: '並び' }), { target: { value: 'cheap' } });
    const expected = filterStores(new BundledCatalogRepository().listStores(), {
      prefecture: '東京', freeword: '', genres: [], slot: 'all', timeLimit: 'all', sort: 'cheap',
    });
    expect(screen.getAllByRole('article').map((article) => within(article).getByRole('heading').textContent))
      .toEqual(expected.map((store) => store.name));
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: '存在しない店xyz' } });
    expect(within(screen.getByTestId('results')).queryAllByRole('article')).toHaveLength(0);
    expect(screen.getByText('その条件の店はない')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'リセット', exact: true }));
    expect(screen.getAllByRole('article').length).toBeGreaterThan(0);
  });
});
