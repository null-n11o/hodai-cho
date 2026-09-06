import type { SlotCond, SortCond, TimeLimitCond } from '../filters/filter';
import { budgetLabel } from '../i18n/format';
import { dictionary, useLanguage } from '../i18n/language';

interface FilterSheetProps {
  open: boolean;
  slot: SlotCond;
  timeLimit: TimeLimitCond;
  budget: number | undefined;
  sort: SortCond;
  onChange: (patch: { slot?: SlotCond; timeLimit?: TimeLimitCond; budget?: number | undefined; sort?: SortCond }) => void;
  onClose: () => void;
}

const SLOT_VALUES: SlotCond[] = ['all', 'lunch', 'dinner'];
const TIME_LIMIT_VALUES: TimeLimitCond[] = ['all', 'unlimited', 'le90', 'le120'];
const SORT_VALUES: SortCond[] = ['recommend', 'cheap', 'near', 'short'];

const BUDGETS: number[] = [];
for (let yen = 1000; yen <= 8000; yen += 500) BUDGETS.push(yen);

function chip(active: boolean): string {
  return `min-h-[44px] whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-colors ${
    active ? 'border-aka bg-aka text-ivory' : 'border-stonedim/60 text-stone'
  }`;
}

export function FilterSheet({ open, slot, timeLimit, budget, sort, onChange, onClose }: FilterSheetProps) {
  const lang = useLanguage();
  const dict = dictionary(lang);
  const t = dict.sheet;
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <button type="button" aria-label={t.closeLabel} onClick={onClose} className="absolute inset-0 min-h-[44px] w-full bg-black/60" />
      <div role="dialog" aria-modal="true" aria-label={t.dialogLabel} className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-lg rounded-t-2xl bg-ink p-5 pb-8">
        <h2 className="text-lg font-bold text-ivory">{t.title}</h2>
        <section className="mt-4" aria-label={t.time}>
          <h3 className="text-sm text-stone">{t.time}</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {SLOT_VALUES.map((value) => (
              <button key={value} type="button" aria-pressed={slot === value} onClick={() => onChange({ slot: value })} className={chip(slot === value)}>
                {t.slots[value]}
              </button>
            ))}
          </div>
        </section>
        <section className="mt-4" aria-label={t.duration}>
          <h3 className="text-sm text-stone">{t.duration}</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {TIME_LIMIT_VALUES.map((value) => (
              <button key={value} type="button" aria-pressed={timeLimit === value} onClick={() => onChange({ timeLimit: value })} className={chip(timeLimit === value)}>
                {t.limits[value]}
              </button>
            ))}
          </div>
        </section>
        <section className="mt-4" aria-label={t.budget}>
          <h3 className="text-sm text-stone">{t.budget}</h3>
          <select
            aria-label={t.budget}
            value={budget ?? ''}
            onChange={(e) => onChange({ budget: e.target.value === '' ? undefined : Number(e.target.value) })}
            className="mt-2 min-h-[44px] w-full rounded-lg border border-stonedim/60 bg-ink px-3 text-ivory"
          >
            <option value="">{budgetLabel(lang, undefined)}</option>
            {BUDGETS.map((yen) => (
              <option key={yen} value={yen}>
                {budgetLabel(lang, yen)}
              </option>
            ))}
          </select>
        </section>
        <section className="mt-4" aria-label={t.sort}>
          <h3 className="text-sm text-stone">{t.sort}</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {SORT_VALUES.map((value) => (
              <button key={value} type="button" aria-pressed={sort === value} onClick={() => onChange({ sort: value })} className={chip(sort === value)}>
                {t.sorts[value]}
              </button>
            ))}
          </div>
        </section>
        <button type="button" onClick={onClose} className="mt-6 min-h-[44px] w-full rounded-lg bg-aka font-bold text-ivory">
          {t.close}
        </button>
      </div>
    </div>
  );
}
