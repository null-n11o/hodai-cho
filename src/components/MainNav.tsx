import { NavLink, useLocation } from 'react-router-dom';
import { LanguageToggle } from './LanguageToggle';
import { dictionary, getLangFromPath } from '../i18n/language';

function tabClass(active: boolean): string {
  return `min-h-[44px] flex-1 py-3 text-center font-bold transition-colors ${
    active ? 'text-ivory' : 'text-stonedim'
  }`;
}

export function MainNav() {
  const { pathname } = useLocation();
  const lang = getLangFromPath(pathname);
  const dict = dictionary(lang);
  const searchTo = lang === 'en' ? '/en/' : '/';
  const savedTo = lang === 'en' ? '/en/saved' : '/saved';
  return (
    <nav aria-label={dict.nav.main} className="fixed inset-x-0 bottom-0 z-40 border-t border-stonedim/40 bg-ink">
      <div className="mx-auto flex w-full max-w-lg items-center md:max-w-3xl lg:max-w-5xl" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <NavLink to={searchTo} end className={({ isActive }) => tabClass(isActive)}>
          {dict.nav.search}
        </NavLink>
        <NavLink to={savedTo} className={({ isActive }) => tabClass(isActive)}>
          {dict.nav.saved}
        </NavLink>
        <div className="flex items-center px-2 py-1">
          <LanguageToggle />
        </div>
      </div>
    </nav>
  );
}
