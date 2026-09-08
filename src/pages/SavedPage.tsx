import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BundledCatalogRepository } from '../catalog/repository';
import type { CatalogRepository } from '../catalog/repository';
import { StoreCard } from '../components/StoreCard';
import { EmptyState } from '../components/EmptyState';
import { loadFavorites, toggleFavorite } from '../favorites/storage';
import { dictionary, useLanguage } from '../i18n/language';
import { SiteDisclaimer } from '../components/SiteDisclaimer';

const repository: CatalogRepository = new BundledCatalogRepository();
const PAGE_SIZE = 10;

export function SavedPage() {
  const lang = useLanguage();
  const dict = dictionary(lang);
  const t = dict.saved;
  const [savedIds, setSavedIds] = useState<string[]>(() => loadFavorites());
  const [pagination, setPagination] = useState({ key: '', count: PAGE_SIZE });

  const onToggleSave = (id: string) => {
    setSavedIds(toggleFavorite(id));
  };

  const savedStores = savedIds
    .map((id) => repository.getStore(id))
    .filter((s): s is NonNullable<typeof s> => s !== undefined);
  const paginationKey = savedIds.join('\u0000');
  const visibleCount = pagination.key === paginationKey ? pagination.count : PAGE_SIZE;
  const visibleStores = savedStores.slice(0, visibleCount);

  const searchTo = lang === 'en' ? '/en/' : '/';

  return (
    <main className="site-main content-page mx-auto w-full max-w-lg overflow-x-clip bg-ink px-4 pb-24 pt-8 text-ivory md:max-w-3xl md:px-8 lg:max-w-5xl">
      <h1 className="text-2xl font-bold">{t.title}</h1>
      <div data-testid="results" className="results-list mt-4">
        {savedStores.length === 0 ? (
          <EmptyState
            title={t.emptyTitle}
            advice={[t.emptyAdvice]}
            action={
              <Link to={searchTo} className="inline-block min-h-[44px] rounded-lg bg-aka px-6 py-3 font-bold text-ivory">
                {t.backToSearch}
              </Link>
            }
          />
        ) : (
          visibleStores.map((store) => (
            <StoreCard key={store.id} store={store} saved onToggleSave={onToggleSave} />
          ))
        )}
      </div>
      {visibleCount < savedStores.length ? (
        <div className="load-more-wrap">
          <button type="button" className="load-more-button" onClick={() => setPagination((previous) => ({
            key: paginationKey,
            count: Math.min((previous.key === paginationKey ? previous.count : PAGE_SIZE) + PAGE_SIZE, savedStores.length),
          }))}>
            {dict.search.showMore}
          </button>
        </div>
      ) : null}
      <SiteDisclaimer />
    </main>
  );
}
