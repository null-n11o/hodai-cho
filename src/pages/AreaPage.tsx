import { Link, useParams } from 'react-router-dom';
import { BundledCatalogRepository } from '../catalog/repository';
import type { CatalogRepository } from '../catalog/repository';
import { StoreCard } from '../components/StoreCard';
import { EmptyState } from '../components/EmptyState';
import { loadFavorites, toggleFavorite } from '../favorites/storage';
import { useState } from 'react';
import { dictionary, useLanguage } from '../i18n/language';
import { areaCountLine, areaTitle, prefName } from '../i18n/format';
import { SiteDisclaimer } from '../components/SiteDisclaimer';

const repository: CatalogRepository = new BundledCatalogRepository();

export function AreaPage() {
  const lang = useLanguage();
  const dict = dictionary(lang);
  const t = dict.area;
  const { prefecture, area } = useParams();
  const [savedIds, setSavedIds] = useState<string[]>(() => loadFavorites());

  const stores = repository
    .listStores()
    .filter((s) => s.prefecture === prefecture && s.area === area);

  const onToggleSave = (id: string) => {
    setSavedIds(toggleFavorite(id));
  };

  const searchTo = lang === 'en' ? '/en/' : '/';

  if (stores.length === 0) {
    return (
      <main className="site-main content-page mx-auto w-full max-w-lg overflow-x-clip bg-ink px-4 pb-24 pt-8 text-ivory md:max-w-3xl md:px-8 lg:max-w-5xl">
        <EmptyState
          title={t.emptyTitle}
          advice={[t.emptyAdvice]}
          action={
            <Link to={searchTo} className="inline-block min-h-[44px] rounded-lg bg-aka px-6 py-3 font-bold text-ivory">
              {t.backToSearch}
            </Link>
          }
        />
      </main>
    );
  }

  const shownArea = area ?? '';
  const shownPref = prefecture ?? '';

  return (
    <main className="site-main content-page mx-auto w-full max-w-lg overflow-x-clip bg-ink px-4 pb-24 pt-8 text-ivory md:max-w-3xl md:px-8 lg:max-w-5xl">
      <p className="text-xs tracking-widest text-stone">
        {prefName(lang, shownPref)} / AREA
      </p>
      <h1 className="mt-2 text-2xl font-bold md:text-3xl">{areaTitle(lang, shownArea)}</h1>
      <p className="mt-2 text-sm text-stone" aria-live="polite">
        {areaCountLine(lang, stores.length)}
      </p>
      <div data-testid="results" className="results-list mt-4">
        {stores.map((store) => (
          <StoreCard key={store.id} store={store} saved={savedIds.includes(store.id)} onToggleSave={onToggleSave} />
        ))}
      </div>
      <div className="mt-6">
        <Link to={searchTo} className="inline-block min-h-[44px] rounded-lg border border-stonedim/60 px-6 py-3 font-bold text-ivory">
          {t.changeFilters}
        </Link>
      </div>
      <SiteDisclaimer />
    </main>
  );
}
