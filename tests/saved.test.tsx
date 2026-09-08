import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SavedPage } from '../src/pages/SavedPage';

afterEach(() => cleanup());

describe('SavedPage', () => {
  it('保存0件から検索に戻れる', () => {
    render(<MemoryRouter><SavedPage /></MemoryRouter>);
    expect(screen.getByText('まだ保存した店はない')).toBeTruthy();
    expect(screen.getByRole('link', { name: '探すへ戻る' }).getAttribute('href')).toBe('/');
  });
});
