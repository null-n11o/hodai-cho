import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { FilterSheet } from '../src/components/FilterSheet';

afterEach(cleanup);

describe('FilterSheet keyboard navigation', () => {
  it('moves focus into the dialog and closes with Escape', () => {
    const close = vi.fn();
    render(<MemoryRouter><FilterSheet open slot="all" timeLimit="all" budget={undefined} sort="recommend" onChange={() => {}} onClose={close} /></MemoryRouter>);
    const dialog = screen.getByRole('dialog');
    expect(dialog.contains(document.activeElement)).toBe(true);
    fireEvent.keyDown(dialog, { key: 'Escape' });
    expect(close).toHaveBeenCalledOnce();
  });
});
