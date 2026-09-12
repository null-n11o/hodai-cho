import { Link, useParams } from 'react-router-dom';
import { BundledCatalogRepository } from '../catalog/repository';
import type { CatalogRepository } from '../catalog/repository';
import type { Genre } from '../catalog/schema';
import { AREA_EN } from '../catalog/en-names';
import { en } from '../i18n/en';
import { StoreCard } from '../components/StoreCard';
import { EmptyState } from '../components/EmptyState';
import { loadFavorites, toggleFavorite } from '../favorites/storage';
import { useState } from 'react';
import { dictionary, searchPath, useLanguage } from '../i18n/language';
import { areaCountLine, areaTitle, prefName } from '../i18n/format';
import { SiteDisclaimer } from '../components/SiteDisclaimer';

const repository: CatalogRepository = new BundledCatalogRepository();
const PAGE_SIZE = 10;

export function AreaPage() {
  const lang = useLanguage();
  const dict = dictionary(lang);
  const t = dict.area;
  const { prefecture, area, genre } = useParams();
  const [savedIds, setSavedIds] = useState<string[]>(() => loadFavorites());
  const [pagination, setPagination] = useState({ key: '', count: PAGE_SIZE });

  const inArea = repository
    .listStores()
    .filter((s) => s.prefecture === prefecture && s.area === area);

  const stores = genre
    ? inArea.filter((s) => s.genres.includes(genre as Genre) || (s.subGenres ?? []).includes(genre as Genre))
    : inArea;

  const paginationKey = `${prefecture ?? ''}/${area ?? ''}/${genre ?? ''}`;
  const visibleCount = pagination.key === paginationKey ? pagination.count : PAGE_SIZE;
  const visibleStores = stores.slice(0, visibleCount);

  const onToggleSave = (id: string) => {
    setSavedIds(toggleFavorite(id));
  };

  const searchTo = searchPath(lang);
  const areaTo = lang === 'en'
    ? `/en/a/${encodeURIComponent(prefecture ?? '')}/${encodeURIComponent(area ?? '')}`
    : `/a/${encodeURIComponent(prefecture ?? '')}/${encodeURIComponent(area ?? '')}`;

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
        <SiteDisclaimer />
      </main>
    );
  }

  const shownArea = area ?? '';
  const shownPref = prefecture ?? '';
  const areaLabel = lang === 'en' ? (AREA_EN[shownArea] ?? shownArea) : shownArea;
  const genreLabel = genre
    ? lang === 'en'
      ? (en.genres[genre as Genre] ?? genre)
      : genre
    : '';

  const pageHeading = genre
    ? lang === 'en'
      ? `All-you-can-eat ${genreLabel} in ${areaLabel}`
      : `${shownArea}の${genre}食べ放題`
    : areaTitle(lang, shownArea);

  return (
    <main className="site-main content-page mx-auto w-full max-w-lg overflow-x-clip bg-ink px-4 pb-24 pt-8 text-ivory md:max-w-3xl md:px-8 lg:max-w-5xl">
      <nav aria-label={lang === 'en' ? 'Breadcrumb' : 'パンくずリスト'} className="mb-3 flex flex-wrap items-center gap-1.5 text-xs text-stone">
        <Link to={searchTo} className="hover:underline">
          {dict.nav.search}
        </Link>
        <span aria-hidden="true">/</span>
        {genre ? (
          <>
            <Link to={areaTo} className="hover:underline">
              {areaTitle(lang, shownArea)}
            </Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page" className="text-ivory">
              {pageHeading}
            </span>
          </>
        ) : (
          <span aria-current="page" className="text-ivory">
            {areaTitle(lang, shownArea)}
          </span>
        )}
      </nav>

      <p className="text-xs tracking-widest text-stone">
        {prefName(lang, shownPref)} / {genre ? 'AREA & CUISINE' : 'AREA'}
      </p>
      <h1 className="mt-2 text-2xl font-bold md:text-3xl">{pageHeading}</h1>
      <p className="mt-2 text-sm text-stone" aria-live="polite">
        {areaCountLine(lang, stores.length)}
      </p>
      <div data-testid="results" className="results-list mt-4">
        {visibleStores.map((store) => (
          <StoreCard key={store.id} store={store} saved={savedIds.includes(store.id)} onToggleSave={onToggleSave} />
        ))}
      </div>
      {visibleCount < stores.length ? (
        <div className="load-more-wrap">
          <button type="button" className="load-more-button" onClick={() => setPagination((previous) => ({
            key: paginationKey,
            count: Math.min((previous.key === paginationKey ? previous.count : PAGE_SIZE) + PAGE_SIZE, stores.length),
          }))}>
            {dict.search.showMore}
          </button>
        </div>
      ) : null}
      <div className="mt-6 flex flex-wrap gap-3">
        {genre && inArea.length > 0 ? (
          <Link to={areaTo} className="inline-block min-h-[44px] rounded-lg border border-stonedim/60 px-6 py-3 font-bold text-ivory">
            {lang === 'en' ? `All in ${areaLabel}` : `${shownArea}の全食べ放題`}
          </Link>
        ) : null}
        <Link to={searchTo} className="inline-block min-h-[44px] rounded-lg border border-stonedim/60 px-6 py-3 font-bold text-ivory">
          {t.changeFilters}
        </Link>
      </div>
      <SiteDisclaimer />
    </main>
  );
}
