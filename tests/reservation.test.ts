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

  it('現行カタログは reservationAffiliateUrl を置かない', () => {
    expect(stores.every((s) => s.reservationAffiliateUrl === undefined)).toBe(true);
    expect(stores.every((s) => s.reservationAffiliateProvider === undefined)).toBe(true);
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
