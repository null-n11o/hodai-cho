import { Link, useLocation } from 'react-router-dom';
import { dictionary, getLangFromPath, saveLanguage, toEnPath, toJaPath } from '../i18n/language';

export function LanguageToggle() {
  const { pathname } = useLocation();
  const lang = getLangFromPath(pathname);
  const dict = dictionary(lang);

  if (lang === 'en') {
    const to = toJaPath(pathname);
    return (
      <Link
        to={to}
        aria-label={dict.lang.toJapaneseLabel}
        onClick={() => saveLanguage('ja')}
        className="inline-block min-h-[44px] min-w-[44px] rounded-lg border border-stonedim/60 px-4 py-2 text-center text-sm font-bold text-ivory"
      >
        {dict.lang.toJapanese}
      </Link>
    );
  }

  const to = toEnPath(pathname);
  return (
    <Link
      to={to}
      aria-label={dict.lang.toEnglishLabel}
      onClick={() => saveLanguage('en')}
      className="inline-block min-h-[44px] min-w-[44px] rounded-lg border border-stonedim/60 px-4 py-2 text-center text-sm font-bold text-ivory"
    >
      {dict.lang.toEnglish}
    </Link>
  );
}
