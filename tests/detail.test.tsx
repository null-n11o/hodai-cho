import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { BundledCatalogRepository } from '../src/catalog/repository';
import { DetailPage } from '../src/pages/DetailPage';

afterEach(() => cleanup());

function renderDetail(id: string) {
  render(
    <MemoryRouter initialEntries={[`/r/${id}`]}>
      <Routes><Route path="/r/:id" element={<DetailPage />} /></Routes>
    </MemoryRouter>,
  );
}

describe('DetailPage', () => {
  it('未知IDで落ちず探すへの導線がある', () => {
    renderDetail('no-such-shop');
    expect(screen.getByText('店が見つからない')).toBeTruthy();
    expect(screen.getByText('探すへ戻る')).toBeTruthy();
    expect(screen.getByRole('contentinfo')).toBeTruthy();
  });

  it('PC幅では本文幅が広がり見出しと操作が2列になる', () => {
    const first = new BundledCatalogRepository().listStores()[0];
    renderDetail(first.id);
    expect(screen.getByRole('main').className).toContain('md:max-w-3xl');
    expect(screen.getByTestId('hero').className).toContain('md:grid-cols-2');
    expect(screen.getByTestId('actions').className).toContain('md:flex-row');
  });

  it('画像注記を画像の直下ではなくページ下部にまとめる', () => {
    const first = new BundledCatalogRepository().listStores()[0];
    renderDetail(first.id);
    expect(screen.getByText('写真はジャンルイメージです。')).toBeTruthy();
    expect(screen.queryByText('ジャンルイメージ（店舗の写真ではありません）')).toBeNull();
  });
});
