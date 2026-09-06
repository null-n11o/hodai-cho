import type { Store } from '../schema';

// シェーキーズ 2店（公式店舗ページで料金・分数・営業時間を確認）。
// 平日ランチ 1,750・90分、平日ディナー 2,300・120分、土日祝 2,500・120分。店舗差あり。
const LUNCH = { slot: 'lunch' as const, name: 'ランチバイキング（平日）', nameEn: 'Lunch buffet (weekdays)', priceInclTax: 1750, minutes: 90 };
const DINNER = {
  slot: 'dinner' as const,
  name: 'ディナーバイキング（平日）',
  nameEn: 'Dinner buffet (weekdays)',
  priceInclTax: 2300,
  minutes: 120,
  note: '土日祝は2,500・120分の場合あり',
  noteEn: 'Weekends & holidays may be ¥2,500 for 120 min.',
};
const NOTICE =
  '料金・制限時間は2026年時点の公開情報の目安です。店舗・曜日で変わる場合があります。行く前に公式を確認してください。';
const NOTICE_EN =
  'Prices and time limits are edited from public info as of 2026. They vary by branch and day. Check the official source before you go.';

export const SHAKEYS_STORES: Store[] = [
  {
    id: 'shakeys-ikebukuro',
    name: 'シェーキーズ 池袋東口店',
    nameEn: "Shakey's Ikebukuro East Exit Branch",
    officialUrl: 'https://www.shakeys.jp/store-and-menu/ikebukuro-higashiguchi.html',
    kana: 'しぇーきーず いけぶくろ',
    chain: 'シェーキーズ',
    prefecture: '東京',
    area: '池袋',
    station: '池袋',
    walkMinutes: 5,
    facility: '大和ビルB1F',
    facilityEn: 'Daiwa Bldg. B1F',
    genres: ['ピザ'],
    pick: 4,
    courses: [LUNCH, DINNER],
    hours: '平日11:00–22:30、土日祝10:30–22:30',
    hoursEn: 'Weekdays 11:00–22:30, weekends & holidays 10:30–22:30',
    highlights: ['ピザ・パスタ・ポテトが食べ放題の目安', '池袋駅から徒歩5分の目安'],
    highlightsEn: ['Pizza, pasta & potatoes, all-you-can-eat', '5-min walk from Ikebukuro Station'],
    notice: NOTICE,
    noticeEn: NOTICE_EN,
    familyFriendly: true,
  },
  {
    id: 'shakeys-yokohama',
    name: 'シェーキーズ 横浜西口店',
    nameEn: "Shakey's Yokohama West Exit Branch",
    officialUrl: 'https://www.shakeys.jp/store-and-menu/yokohama-nishiguchi.html',
    kana: 'しぇーきーず よこはま',
    chain: 'シェーキーズ',
    prefecture: '神奈川',
    area: '横浜',
    station: '横浜',
    walkMinutes: 3,
    facility: '丸藤ビルB1F',
    facilityEn: 'Marufuji Bldg. B1F',
    genres: ['ピザ'],
    pick: 3,
    courses: [LUNCH, DINNER],
    hours: '11:00–23:00',
    hoursEn: '11:00–23:00',
    highlights: ['ピザ・パスタ・ポテトが食べ放題の目安', '横浜駅から徒歩3分の目安'],
    highlightsEn: ['Pizza, pasta & potatoes, all-you-can-eat', '3-min walk from Yokohama Station'],
    notice: NOTICE,
    noticeEn: NOTICE_EN,
    familyFriendly: true,
  },
];
