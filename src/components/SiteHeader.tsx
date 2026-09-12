import { Link, NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { dictionary, saveLanguage, searchPath, useLanguage } from '../i18n/language';
import { LanguageToggle } from './LanguageToggle';

export function SiteHeader() {
  const lang = useLanguage();
  const dict = dictionary(lang);
  const base = lang === 'en' ? '/en/' : '/';
  const { pathname } = useLocation();
  const landing = pathname === '/' || pathname === '/en' || pathname === '/en/';
  return (
    <header className={`site-header${landing ? ' landing-header' : ''}`}>
      <div className="site-header-inner">
        <Link to={base} className="brand" aria-label={lang === 'en' ? 'Tabeho home' : 'タベホー ホーム'}>
          <img
            className="brand-logo"
            src="/brand/tabeho-logo-header.png"
            alt=""
            width={720}
            height={240}
          />
        </Link>
        {!landing && <span className="brand-description">{lang === 'en' ? 'Your all-you-can-eat guide' : '食べ放題に、迷わない。'}</span>}
        {!landing && <nav className="header-nav" aria-label={lang === 'en' ? 'Site navigation' : 'サイトナビゲーション'}>
          <NavLink to={searchPath(lang)}>{dict.nav.search}</NavLink>
          <NavLink to={`${base}saved`}>{dict.nav.saved}</NavLink>
          <NavLink to={`${base}contact`}>{dict.nav.contact}</NavLink>
        </nav>}
        {landing ? (
          <nav className="landing-language" aria-label={lang === 'en' ? 'Language' : '言語'}>
            <Link to="/" aria-label="Switch to Japanese" aria-current={lang === 'ja' ? 'page' : undefined} onClick={() => saveLanguage('ja')}>日本語</Link>
            <span aria-hidden="true" />
            <Link to="/en/" aria-label="Switch to English" aria-current={lang === 'en' ? 'page' : undefined} onClick={() => saveLanguage('en')}>EN</Link>
          </nav>
        ) : <LanguageToggle />}
      </div>
    </header>
  );
}
