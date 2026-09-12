import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BundledCatalogRepository } from '../catalog/repository';
import type { CatalogRepository } from '../catalog/repository';
import type { Store } from '../catalog/schema';
import { getReservationLinkProps } from '../catalog/reservation';
import { CourseTable } from '../components/CourseTable';
import { EmptyState } from '../components/EmptyState';
import { GenreImage } from '../components/GenreImage';
import { SiteDisclaimer } from '../components/SiteDisclaimer';
import { loadFavorites, toggleFavorite } from '../favorites/storage';
import { dictionary, searchPath, toEnPath, useLanguage } from '../i18n/language';
import { areaTitle, prefName, stationLine } from '../i18n/format';
import { AREA_EN, STATION_EN } from '../catalog/en-names';

const repository: CatalogRepository = new BundledCatalogRepository();

function similarStores(store: Store, all: Store[]): Store[] {
  const sameChain = all.filter((s) => s.id !== store.id && s.prefecture === store.prefecture && s.chain === store.chain);
  const sameArea = all.filter(
    (s) => s.id !== store.id && s.prefecture === store.prefecture && s.chain !== store.chain && s.area === store.area,
  );
  return [...sameChain, ...sameArea].slice(0, 4);
}

export function DetailPage() {
  const lang = useLanguage();
  const dict = dictionary(lang);
  const t = dict.detail;
  const { id } = useParams();
  const [savedIds, setSavedIds] = useState<string[]>(() => loadFavorites());

  const store = id ? repository.getStore(id) : undefined;
  const searchTo = searchPath(lang);
  const similarTo = (storeId: string): string => {
    const path = `/r/${storeId}`;
    return lang === 'en' ? toEnPath(path) : path;
  };

  if (!store) {
    return (
      <main className="site-main content-page mx-auto w-full max-w-lg overflow-x-clip bg-ink px-4 pb-24 pt-8 text-ivory md:max-w-3xl md:px-8 lg:max-w-5xl">
        <EmptyState
          title={t.notFound}
          advice={[t.notFoundAdvice]}
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

  const all = repository.listStores();
  const similar = similarStores(store, all);
  const saved = savedIds.includes(store.id);
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${store.name} ${store.station}`)}`;
  const genreLine = store.genres.map((g) => dict.genres[g]).join(lang === 'en' ? ' · ' : '・');
  const shownName = lang === 'en' ? store.nameEn : store.name;
  const shownArea = lang === 'en' ? (AREA_EN[store.area] ?? store.area) : store.area;
  const shownStation = lang === 'en' ? (STATION_EN[store.station] ?? store.station) : store.station;
  const shownFacility = lang === 'en' ? (store.facilityEn ?? store.facility) : store.facility;
  const shownHours = lang === 'en' ? store.hoursEn : store.hours;
  const shownHighlights = lang === 'en' ? store.highlightsEn : store.highlights;
  const shownNotice = lang === 'en' ? store.noticeEn : store.notice;
  const featureBadges: string[] = [];
  if (store.soloFriendly) featureBadges.push(dict.features.soloFriendly);
  if (store.kidsDiscount) featureBadges.push(dict.features.kidsDiscount);
  if (store.weekdayUnlimited) featureBadges.push(dict.features.weekdayUnlimited);
  const reservation = getReservationLinkProps(store);
  const similarName = (s: Store): string => {
    const base = lang === 'en' ? s.nameEn : s.name;
    const st = lang === 'en' ? (STATION_EN[s.station] ?? s.station) : s.station;
    const line = stationLine(lang, st, s.walkMinutes);
    return lang === 'en' ? `${base} (${line})` : `${base}（${line}）`;
  };

  const onToggleSave = () => {
    setSavedIds(toggleFavorite(store.id));
  };

  const areaTo = lang === 'en'
    ? `/en/a/${encodeURIComponent(store.prefecture)}/${encodeURIComponent(store.area)}`
    : `/a/${encodeURIComponent(store.prefecture)}/${encodeURIComponent(store.area)}`;

  return (
    <main className="site-main content-page mx-auto w-full max-w-lg overflow-x-clip bg-ink px-4 pb-24 text-ivory md:max-w-3xl md:px-8 lg:max-w-5xl">
      <nav aria-label={lang === 'en' ? 'Breadcrumb' : 'パンくずリスト'} className="mt-4 mb-2 flex flex-wrap items-center gap-1.5 text-xs text-stone">
        <Link to={searchTo} className="hover:underline">
          {dict.nav.search}
        </Link>
        <span aria-hidden="true">/</span>
        <Link to={areaTo} className="hover:underline">
          {areaTitle(lang, store.area)}
        </Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page" className="text-ivory">
          {shownName}
        </span>
      </nav>

      <Link
        to={searchTo}
        className="inline-flex min-h-[44px] items-center text-sm text-stone"
      >
        {t.back}
      </Link>

      <div data-testid="hero" className="detail-hero mt-2 md:mt-4 md:grid md:grid-cols-2 md:items-start md:gap-6">
      <div>
        <GenreImage genre={store.genres[0]} />
      </div>

      <div className="mt-2 flex items-start justify-between gap-3 md:mt-0">
        <div>
          <p className="text-xs text-stone">
            {prefName(lang, store.prefecture)}・{shownArea}・{genreLine}
          </p>
          <h1 className="mt-1 text-2xl font-bold">{shownName}</h1>
          <p className="mt-1 text-sm text-stone">
            {stationLine(lang, shownStation, store.walkMinutes, shownFacility)}
          </p>
          <p className="mt-1 text-sm text-stone">{shownHours}</p>
          {featureBadges.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {featureBadges.map((badge) => (
                <span key={badge} className="rounded border border-line bg-surface px-2 py-0.5 text-xs text-muted">
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>
        <button
          type="button"
          aria-label={dict.card.save}
          aria-pressed={saved}
          onClick={onToggleSave}
          className="save-button"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>
      </div>

      <section className="detail-section mt-6" aria-label={t.courses}>
        <h2 className="text-lg font-bold">{t.courses}</h2>
        <div className="mt-2">
          <CourseTable courses={store.courses} />
        </div>
      </section>

      <section className="detail-section mt-6" aria-label={t.highlights}>
        <h2 className="text-lg font-bold">{t.highlights}</h2>
        <ul className="mt-2 space-y-1 text-sm text-ivory">
          {shownHighlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      </section>

      <section className="detail-section mt-6" aria-label={t.beforeYouGo}>
        <h2 className="text-lg font-bold">{t.beforeYouGo}</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone">{shownNotice}</p>
      </section>

      <div data-testid="actions" className="mt-6 flex flex-col gap-2 md:flex-row">
        <a
          href={mapUrl}
          target="_blank"
          rel="noreferrer"
          className="min-h-[44px] rounded-lg border border-stonedim/60 px-4 py-3 text-center font-bold text-ivory md:flex-1"
        >
          {t.maps}
        </a>
        {store.officialUrl ? (
          <a
            href={store.officialUrl}
            target="_blank"
            rel="noreferrer"
            className="min-h-[44px] rounded-lg border border-stonedim/60 px-4 py-3 text-center font-bold text-ivory md:flex-1"
          >
            {t.official}
          </a>
        ) : null}
        {reservation ? (
          <a
            href={reservation.href}
            target="_blank"
            rel={reservation.rel}
            className="min-h-[44px] rounded-lg bg-aka px-4 py-3 text-center font-bold text-ivory md:flex-1"
          >
            {t.reserve}
          </a>
        ) : null}
      </div>

      {similar.length > 0 ? (
        <section className="detail-section mt-8" aria-label={t.similar}>
          <h2 className="text-lg font-bold">{t.similar}</h2>
          <ul className="mt-2 grid gap-2 md:grid-cols-2">
            {similar.map((s) => (
              <li key={s.id}>
                <Link
                  to={similarTo(s.id)}
                  className="block min-h-[44px] rounded-lg border border-stonedim/40 px-4 py-3 text-sm text-ivory"
                >
                  {similarName(s)}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <SiteDisclaimer />
    </main>
  );
}
