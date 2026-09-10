import { Link, NavLink } from 'react-router-dom';
import { dictionary, useLanguage } from '../i18n/language';
import { LanguageToggle } from './LanguageToggle';

export function SiteHeader() {
  const lang = useLanguage();
  const dict = dictionary(lang);
  const base = lang === 'en' ? '/en/' : '/';
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to={base} className="brand" aria-label={lang === 'en' ? 'Tabeho home' : 'タベホー ホーム'}>
          <img
            className="brand-logo"
            src="/brand/tabeho-logo-header.png"
            alt=""
            width={2172}
            height={724}
          />
        </Link>
        <span className="brand-description">{lang === 'en' ? 'Your all-you-can-eat guide' : '食べ放題に、迷わない。'}</span>
        <nav className="header-nav" aria-label={lang === 'en' ? 'Site navigation' : 'サイトナビゲーション'}>
          <NavLink end to={base}>{dict.nav.search}</NavLink>
          <NavLink to={`${base}saved`}>{dict.nav.saved}</NavLink>
          <NavLink to={`${base}contact`}>{dict.nav.contact}</NavLink>
        </nav>
        <LanguageToggle />
      </div>
    </header>
  );
}
