import type { Store } from '../schema';

// すたみな太郎 PREMIUM BUFFET 3店（公式料金ページ＋公式開店リリースで料金・営業時間・住所を確認）。
// PREMIUM 90分：平日ランチ 2,178・土日祝ランチ 3,278・ディナー 3,718（2026年4月改定の公式料金の目安）。
// 焼肉・寿司・スイーツの総合バイキングのため新ジャンル「バイキング」で登録。
const LUNCH = {
  slot: 'lunch' as const,
  name: 'PREMIUM BUFFET ランチ（90分）',
  priceInclTax: 2178,
  minutes: 90,
  note: '土日祝ランチは3,278の場合あり。ソフトドリンクバー付き',
};
const DINNER = {
  slot: 'dinner' as const,
  name: 'PREMIUM BUFFET ディナー（90分）',
  priceInclTax: 3718,
  minutes: 90,
  note: 'ソフトドリンクバー付き。高田馬場店は60分コースあり',
};
const NOTICE =
  '料金・制限時間は2026年時点の公開情報の目安です。2026年4月改定の公式料金を基準にしています。店舗・曜日で変わる場合があります。行く前に公式を確認してください。';

export const VIKING_STORES: Store[] = [
  {
    id: 'stamina-takadanobaba',
    name: 'すたみな太郎PREMIUM BUFFET BIGBOX高田馬場店',
    officialUrl: 'https://staminataro.jp/shop-list/',
    kana: 'すたみなたろう たかだのばば',
    chain: 'すたみな太郎',
    prefecture: '東京',
    area: '高田馬場',
    station: '高田馬場',
    walkMinutes: 1,
    facility: 'BIGBOX高田馬場9F',
    genres: ['バイキング'],
    pick: 4,
    courses: [LUNCH, DINNER],
    hours: '平日ランチ11:00–17:00・ディナー17:00–23:30、土日祝ランチ11:00–16:00・ディナー16:00–23:30',
    highlights: ['焼肉・寿司・スイーツの総合バイキングの目安', '高田馬場駅下車すぐの目安'],
    notice: NOTICE,
    familyFriendly: true,
  },
  {
    id: 'stamina-kameido',
    name: 'すたみな太郎PREMIUM BUFFET 亀戸店',
    officialUrl: 'https://staminataro.jp/shop-list/',
    kana: 'すたみなたろう かめいど',
    chain: 'すたみな太郎',
    prefecture: '東京',
    area: '亀戸',
    station: '亀戸',
    walkMinutes: 1,
    facility: 'LIV亀戸5F',
    genres: ['バイキング'],
    pick: 3,
    courses: [LUNCH, DINNER],
    hours: '平日ランチ11:00–16:00・ディナー16:00–22:00（土日祝は公式確認）',
    highlights: ['焼肉・寿司・スイーツの総合バイキングの目安', '亀戸駅から徒歩1分の目安'],
    notice: NOTICE,
    familyFriendly: true,
  },
  {
    id: 'stamina-kawasaki-east',
    name: 'すたみな太郎PREMIUM BUFFET マーケットスクエア川崎イースト店',
    officialUrl: 'https://staminataro.jp/shop-list/',
    reservationUrl: 'https://www.hotpepper.jp/strJ001143600/',
    kana: 'すたみなたろう かわさき',
    chain: 'すたみな太郎',
    prefecture: '神奈川',
    area: '川崎',
    station: '港町',
    walkMinutes: 2,
    facility: 'マーケットスクエア川崎イースト1F',
    genres: ['バイキング'],
    pick: 4,
    courses: [LUNCH, DINNER],
    hours: 'ランチ11:00–16:30・ディナー16:30–22:00',
    highlights: ['焼肉・寿司・スイーツの総合バイキングの目安', '港町駅から徒歩2分の目安'],
    notice: NOTICE,
    familyFriendly: true,
  },
];
