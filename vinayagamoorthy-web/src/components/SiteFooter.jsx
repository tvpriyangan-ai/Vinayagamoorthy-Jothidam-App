import { Link } from 'react-router-dom';
import { useT } from '../i18n/LanguageContext';

// Shared footer: copyright line + a "Contact Us" link, used on every page.
export default function SiteFooter({ className = '' }) {
  const t = useT();
  return (
    <footer
      className={`text-center text-xs opacity-75 py-6 ${className}`}
      style={{ color: 'var(--gold)' }}
    >
      <Link to="/contact" className="underline" style={{ color: 'var(--gold-bright)' }}>
        {t('contact.us')}
      </Link>
      <span className="mx-2 opacity-50">·</span>
      <Link to="/delete-account" className="underline" style={{ color: 'var(--gold-bright)' }}>
        {t('footer.deleteAccount')}
      </Link>
      <span className="mx-2 opacity-50">·</span>
      {t('dash.footer')}
    </footer>
  );
}
