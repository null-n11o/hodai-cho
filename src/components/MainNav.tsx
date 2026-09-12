import { NavLink, useLocation } from 'react-router-dom';
import { dictionary, getLangFromPath, searchPath } from '../i18n/language';

function tabClass(active: boolean): string {
  return `min-h-[44px] flex-1 py-3 text-center font-bold transition-colors ${
    active ? 'text-ivory' : 'text-stonedim'
  }`;
}

export function MainNav() {
  const { pathname } = useLocation();
  const lang = getLangFromPath(pathname);
  const dict = dictionary(lang);
  if (pathname === '/' || pathname === '/en' || pathname === '/en/') return null;
  const searchTo = searchPath(lang);
  const savedTo = lang === 'en' ? '/en/saved' : '/saved';
  const contactTo = lang === 'en' ? '/en/contact' : '/contact';
  return (
    <nav aria-label={dict.nav.main} className="mobile-nav fixed inset-x-0 bottom-0 z-40 border-t border-stonedim/40 bg-ink">
      <div className="mx-auto flex w-full max-w-lg items-center md:max-w-3xl lg:max-w-5xl" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <NavLink to={searchTo} end className={({ isActive }) => tabClass(isActive)}>
          {dict.nav.search}
        </NavLink>
        <NavLink to={savedTo} className={({ isActive }) => tabClass(isActive)}>
          {dict.nav.saved}
        </NavLink>
        <NavLink to={contactTo} className={({ isActive }) => tabClass(isActive)}>
          {dict.nav.contact}
        </NavLink>
      </div>
    </nav>
  );
}
