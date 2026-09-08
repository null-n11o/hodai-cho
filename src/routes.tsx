import { SiteHeader } from './components/SiteHeader';
import { Route, Routes } from 'react-router-dom';
import { SearchPage } from './pages/SearchPage';
import { DetailPage } from './pages/DetailPage';
import { SavedPage } from './pages/SavedPage';
import { AreaPage } from './pages/AreaPage';

export function AppRoutes() {
  return (
    <>
    <SiteHeader />
    <Routes>
      <Route path="/" element={<SearchPage />} />
      <Route path="/en/" element={<SearchPage />} />
      <Route path="/r/:id" element={<DetailPage />} />
      <Route path="/en/r/:id" element={<DetailPage />} />
      <Route path="/saved" element={<SavedPage />} />
      <Route path="/en/saved" element={<SavedPage />} />
      <Route path="/a/:prefecture/:area" element={<AreaPage />} />
      <Route path="/en/a/:prefecture/:area" element={<AreaPage />} />
    </Routes>
    </>
  );
}
