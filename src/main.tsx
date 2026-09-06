import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, NavLink } from 'react-router-dom';
import './index.css';
import { AppRoutes } from './routes';

function tabClass(active: boolean): string {
  return `min-h-[44px] flex-1 py-3 text-center font-bold transition-colors ${
    active ? 'text-ivory' : 'text-stonedim'
  }`;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <div className="min-h-svh bg-ink">
        <AppRoutes />
        <nav aria-label="メイン" className="fixed inset-x-0 bottom-0 z-40 border-t border-stonedim/40 bg-ink">
          <div className="mx-auto flex w-full max-w-lg md:max-w-3xl lg:max-w-5xl" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
            <NavLink to="/" end className={({ isActive }) => tabClass(isActive)}>
              探す
            </NavLink>
            <NavLink to="/saved" className={({ isActive }) => tabClass(isActive)}>
              保存
            </NavLink>
          </div>
        </nav>
      </div>
    </BrowserRouter>
  </StrictMode>,
);
