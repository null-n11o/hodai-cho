import { useLocation } from 'react-router-dom';
import { en } from './en';
import { ja } from './ja';
import type { Dict } from './ja';

export type Lang = 'ja' | 'en';

export const LANG_STORAGE_KEY = 'hodai-cho-lang';

export function getLangFromPath(pathname: string): Lang {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'ja';
}

export function toEnPath(pathname: string): string {
  if (getLangFromPath(pathname) === 'en') return pathname;
  return pathname === '/' ? '/en/' : `/en${pathname}`;
}

export function toJaPath(pathname: string): string {
  if (getLangFromPath(pathname) === 'ja') return pathname;
  const stripped = pathname.replace(/^\/en(?=\/|$)/, '');
  return stripped === '' ? '/' : stripped;
}

export function loadLanguage(): Lang {
  try {
    const raw = localStorage.getItem(LANG_STORAGE_KEY);
    return raw === 'en' || raw === 'ja' ? raw : 'ja';
  } catch {
    return 'ja';
  }
}

export function saveLanguage(lang: Lang): void {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    // SSR やプライベートモードでは無視する
  }
}

export function dictionary(lang: Lang): Dict {
  return lang === 'en' ? en : ja;
}

export function useLanguage(): Lang {
  const { pathname } = useLocation();
  return getLangFromPath(pathname);
}
