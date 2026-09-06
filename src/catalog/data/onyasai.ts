import type { Store } from '../schema';

// しゃぶしゃぶ温野菜 関内店（2026年9月1日オープン）。
// 平日16:00〜のためランチ食べ放題なし。三元豚コース 4,378・120分（公式発表の2026年コース体系）。
export const ONYASAI_STORES: Store[] = [
  {
    id: 'on-yasai-kannai',
    name: 'しゃぶしゃぶ温野菜 関内店',
    nameEn: 'Shabu-shabu Onyasai Kannai Branch',
    kana: 'おんやさい かんない',
    chain: 'しゃぶしゃぶ温野菜',
    officialUrl: 'https://www.onyasai.com/',
    prefecture: '神奈川',
    area: '関内',
    station: '関内',
    walkMinutes: 3,
    facility: 'eXビル2F',
    facilityEn: 'eX Bldg. 2F',
    genres: ['しゃぶしゃぶ'],
    pick: 3,
    courses: [
      { slot: 'dinner', name: '三元豚コース食べ放題', nameEn: 'Sangen pork course (all-you-can-eat)', priceInclTax: 4378, minutes: 120 },
    ],
    hours: '月〜金・祝前16:00–23:00、土日祝11:30–23:00',
    hoursEn: 'Mon–Fri & days before holidays 16:00–23:00, weekends & holidays 11:30–23:00',
    highlights: ['国産野菜と三元豚が食べ放題の目安', '関内駅から徒歩3分の目安'],
    highlightsEn: ['Domestic vegetables & Sangen pork, all-you-can-eat', '3-min walk from Kannai Station'],
    notice:
      '平日は16時からのためランチ食べ放題なしの目安です。料金は2026年時点の公開情報の目安です。行く前に公式を確認してください。',
    noticeEn:
      'No lunch buffet on weekdays (opens at 16:00). Prices are edited from public info as of 2026. Check the official source before you go.',
    familyFriendly: true,
  },
];
