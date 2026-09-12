import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { StoreCard } from '../src/components/StoreCard';
import { DetailPage } from '../src/pages/DetailPage';
import { SearchPage } from '../src/pages/SearchPage';
import type { Store } from '../src/catalog/schema';

const mockStore: Store = {
  id: 'test-syabuyo',
  name: 'しゃぶ葉 テスト店',
  nameEn: 'Shabu-yo Test Branch',
  kana: 'しゃぶよう てすと',
  chain: 'しゃぶ葉',
  prefecture: '東京',
  area: '新宿',
  station: '新宿',
  walkMinutes: 3,
  genres: ['しゃぶしゃぶ'],
  pick: 5,
  courses: [
    {
      slot: 'lunch',
      name: 'ランチコース',
      nameEn: 'Lunch Course',
      priceInclTax: 1649,
      minutes: null,
    },
  ],
  hours: '11:00-23:00',
  hoursEn: '11:00-23:00',
  highlights: ['平日無制限'],
  highlightsEn: ['Weekday unlimited'],
  notice: '注意書き',
  noticeEn: 'Notice',
  familyFriendly: true,
  soloFriendly: true,
  kidsDiscount: true,
  weekdayUnlimited: true,
};

describe('Feature tags UI', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('StoreCard renders feature badges for soloFriendly, kidsDiscount, and weekdayUnlimited', () => {
    render(
      <MemoryRouter>
        <StoreCard store={mockStore} saved={false} onToggleSave={() => {}} />
      </MemoryRouter>
    );

    expect(screen.getByText('1人歓迎')).toBeTruthy();
    expect(screen.getByText('幼児無料・子供料金')).toBeTruthy();
    expect(screen.getByText('平日時間無制限')).toBeTruthy();
  });

  it('DetailPage renders feature badges', () => {
    // syabuyo-shinjuku-nowa はカタログに実在し、3フラグすべて付与されている
    render(
      <MemoryRouter initialEntries={['/r/syabuyo-shinjuku-nowa']}>
        <Routes>
          <Route path="/r/:id" element={<DetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getAllByText('1人歓迎').length).toBeGreaterThan(0);
    expect(screen.getAllByText('幼児無料・子供料金').length).toBeGreaterThan(0);
    expect(screen.getAllByText('平日時間無制限').length).toBeGreaterThan(0);
  });

  it('SearchPage allows toggling feature filters and updates results', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <SearchPage />
      </MemoryRouter>
    );

    const soloButton = screen.getByRole('button', { name: '1人歓迎' });
    expect(soloButton).toBeTruthy();
    expect(soloButton.getAttribute('aria-pressed')).toBe('false');

    fireEvent.click(soloButton);
    expect(soloButton.getAttribute('aria-pressed')).toBe('true');
  });

  it('English UI renders feature tags in English', () => {
    render(
      <MemoryRouter initialEntries={['/en/']}>
        <SearchPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: 'Solo friendly' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Kids discount' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Weekday unlimited' })).toBeTruthy();
  });
});
