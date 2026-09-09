import { dictionary, useLanguage } from '../i18n/language';

export function SiteDisclaimer() {
  const dict = dictionary(useLanguage());

  return (
    <footer className="site-disclaimer">
      <p className="image-disclaimer">{dict.imageDisclaimer}</p>
      <p>{dict.disclaimer}</p>
      <p>{dict.affiliateDisclosure}</p>
    </footer>
  );
}
