# 少数精鋭チェーンの主要店舗・完全網羅 実装計画

- 日付: 2026-09-10
- 設計書: `docs/superpowers/specs/2026-09-10-boutique-chain-gap-fill-design.md`
- 目的: 少数精鋭チェーン（きづなすし、雛鮨、シェーキーズ、シズラー、寅福、モーモーパラダイス）の16店舗を追加し、主要駅の検索抜け漏れ解消と100%完全網羅（または主要駅完全カバー）を実現する。

---

## タスク一覧

### Task 1: 語彙テーブル拡充（水道橋・大井町・三鷹）
- **対象ファイル**: `src/catalog/en-names.ts`, `tests/catalog-en.test.ts`
- **作業内容**:
  - `STATION_EN` に `水道橋: 'Suidobashi'`, `大井町: 'Oimachi'`, `三鷹: 'Mitaka'` を追加
  - `AREA_EN` に `水道橋: 'Suidobashi'`, `大井町: 'Oimachi'`, `三鷹: 'Mitaka'` を追加
- **検証**: `npx vitest run tests/catalog-en.test.ts`
- **コミット**: `feat: 英語語彙テーブルに水道橋・大井町・三鷹を追加`

### Task 2: 寿司チェーン拡充（きづなすし 1店、雛鮨 4店）
- **対象ファイル**: `src/catalog/data/extra.ts`, `src/catalog/data/sushi.ts`, `tests/sushi-gap.test.ts`
- **作業内容**:
  - `tests/sushi-gap.test.ts` を作成し、きづなすし秋葉原店、雛鮨西銀座デパート店・新宿マルイアネックス店・上野の森さくらテラス店・祭雛ヨドバシ横浜店が存在し検索できるテストを作成（RED）
  - `src/catalog/data/extra.ts` に `kizuna-akihabara` を追加
  - `src/catalog/data/sushi.ts` に `hina-nishi-ginza`, `hina-shinjuku-annex`, `hina-ueno-sakura`, `hina-yokohama-matsuri` を追加（GREEN）
- **検証**: `npx vitest run tests/sushi-gap.test.ts`
- **コミット**: `feat: きづなすし秋葉原店・雛鮨4店舗をカタログに追加`

### Task 3: ピザチェーン拡充（シェーキーズ 2店）
- **対象ファイル**: `src/catalog/data/shakeys.ts`, `tests/shakeys-gap.test.ts`
- **作業内容**:
  - `tests/shakeys-gap.test.ts` を作成し、シェーキーズ新宿セノビル店・吉祥寺店の存在と検索を検証（RED）
  - `src/catalog/data/shakeys.ts` に `shakeys-shinjuku-ceno`, `shakeys-kichijoji` を追加（GREEN）
- **検証**: `npx vitest run tests/shakeys-gap.test.ts`
- **コミット**: `feat: シェーキーズ新宿セノビル店・吉祥寺店をカタログに追加`

### Task 4: サラダバー拡充（シズラー 5店）
- **対象ファイル**: `src/catalog/data/saladbar.ts`, `tests/sizzler-gap.test.ts`
- **作業内容**:
  - `tests/sizzler-gap.test.ts` を作成し、シズラー5店舗（新宿東宝、お台場、東京ドームホテル、大井町、三鷹）の存在と検索を検証（RED）
  - `src/catalog/data/saladbar.ts` に5店舗を追加（GREEN）
- **検証**: `npx vitest run tests/sizzler-gap.test.ts`
- **コミット**: `feat: シズラー5店舗を追加し東京・神奈川を完全網羅`

### Task 5: 定食・しゃぶしゃぶ拡充（大かまど飯 寅福 2店、モーモーパラダイス 2店）
- **対象ファイル**: `src/catalog/data/okawari-chains.ts`, `src/catalog/data/extra.ts`, `tests/boutique-gap.test.ts`
- **作業内容**:
  - `tests/boutique-gap.test.ts` を作成し、寅福2店（ルミネ新宿、池袋東武）およびモーパラ2店（新宿東口、秋葉原）の存在と検索を検証（RED）
  - `src/catalog/data/okawari-chains.ts` に `torafuku-lumine-shinjuku`, `torafuku-ikebukuro-tobu` を追加
  - `src/catalog/data/extra.ts` に `momo-shinjuku-east`, `momo-akihabara` を追加（GREEN）
- **検証**: `npx vitest run tests/boutique-gap.test.ts`
- **コミット**: `feat: 大かまど飯 寅福2店舗・モーモーパラダイス2店舗をカタログに追加`

### Task 6: 全体検証とPR作成
- **作業内容**:
  - `npm test`（全テスト通過）
  - `npm run lint`（oxlint通過）
  - `npm run build`（型チェック＋ビルド通過）
  - `npm run build:ssg`（SSG生成・サイトマップ正常）
  - 作業ブランチからGitHub PRを作成
