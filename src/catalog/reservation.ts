import type { Store } from './schema';

export const AFFILIATE_REL = 'sponsored nofollow noreferrer';
export const PLAIN_REL = 'noreferrer';

export type ReservationStore = Pick<Store, 'reservationUrl' | 'reservationAffiliateUrl'>;

export interface ReservationLinkProps {
  href: string;
  affiliate: boolean;
  rel: typeof AFFILIATE_REL | typeof PLAIN_REL;
}

function nonempty(url: string | undefined): string | undefined {
  const trimmed = url?.trim();
  return trimmed ? trimmed : undefined;
}

export function getReservationLinkProps(store: ReservationStore): ReservationLinkProps | undefined {
  const affiliate = nonempty(store.reservationAffiliateUrl);
  if (affiliate) {
    return { href: affiliate, affiliate: true, rel: AFFILIATE_REL };
  }
  const plain = nonempty(store.reservationUrl);
  if (plain) {
    return { href: plain, affiliate: false, rel: PLAIN_REL };
  }
  return undefined;
}

export function getReservationHref(store: ReservationStore): string | undefined {
  return getReservationLinkProps(store)?.href;
}
