import type { Store } from './schema';
import { SYABUYO_STORES } from './data/syabuyo';
import { KING_STORES } from './data/king';
import { YUZU_STORES } from './data/yuzu';
import { SUIPARA_STORES } from './data/suipara';
import { KUSHI_STORES } from './data/kushi';
import { ONYASAI_STORES } from './data/onyasai';
import { SHAKEYS_STORES } from './data/shakeys';
import { SUSHI_STORES } from './data/sushi';
import { GYUKAKU_STORES } from './data/gyukaku';
import { ENKAI_STORES } from './data/enkai';
import { EXTRA_STORES } from './data/extra';
import { BREAD_STORES } from './data/bread';
import { OKONOMIYAKI_STORES } from './data/okonomiyaki';
import { SALADBAR_STORES } from './data/saladbar';
import { ITALIAN_STORES } from './data/italian';
import { VIKING_STORES } from './data/viking';
import { OKAWARI_STORES } from './data/okawari';
import { OKAWARI_CHAIN_STORES } from './data/okawari-chains';

export const SEED_STORES: Store[] = [
  ...SYABUYO_STORES,
  ...KING_STORES,
  ...YUZU_STORES,
  ...SUIPARA_STORES,
  ...KUSHI_STORES,
  ...ONYASAI_STORES,
  ...SHAKEYS_STORES,
  ...SUSHI_STORES,
  ...GYUKAKU_STORES,
  ...ENKAI_STORES,
  ...EXTRA_STORES,
  ...BREAD_STORES,
  ...OKONOMIYAKI_STORES,
  ...SALADBAR_STORES,
  ...ITALIAN_STORES,
  ...VIKING_STORES,
  ...OKAWARI_STORES,
  ...OKAWARI_CHAIN_STORES,
];
