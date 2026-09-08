import { SiteHeader } from './components/SiteHeader';
import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { SearchPage } from './pages/SearchPage';
import { DetailPage } from './pages/DetailPage';
import { SavedPage } from './pages/SavedPage';
import { AreaPage } from './pages/AreaPage';
import { ContactPage } from './pages/ContactPage';
import { getLangFromPath } from './i18n/language';

function DocumentLanguage() {
  const { pathname } = useLocation();

  useEffect(() => {
    const previous = document.documentElement.lang;
    document.documentElement.lang = getLangFromPath(pathname);
    return () => {
      document.documentElement.lang = previous;
    };
  }, [pathname]);

  return null;
}

export function AppRoutes() {
  return (
    <>
    <DocumentLanguage />
    <SiteHeader />
    <Routes>
      <Route path="/" element={<SearchPage />} />
      <Route path="/en/" element={<SearchPage />} />
      <Route path="/r/:id" element={<DetailPage />} />
      <Route path="/en/r/:id" element={<DetailPage />} />
      <Route path="/saved" element={<SavedPage />} />
      <Route path="/en/saved" element={<SavedPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/en/contact" element={<ContactPage />} />
      <Route path="/a/:prefecture/:area" element={<AreaPage />} />
      <Route path="/en/a/:prefecture/:area" element={<AreaPage />} />
    </Routes>
    </>
  );
}
