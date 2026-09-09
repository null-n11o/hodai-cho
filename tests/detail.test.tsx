import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { BundledCatalogRepository } from '../src/catalog/repository';
import { DetailPage } from '../src/pages/DetailPage';
import { SiteDisclaimer } from '../src/components/SiteDisclaimer';

afterEach(() => cleanup());

function renderDetail(id: string) {
  render(
    <MemoryRouter initialEntries={[`/r/${id}`]}>
      <Routes><Route path="/r/:id" element={<DetailPage />} /></Routes>
    </MemoryRouter>,
  );
}

function storeWithReservation() {
  const store = new BundledCatalogRepository().listStores().find((s) => s.reservationUrl && s.officialUrl);
  if (!store) throw new Error('reservationUrl のある店がカタログにない');
  return store;
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

  it('アフィリエイト未設定の予約リンクは reservationUrl と rel=noreferrer を使う', () => {
    const store = storeWithReservation();
    renderDetail(store.id);
    const reserve = screen.getByRole('link', { name: '予約する' });
    expect(reserve.getAttribute('href')).toBe(store.reservationUrl);
    expect(reserve.getAttribute('target')).toBe('_blank');
    expect(reserve.getAttribute('rel')).toBe('noreferrer');
    expect(reserve.getAttribute('rel')).not.toContain('sponsored');
    expect(reserve.getAttribute('rel')).not.toContain('nofollow');
  });

  it('公式サイトは素リンクのまま sponsored を付けない', () => {
    const store = storeWithReservation();
    renderDetail(store.id);
    const official = screen.getByRole('link', { name: '公式サイト' });
    expect(official.getAttribute('href')).toBe(store.officialUrl);
    expect(official.getAttribute('target')).toBe('_blank');
    expect(official.getAttribute('rel')).toBe('noreferrer');
    expect(official.getAttribute('rel')).not.toContain('sponsored');
  });

  it('予約CTAはアフィリエイトURLがあればそれを使い sponsored を付ける', () => {
    const store = storeWithReservation();
    const affiliate = 'https://ck.jp.ap.valuecommerce.com/servlet/referral?sid=test';
    store.reservationAffiliateUrl = affiliate;
    try {
      renderDetail(store.id);
      const reserve = screen.getByRole('link', { name: '予約する' });
      expect(reserve.getAttribute('href')).toBe(affiliate);
      expect(reserve.getAttribute('target')).toBe('_blank');
      expect(reserve.getAttribute('rel')).toBe('sponsored nofollow noreferrer');
      const official = screen.getByRole('link', { name: '公式サイト' });
      expect(official.getAttribute('href')).toBe(store.officialUrl);
      expect(official.getAttribute('rel')).toBe('noreferrer');
    } finally {
      delete store.reservationAffiliateUrl;
    }
  });

  it('詳細の免責にアフィリエイト広告の表示がある', () => {
    const store = storeWithReservation();
    renderDetail(store.id);
    expect(screen.getByText('アフィリエイト広告を利用しています')).toBeTruthy();
  });
});

describe('SiteDisclaimer', () => {
  it('日本語フッターにアフィリエイト表示がある', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <SiteDisclaimer />
      </MemoryRouter>,
    );
    expect(screen.getByText('アフィリエイト広告を利用しています')).toBeTruthy();
  });

  it('英語フッターにアフィリエイト表示がある', () => {
    render(
      <MemoryRouter initialEntries={['/en/']}>
        <SiteDisclaimer />
      </MemoryRouter>,
    );
    expect(screen.getByText('This site uses affiliate advertising.')).toBeTruthy();
  });
});
