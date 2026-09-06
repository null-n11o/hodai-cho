import type { Course } from '../catalog/schema';
import { dictionary, useLanguage } from '../i18n/language';
import { durationLabel } from '../i18n/format';

interface CourseTableProps {
  courses: Course[];
}

export function CourseTable({ courses }: CourseTableProps) {
  const lang = useLanguage();
  const dict = dictionary(lang);
  const locale = lang === 'en' ? 'en-US' : 'ja-JP';
  const notes = courses
    .map((c) => (lang === 'en' ? (c.noteEn ?? c.note) : c.note))
    .filter((n): n is string => Boolean(n));
  return (
    <div>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-stone">
            <th scope="col" className="min-h-[44px] py-2 pr-2 font-normal">{dict.course.time}</th>
            <th scope="col" className="min-h-[44px] py-2 pr-2 font-normal">{dict.course.course}</th>
            <th scope="col" className="min-h-[44px] py-2 pr-2 text-right font-normal">{dict.course.price}</th>
            <th scope="col" className="min-h-[44px] py-2 text-right font-normal">{dict.course.limit}</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c) => (
            <tr key={c.name} className="border-t border-stonedim/40 text-ivory">
              <td className="py-3 pr-2">{dict.course.slots[c.slot]}</td>
              <td className="py-3 pr-2">{lang === 'en' ? c.nameEn : c.name}</td>
              <td className="py-3 pr-2 text-right">¥{c.priceInclTax.toLocaleString(locale)}</td>
              <td className="py-3 text-right">{durationLabel(lang, c.minutes)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {notes.map((note) => (
        <p key={note} className="mt-1 text-xs text-stone">
          {note}
        </p>
      ))}
    </div>
  );
}
