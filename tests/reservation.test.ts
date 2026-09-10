import { describe, expect, it } from 'vitest';
import {
  AFFILIATE_REL,
  PLAIN_REL,
  getReservationHref,
  getReservationLinkProps,
} from '../src/catalog/reservation';
import { BundledCatalogRepository } from '../src/catalog/repository';
import { validateCatalog } from '../src/catalog/schema';
import type { Store } from '../src/catalog/schema';

const PLAIN = 'https://www.hotpepper.jp/strJ001195726/';
const AFFILIATE = 'https://ck.jp.ap.valuecommerce.com/servlet/referral?sid=1&pid=2';

function store(partial: Pick<Store, 'reservationUrl' | 'reservationAffiliateUrl' | 'reservationAffiliateProvider'>): Pick<
  Store,
  'reservationUrl' | 'reservationAffiliateUrl' | 'reservationAffiliateProvider'
> {
  return partial;
}

describe('getReservationLinkProps', () => {
  it('予約URLだけなら素リンクと rel=noreferrer を返す', () => {
    const got = getReservationLinkProps(store({ reservationUrl: PLAIN }));
    expect(got).toEqual({ href: PLAIN, affiliate: false, rel: PLAIN_REL });
    expect(got?.rel).toBe('noreferrer');
    expect(got?.rel).not.toContain('sponsored');
  });

  it('アフィリエイトURLがあれば予約URLより優先し sponsored を付ける', () => {
    const got = getReservationLinkProps(
      store({
        reservationUrl: PLAIN,
        reservationAffiliateUrl: AFFILIATE,
        reservationAffiliateProvider: 'valuecommerce',
      }),
    );
    expect(got).toEqual({ href: AFFILIATE, affiliate: true, rel: AFFILIATE_REL });
    expect(got?.rel).toBe('sponsored nofollow noreferrer');
  });

  it('アフィリエイトURLが空文字・空白なら reservationUrl に倒す', () => {
    expect(getReservationLinkProps(store({ reservationUrl: PLAIN, reservationAffiliateUrl: '' }))?.href).toBe(PLAIN);
    expect(getReservationLinkProps(store({ reservationUrl: PLAIN, reservationAffiliateUrl: '   ' }))?.affiliate).toBe(false);
  });

  it('予約URLがなくアフィリエイトだけでもCTAを出せる', () => {
    const got = getReservationLinkProps(store({ reservationAffiliateUrl: AFFILIATE }));
    expect(got?.href).toBe(AFFILIATE);
    expect(got?.affiliate).toBe(true);
  });

  it('どちらも無ければ undefined', () => {
    expect(getReservationLinkProps(store({}))).toBeUndefined();
    expect(getReservationLinkProps(store({ reservationUrl: '', reservationAffiliateUrl: '' }))).toBeUndefined();
  });

  it('provider だけではアフィリエイトにしない', () => {
    const got = getReservationLinkProps(store({ reservationUrl: PLAIN, reservationAffiliateProvider: 'linkshare' }));
    expect(got?.affiliate).toBe(false);
    expect(got?.href).toBe(PLAIN);
  });
});

describe('getReservationHref', () => {
  it('アフィリエイトがあればそれを、なければ reservationUrl を返す', () => {
    expect(getReservationHref(store({ reservationUrl: PLAIN }))).toBe(PLAIN);
    expect(getReservationHref(store({ reservationUrl: PLAIN, reservationAffiliateUrl: AFFILIATE }))).toBe(AFFILIATE);
    expect(getReservationHref(store({}))).toBeUndefined();
  });
});

describe('catalog affiliate fields', () => {
  const stores = new BundledCatalogRepository().listStores();
  const repo = new BundledCatalogRepository();
  const KASHOAN_ID = 'kashoan-akihabara';
  const KASHOAN_RESERVATION = 'https://yoyaku.tabelog.com/yoyaku/net_booking_form/index?rcd=13294135';
  const KASHOAN_AFFILIATE =
    'https://ck.jp.ap.valuecommerce.com/servlet/referral?sid=3781041&pid=892696253&vc_url=https%3A%2F%2Fyoyaku.tabelog.com%2Fyoyaku%2Fnet_booking_form%2Findex%3Frcd%3D13294135';
  const KASHOAN_OFFICIAL = 'https://www.chisakosyokudou.jp/kashoan/menu.html';

  it('kashoan-akihabara だけが ValueCommerce の予約アフィリエイトを持つ', () => {
    const kashoan = repo.getStore(KASHOAN_ID);
    expect(kashoan).toBeDefined();
    expect(kashoan?.reservationUrl).toBe(KASHOAN_RESERVATION);
    expect(kashoan?.officialUrl).toBe(KASHOAN_OFFICIAL);
    expect(kashoan?.reservationAffiliateUrl).toBe(KASHOAN_AFFILIATE);
    expect(kashoan?.reservationAffiliateProvider).toBe('valuecommerce');

    const others = stores.filter((s) => s.id !== KASHOAN_ID);
    expect(others.every((s) => s.reservationAffiliateUrl === undefined)).toBe(true);
    expect(others.every((s) => s.reservationAffiliateProvider === undefined)).toBe(true);
  });

  it('kashoan-akihabara の予約CTAはアフィリエイト href と sponsored rel に解決する', () => {
    const kashoan = repo.getStore(KASHOAN_ID);
    if (!kashoan) throw new Error('kashoan-akihabara がカタログにない');
    const got = getReservationLinkProps(kashoan);
    expect(got).toEqual({ href: KASHOAN_AFFILIATE, affiliate: true, rel: AFFILIATE_REL });
    expect(getReservationHref(kashoan)).toBe(KASHOAN_AFFILIATE);
  });

  it('reservationAffiliateUrl は任意で検証を通る', () => {
    const withAff = stores.map((s, i) =>
      i === 0
        ? { ...s, reservationAffiliateUrl: AFFILIATE, reservationAffiliateProvider: 'valuecommerce' as const }
        : s,
    );
    expect(validateCatalog(withAff)).toEqual([]);
  });
});
