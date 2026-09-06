import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { DetailPage } from '../src/pages/DetailPage';

describe('DetailPage', () => {
  it('未知IDで落ちず探すへの導線がある', () => {
    render(
      <MemoryRouter initialEntries={['/r/no-such-shop']}>
        <Routes><Route path="/r/:id" element={<DetailPage />} /></Routes>
      </MemoryRouter>,
    );
    expect(screen.getByText('店が見つからない')).toBeTruthy();
    expect(screen.getByText('探すへ戻る')).toBeTruthy();
  });
});
