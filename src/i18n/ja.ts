export interface Dict {
  nav: {
    search: string;
    saved: string;
    main: string;
  };
  lang: {
    toEnglish: string;
    toEnglishLabel: string;
    toJapanese: string;
    toJapaneseLabel: string;
  };
}

export const ja: Dict = {
  nav: {
    search: '探す',
    saved: '保存',
    main: 'メイン',
  },
  lang: {
    toEnglish: 'English',
    toEnglishLabel: 'Switch to English',
    toJapanese: '日本語',
    toJapaneseLabel: '日本語に切り替える',
  },
};
