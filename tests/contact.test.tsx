import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ContactPage } from '../src/pages/ContactPage';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('ContactPage', () => {
  it('修正依頼フォームと参加方法が表示される', () => {
    render(<MemoryRouter initialEntries={['/contact']}><ContactPage /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'みんなで更新する、食べ放題の条件帳' })).toBeTruthy();
    expect(screen.getByLabelText('店名・エリア')).toBeTruthy();
    expect(screen.getByLabelText('内容')).toBeTruthy();
    expect(screen.getByText('運営が公式情報や訪問情報を確認する')).toBeTruthy();
  });

  it('入力内容からGitHubの下書きURLを開く', () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    render(<MemoryRouter initialEntries={['/contact']}><ContactPage /></MemoryRouter>);
    fireEvent.change(screen.getByLabelText('店名・エリア'), { target: { value: '蔵部 銀座 / 銀座' } });
    fireEvent.change(screen.getByLabelText('内容'), { target: { value: 'ランチは税込2000円で、ご飯と味噌汁がおかわり自由でした。' } });
    fireEvent.change(screen.getByLabelText(/公式ページ・参考URL/), { target: { value: 'https://example.com/menu' } });
    fireEvent.click(screen.getByRole('button', { name: 'GitHubの投稿画面を開く' }));
    expect(open).toHaveBeenCalledTimes(1);
    const opened = String(open.mock.calls[0][0]);
    expect(opened).toContain('github.com/null-n11o/hodai-cho/issues/new');
    expect(new URL(opened).searchParams.get('title')).toContain('蔵部 銀座 / 銀座');
    expect(new URL(opened).searchParams.get('body')).toContain('ランチは税込2000円');
    expect(screen.getByRole('status').textContent).toContain('投稿内容をGitHubの下書きにしました');
  });

  it('店名・エリアを入力して候補を絞り込み、選択できる', () => {
    render(<MemoryRouter initialEntries={['/contact']}><ContactPage /></MemoryRouter>);
    const storeInput = screen.getByRole('combobox', { name: '店名・エリア' });
    fireEvent.change(storeInput, { target: { value: '蔵部' } });
    const suggestions = within(screen.getByRole('listbox')).getAllByRole('option');
    expect(suggestions).toHaveLength(1);
    fireEvent.click(within(screen.getByRole('listbox')).getByRole('option', { name: /蔵部 銀座/ }));
    expect((storeInput as HTMLInputElement).value).toBe('小布施 寄り付き料理 蔵部 銀座 / 銀座');
    expect(storeInput.getAttribute('aria-expanded')).toBe('false');
  });

  it('英語URLでは英語の案内と検索導線になる', () => {
    render(<MemoryRouter initialEntries={['/en/contact']}><ContactPage /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'A community-updated guide to all-you-can-eat' })).toBeTruthy();
    expect(screen.getByRole('link', { name: /find a shop/i }).getAttribute('href')).toBe('/en/');
  });
});
