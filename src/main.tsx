import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { AppRoutes } from './routes';
import { MainNav } from './components/MainNav';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <div className="min-h-svh bg-ink">
        <AppRoutes />
        <MainNav />
      </div>
    </BrowserRouter>
  </StrictMode>,
);
