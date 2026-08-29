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
    <header className="parchment leaf-card--flat leaf-bound flex flex-wrap items-center justify-between gap-y-2 px-5 py-3 mb-4">
      <div className="flex items-center gap-3">
        <img
          src="/logo.png"
          alt="Vinayagamoorthy Jothidam"
          className="w-12 h-12 rounded-full border-2 border-gold shrink-0"
          style={{ boxShadow: '0 0 12px rgba(197,154,58,.25)' }}
        />
        <div>
          <h1 className="brand-wordmark text-lg sm:text-xl leading-none">VINAYAGAMOORTHY</h1>
          <p className="text-[11px] tracking-[0.22em] mt-0.5" style={{ color: 'var(--ink-brown-mid)' }}>
            {t('brand.tagline')}
          </p>
          <p className="font-manuscript italic text-xs mt-0.5 opacity-80" style={{ color: 'var(--burnt-brown)' }}>
            ஜோதிடம் · அறிவு · அருள்
          </p>
        </div>
      </div>

      <div
        className="hidden lg:flex flex-1 items-center justify-center gap-3 mx-4 select-none"
        aria-hidden="true"
        style={{ color: 'var(--gold)' }}
      >
        <span style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, var(--gold))' }} />
        <span className="om-mark" style={{ fontSize: '1.1rem' }}>ॐ</span>
        <span style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, var(--gold), transparent)' }} />
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <span className="text-sm hidden sm:inline" style={{ color: 'var(--ink-brown)' }}>
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
