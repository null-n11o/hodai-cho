import { useMemo, useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import { BundledCatalogRepository } from '../catalog/repository';
import { AREA_EN } from '../catalog/en-names';
import { dictionary, useLanguage } from '../i18n/language';

const repository = new BundledCatalogRepository();
const GITHUB_NEW_ISSUE_URL = 'https://github.com/null-n11o/hodai-cho/issues/new';

type RequestType = 'correction' | 'addition' | 'closed' | 'other';

interface ReportValues {
  requestType: RequestType;
  store: string;
  details: string;
  sourceUrl: string;
  visitedAt: string;
  replyTo: string;
}

function issueUrl(values: ReportValues, labels: Record<RequestType, string>, lang: 'ja' | 'en'): string {
  const title = `[${labels[values.requestType]}] ${values.store}`;
  const body = [
    `## ${labels[values.requestType]}`,
    '',
    `- ${lang === 'ja' ? '店名・エリア' : 'Shop and area'}: ${values.store}`,
    `- ${lang === 'ja' ? '確認時期' : 'Checked'}: ${values.visitedAt || (lang === 'ja' ? '未記入' : 'Not provided')}`,
    `- ${lang === 'ja' ? '参考URL' : 'Reference URL'}: ${values.sourceUrl || (lang === 'ja' ? '未記入' : 'Not provided')}`,
    `- ${lang === 'ja' ? '返信先' : 'Reply contact'}: ${values.replyTo || (lang === 'ja' ? '未記入' : 'Not provided')}`,
    '',
    `### ${lang === 'ja' ? '内容' : 'Details'}`,
    values.details,
    '',
    lang === 'ja'
      ? '> この投稿は放題帖の情報修正・店舗追加の依頼です。掲載前に運営が確認します。'
      : '> This is a correction or shop suggestion for Hodai-cho. The team will verify it before publishing.',
  ].join('\n');
  const url = new URL(GITHUB_NEW_ISSUE_URL);
  url.searchParams.set('title', title);
  url.searchParams.set('body', body);
  url.searchParams.set('labels', 'content');
  return url.toString();
}

export function ContactPage() {
  const lang = useLanguage();
  const dict = dictionary(lang);
  const t = dict.contact;
  const [submitted, setSubmitted] = useState(false);
  const [storeMenuOpen, setStoreMenuOpen] = useState(false);
  const [activeStoreIndex, setActiveStoreIndex] = useState(0);
  const [values, setValues] = useState<ReportValues>({
    requestType: 'correction',
    store: '',
    details: '',
    sourceUrl: '',
    visitedAt: '',
    replyTo: '',
  });
  const stores = useMemo(() => repository.listStores(), []);
  const storeOptions = useMemo(() => {
    const query = values.store.trim().toLocaleLowerCase('ja-JP');
    if (!query) return stores.slice(0, 12);
    return stores
      .filter((store) => {
        const name = lang === 'en' ? store.nameEn : store.name;
        const area = lang === 'en' ? (AREA_EN[store.area] ?? store.area) : store.area;
        return `${name} ${area}`.toLocaleLowerCase('ja-JP').includes(query);
      })
      .slice(0, 12);
  }, [lang, stores, values.store]);
  const labels: Record<RequestType, string> = {
    correction: t.requestTypes.correction,
    addition: t.requestTypes.addition,
    closed: t.requestTypes.closed,
    other: t.requestTypes.other,
  };

  const update = <K extends keyof ReportValues>(key: K, value: ReportValues[K]) => {
    setSubmitted(false);
    setValues((previous) => ({ ...previous, [key]: value }));
  };

  const storeLabel = (store: (typeof stores)[number]) => {
    const name = lang === 'en' ? store.nameEn : store.name;
    const area = lang === 'en' ? (AREA_EN[store.area] ?? store.area) : store.area;
    return `${name} / ${area}`;
  };

  const chooseStore = (store: (typeof stores)[number]) => {
    update('store', storeLabel(store));
    setStoreMenuOpen(false);
  };

  const onStoreKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setStoreMenuOpen(true);
      setActiveStoreIndex((index) => Math.min(index + 1, Math.max(storeOptions.length - 1, 0)));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveStoreIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Enter' && storeMenuOpen && storeOptions[activeStoreIndex]) {
      event.preventDefault();
      chooseStore(storeOptions[activeStoreIndex]);
    } else if (event.key === 'Escape') {
      setStoreMenuOpen(false);
    }
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const url = issueUrl(values, labels, lang);
    window.open(url, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
  };

  const searchTo = lang === 'en' ? '/en/' : '/';

  return (
    <main className="site-main content-page mx-auto w-full max-w-lg overflow-x-clip bg-ink px-4 pb-24 pt-8 text-ivory md:max-w-3xl md:px-8 lg:max-w-5xl">
      <header className="contact-hero">
        <p className="text-xs tracking-[0.18em] text-aka">COMMUNITY / CONTACT</p>
        <h1 className="mt-3 text-2xl font-bold leading-relaxed md:text-3xl">{t.title}</h1>
        <p className="mt-3 text-base font-bold leading-relaxed">{t.lead}</p>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-stone">{t.intro}</p>
      </header>

      <div className="contact-layout mt-8">
        <section className="contact-panel" aria-labelledby="contact-form-title">
          <h2 id="contact-form-title" className="text-xl font-bold">{t.formTitle}</h2>
          <p className="mt-2 text-sm leading-relaxed text-stone">{t.githubNote}</p>
          <form className="contact-form mt-6" onSubmit={onSubmit}>
            <label>
              <span>{t.requestType}</span>
              <select value={values.requestType} onChange={(event) => update('requestType', event.target.value as RequestType)}>
                {(Object.keys(labels) as RequestType[]).map((type) => <option key={type} value={type}>{labels[type]}</option>)}
              </select>
            </label>

            <label className="contact-store-field">
              <span>{t.store}</span>
              <input
                required
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={storeMenuOpen}
                aria-controls="contact-store-suggestions"
                value={values.store}
                onChange={(event) => {
                  update('store', event.target.value);
                  setActiveStoreIndex(0);
                  setStoreMenuOpen(true);
                }}
                onFocus={() => setStoreMenuOpen(true)}
                onBlur={() => setTimeout(() => setStoreMenuOpen(false), 0)}
                onKeyDown={onStoreKeyDown}
                placeholder={t.storePlaceholder}
              />
              {storeMenuOpen ? (
                <div id="contact-store-suggestions" role="listbox" className="contact-store-options">
                  {storeOptions.length > 0 ? storeOptions.map((store, index) => (
                    <button
                      key={store.id}
                      type="button"
                      role="option"
                      aria-selected={index === activeStoreIndex}
                      className={index === activeStoreIndex ? 'is-active' : ''}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => chooseStore(store)}
                    >
                      {storeLabel(store)}
                    </button>
                  )) : <p className="contact-store-empty">{t.storeNoMatches}</p>}
                  <p className="contact-store-hint">{t.storeSearchHint}</p>
                </div>
              ) : null}
            </label>

            <label>
              <span>{t.details}</span>
              <textarea
                required
                rows={6}
                value={values.details}
                onChange={(event) => update('details', event.target.value)}
                placeholder={t.detailsPlaceholder}
              />
            </label>

            <label>
              <span>{t.sourceUrl}</span>
              <input type="url" value={values.sourceUrl} onChange={(event) => update('sourceUrl', event.target.value)} placeholder="https://" />
              <small>{t.sourceUrlHint}</small>
            </label>

            <label>
              <span>{t.visitedAt}</span>
              <input value={values.visitedAt} onChange={(event) => update('visitedAt', event.target.value)} placeholder={lang === 'en' ? 'e.g. September 2026' : '例：2026年9月'} />
              <small>{t.visitedAtHint}</small>
            </label>

            <label>
              <span>{t.replyTo}</span>
              <input value={values.replyTo} onChange={(event) => update('replyTo', event.target.value)} placeholder={lang === 'en' ? 'GitHub username or email' : 'GitHubユーザー名やメールアドレス'} />
              <small>{t.replyToHint}</small>
            </label>

            <button type="submit" className="primary-button contact-submit">{t.submit}</button>
            {submitted ? <p role="status" className="contact-success">{t.submitted}</p> : null}
          </form>
          <a className="contact-direct-link" href={GITHUB_NEW_ISSUE_URL} target="_blank" rel="noreferrer">{t.directLink} ↗</a>
        </section>

        <aside className="contact-aside" aria-label={t.processTitle}>
          <section>
            <h2>{t.processTitle}</h2>
            <ol>
              {t.process.map((step, index) => <li key={step}><span>{index + 1}</span><p>{step}</p></li>)}
            </ol>
          </section>
          <section>
            <h2>{t.goodReportTitle}</h2>
            <ul>
              {t.goodReports.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>
        </aside>
      </div>

      <div className="mt-8">
        <Link to={searchTo} className="inline-flex min-h-[44px] items-center border-b border-stonedim/60 text-sm font-bold text-ivory">← {t.backToSearch}</Link>
      </div>
      <footer className="site-disclaimer">{dict.disclaimer}</footer>
    </main>
  );
}

export { GITHUB_NEW_ISSUE_URL };
