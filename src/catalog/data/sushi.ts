import type { Store } from '../schema';

// 新規開拓：寿司食べ放題。雛鮨 2店（男女別料金・120分。池袋店の料金は2026年3月の公開情報、新宿店は同体系の目安）。
const MALE = { slot: 'all-day' as const, name: '寿司食べ放題（男性）', priceInclTax: 5489, minutes: 120 };
const FEMALE = { slot: 'all-day' as const, name: '寿司食べ放題（女性）', priceInclTax: 5159, minutes: 120 };
const NOTICE =
  '料金・制限時間は2026年時点の公開情報の目安です。男女別料金、店舗で変わる場合があります。行く前に公式を確認してください。';

export const SUSHI_STORES: Store[] = [
  {
    id: 'hina-shinjuku-iland',
    name: '雛鮨 新宿アイランドタワー店',
    officialUrl: 'https://hina-sushi.com/shops/shinjuku-i-land/',
    kana: 'ひなずし しんじゅく',
    chain: '雛鮨',
    prefecture: '東京',
    area: '新宿',
    station: '新宿',
    walkMinutes: 3,
    facility: '新宿アイランドタワーB1F',
    genres: ['寿司'],
    pick: 5,
    courses: [MALE, FEMALE],
    hours: '平日ランチ11:30–14:30・ディナー17:00–23:00、土日祝は公式を確認',
    highlights: ['職人が握る約60種の寿司が食べ放題の目安', '新宿駅から徒歩3分の目安'],
    notice: `営業時間は曜日で変わります。${NOTICE}`,
    familyFriendly: true,
    reservationUrl: 'https://www.hotpepper.jp/strJ001262726/',
  },
  {
    id: 'hina-ikebukuro-labi',
    name: '雛鮨 LABI池袋本店',
    officialUrl: 'https://hina-sushi.com/ikebukuro-yamada-labi/',
    kana: 'ひなずし いけぶくろ',
    chain: '雛鮨',
    prefecture: '東京',
    area: '池袋',
    station: '池袋',
    walkMinutes: 1,
    facility: 'LABI池袋本店7F',
    genres: ['寿司'],
    pick: 5,
    courses: [MALE, FEMALE],
    hours: '11:00–23:00',
    highlights: ['職人が握る約60種の寿司が食べ放題の目安', '池袋駅から徒歩1分の目安'],
    notice: NOTICE,
    familyFriendly: true,
    reservationUrl: 'https://www.hotpepper.jp/strJ000762760/',
  },
];
