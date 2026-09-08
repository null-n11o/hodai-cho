import type { ReactNode } from 'react';
import { dictionary, useLanguage } from '../i18n/language';

interface EmptyStateProps {
  title?: string;
  advice?: string[];
  action?: ReactNode;
}

export function EmptyState({ title, advice, action }: EmptyStateProps) {
  const lang = useLanguage();
  const dict = dictionary(lang);
  const shownTitle = title ?? dict.empty.title;
  const shownAdvice = advice ?? dict.empty.advice;
  return (
    <div className="empty-state rounded-lg border border-stonedim/40 p-6 text-center">
      <p className="text-lg font-bold text-ivory">{shownTitle}</p>
      <ul className="mt-3 space-y-1 text-sm text-stone">
        {shownAdvice.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
