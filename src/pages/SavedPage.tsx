import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BundledCatalogRepository } from '../catalog/repository';
import type { CatalogRepository } from '../catalog/repository';
import { StoreCard } from '../components/StoreCard';
import { EmptyState } from '../components/EmptyState';
import { loadFavorites, toggleFavorite } from '../favorites/storage';
import { dictionary, useLanguage } from '../i18n/language';

const repository: CatalogRepository = new BundledCatalogRepository();

export function SavedPage() {
  const lang = useLanguage();
  const dict = dictionary(lang);
  const t = dict.saved;
  const [savedIds, setSavedIds] = useState<string[]>(() => loadFavorites());

  const onToggleSave = (id: string) => {
    setSavedIds(toggleFavorite(id));
  };

  const savedStores = savedIds
    .map((id) => repository.getStore(id))
    .filter((s): s is NonNullable<typeof s> => s !== undefined);

  const searchTo = lang === 'en' ? '/en/' : '/';

  return (
    <main className="mx-auto w-full max-w-lg overflow-x-clip bg-ink px-4 pb-24 pt-8 text-ivory md:max-w-3xl md:px-8 lg:max-w-5xl">
      <h1 className="text-2xl font-bold">{t.title}</h1>
      <div data-testid="results" className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
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
          savedStores.map((store) => (
            <StoreCard key={store.id} store={store} saved onToggleSave={onToggleSave} />
          ))
        )}
      </div>
    </main>
  );
}
