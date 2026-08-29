import { useNavigate } from 'react-router-dom';
import { useT } from '../i18n/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

export default function AppHeader({ userName }) {
  const navigate = useNavigate();
  const t = useT();

  function handleLogout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    navigate('/login');
  }

  return (
    <header className="parchment leaf-card--flat flex flex-wrap items-center justify-between gap-y-2 px-5 py-3 mb-4">
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="logo" className="w-12 h-12 rounded-full border-2 border-gold" />
        <div>
          <h1 className="brand-wordmark text-lg leading-none">VINAYAGAMOORTHY</h1>
          <p className="text-xs opacity-80 tracking-widest">{t('brand.tagline')}</p>
          <p className="text-[11px] opacity-70 tracking-wide" style={{ color: 'var(--gold-bright)' }}>
            ஜோதிடம் · அறிவு · அருள்
          </p>
        </div>
      </div>

      <div
        className="hidden lg:block text-center flex-1 mx-4 select-none"
        style={{ color: 'var(--gold)', letterSpacing: '0.3em' }}
        aria-hidden="true"
      >
        ✦&nbsp;&nbsp;❖&nbsp;&nbsp;✦
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <span className="text-sm hidden sm:inline">
          {t('common.welcome')}, <strong>{userName || '...'}</strong>
        </span>
        <button onClick={handleLogout} className="btn-gold !py-1.5 !px-3 text-sm">
          {t('common.logout')}
        </button>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
