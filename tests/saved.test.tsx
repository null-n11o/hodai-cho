import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SavedPage } from '../src/pages/SavedPage';

afterEach(() => cleanup());

describe('SavedPage', () => {
  it('PC幅では本文幅が広がり保存一覧が複数列グリッドになる', () => {
    render(<MemoryRouter><SavedPage /></MemoryRouter>);
    expect(screen.getByRole('main').className).toContain('md:max-w-3xl');
    const results = screen.getByTestId('results');
    expect(results.className).toContain('md:grid-cols-2');
    expect(results.className).toContain('xl:grid-cols-3');
  });
});
