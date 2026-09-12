import { Link } from 'react-router-dom';
import { ArrowRight, MagnifyingGlass } from '@phosphor-icons/react';
import { SiteDisclaimer } from '../components/SiteDisclaimer';
import { searchPath, useLanguage } from '../i18n/language';
import './landing.css';

const content = {
  ja: {
    region: '東京・神奈川の食べ放題', label: '食卓の新聞',
    title: ['今日は', '好きなだけ', '食べよう。'],
    description: '東京・神奈川の食べ放題のお店を、料金・制限時間・最寄り駅などの条件で探せるグルメ情報サイトです。',
    cta: '食べ放題を探す', secondary: '条件を指定して探す',
    features: [
      ['予算で絞る', 'ご希望の料金から、食べ放題のお店を見つけられます。'],
      ['時間で選ぶ', '制限時間に合わせて、ゆっくり楽しめるお店を探せます。'],
      ['駅から探す', 'よく行くエリアや最寄り駅から、食べ放題のお店を簡単に検索できます。'],
    ],
  },
  en: {
    region: 'ALL-YOU-CAN-EAT IN TOKYO & KANAGAWA', label: 'THE TABLE JOURNAL',
    title: ['Today, eat ', 'to your heart’s ', 'content.'],
    description: 'Find all-you-can-eat restaurants in Tokyo and Kanagawa by price, time limit, nearest station, and more.',
    cta: 'Find all-you-can-eat', secondary: 'Search by your preferences',
    features: [
      ['Filter by budget', 'Find all-you-can-eat restaurants within the price range you want.'],
      ['Choose by time', 'Find a restaurant where you can relax based on its time limit.'],
      ['Search by station', 'Easily search near stations and in areas you visit often.'],
    ],
  },
} as const;

export function LandingPage() {
  const lang = useLanguage();
  const copy = content[lang];
  const to = searchPath(lang);
  return (
    <main className="landing-page">
      <section className="landing-intro">
        <div className="landing-kicker"><span>{copy.region}</span><span>{copy.label}</span></div>
        <h1 aria-label={copy.title.join('')}>{copy.title.map((line) => <span key={line}>{line}</span>)}</h1>
        <p className="landing-description">{copy.description}</p>
      </section>
      <img className="landing-photo" src="/food/hero-all-day.png" alt="" />
      <div className="landing-body">
        <Link className="landing-primary" to={to}>{copy.cta}<ArrowRight aria-hidden="true" size={27} weight="light" /></Link>
        <ol className="landing-features">
          {copy.features.map(([title, description], index) => (
            <li key={title}><span className="landing-number">{String(index + 1).padStart(2, '0')}</span><div><h2>{title}</h2><p>{description}</p></div></li>
          ))}
        </ol>
        <Link className="landing-secondary" to={to}><MagnifyingGlass aria-hidden="true" size={23} /><span>{copy.secondary}</span><ArrowRight aria-hidden="true" size={22} weight="light" /></Link>
        <SiteDisclaimer showImageDisclaimer={false} />
      </div>
    </main>
  );
}
