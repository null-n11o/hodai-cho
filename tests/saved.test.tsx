import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SavedPage } from '../src/pages/SavedPage';
import { BundledCatalogRepository } from '../src/catalog/repository';

afterEach(() => cleanup());
beforeEach(() => localStorage.clear());

describe('SavedPage', () => {
  it('保存0件から検索に戻れる', () => {
    render(<MemoryRouter><SavedPage /></MemoryRouter>);
    expect(screen.getByText('まだ保存した店はない')).toBeTruthy();
    expect(screen.getByRole('link', { name: '探すへ戻る' }).getAttribute('href')).toBe('/');
  });

  it('保存一覧は10件ずつ表示しさらに表示で残りを追加する', () => {
    const ids = new BundledCatalogRepository().listStores().slice(0, 12).map((store) => store.id);
    localStorage.setItem('hodai-cho', JSON.stringify(ids));
    render(<MemoryRouter><SavedPage /></MemoryRouter>);
    expect(screen.getAllByRole('article')).toHaveLength(10);
    fireEvent.click(screen.getByRole('button', { name: 'さらに表示' }));
    expect(screen.getAllByRole('article')).toHaveLength(12);
  });
});
