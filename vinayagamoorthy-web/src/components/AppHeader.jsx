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
      <div className="flex items-center gap-4">
        <img
          src="/logo.png"
          alt="Vinayagamoorthy Jothidam"
          className="w-16 h-16 sm:w-[4.75rem] sm:h-[4.75rem] rounded-full border-2 border-gold shrink-0"
          style={{ boxShadow: '0 0 0 3px rgba(58,31,15,.7), 0 0 18px rgba(197,154,58,.4)' }}
        />
        <div>
          <h1
            className="brand-wordmark text-2xl sm:text-[1.85rem] leading-none"
            style={{
              color: '#8a5a12',
              letterSpacing: '0.1em',
              textShadow: '0 1px 0 rgba(255,240,205,.5), 0 -1px 0 rgba(0,0,0,.22), 0 2px 3px rgba(0,0,0,.25)',
            }}
          >
            VINAYAGAMOORTHY
          </h1>
          <p
            className="text-[11px] sm:text-xs tracking-[0.32em] mt-1 font-semibold"
            style={{ color: 'var(--parchment-heading)' }}
          >
            {t('brand.tagline')}
          </p>
          <p
            className="font-manuscript italic text-sm mt-0.5"
            style={{ color: 'var(--engrave)' }}
          >
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
