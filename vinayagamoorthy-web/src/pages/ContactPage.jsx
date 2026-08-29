import { Link, useNavigate } from 'react-router-dom';
import ParchmentCard from '../components/ParchmentCard';
import { useT } from '../i18n/LanguageContext';

const EMAIL = 'vinayagamoorthyjothidam@gmail.com';
const MAILTO = `mailto:${EMAIL}?subject=${encodeURIComponent('Vinayagamoorthy Jothidam — Enquiry')}`;

export default function ContactPage() {
  const t = useT();
  const navigate = useNavigate();

  return (
    <div className="app-shell flex items-center justify-center px-4 py-10">
      <div className="relative z-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <img
            src="/logo.png"
            alt="Vinayagamoorthy Jothidam"
            className="w-20 h-20 rounded-full border-2 border-gold shadow-lg mb-3"
          />
          <h1 className="brand-wordmark text-2xl text-center">VINAYAGAMOORTHY</h1>
          <p className="gold-heading text-xs tracking-[0.3em] mt-1">JOTHIDAM</p>
        </div>

        <ParchmentCard>
          <h2 className="parchment-heading text-xl text-center mb-4">{t('contact.title')}</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between gap-3">
              <span className="opacity-70">{t('contact.creator')}</span>
              <span className="font-semibold text-right">T. V. Priyangan</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="opacity-70">{t('contact.email')}</span>
              <a
                href={MAILTO}
                className="font-semibold underline break-all"
                style={{ color: 'var(--ink-brown)' }}
              >
                {EMAIL}
              </a>
            </div>
          </div>

          <a href={MAILTO} className="btn-gold block text-center mt-5 text-sm">
            ✉ {t('contact.sendEmail')}
          </a>

          <hr className="manuscript-rule my-5" />

          <div className="flex flex-col items-center text-center">
            <img
              src="/assets/iyya.jpg"
              alt={t('contact.iyyaName')}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
              className="w-28 h-28 rounded-full border-2 border-gold object-cover mb-3"
              style={{ objectPosition: 'center 18%', boxShadow: '0 0 14px rgba(197,154,58,.3)' }}
            />
            <span className="text-xs uppercase tracking-widest opacity-60">
              {t('contact.inspiredBy')}
            </span>
            <span className="font-semibold mt-1" style={{ color: 'var(--parchment-heading)' }}>
              {t('contact.iyyaName')}
            </span>
          </div>
        </ParchmentCard>

        <div className="text-center mt-5">
          <button
            onClick={() => navigate(-1)}
            className="text-xs underline"
            style={{ color: 'var(--gold)' }}
          >
            ← {t('common.back')}
          </button>
          <span className="mx-2 opacity-40" style={{ color: 'var(--gold)' }}>·</span>
          <Link to="/dashboard" className="text-xs underline" style={{ color: 'var(--gold)' }}>
            {t('common.dashboard')}
          </Link>
        </div>

        <p className="text-center text-xs mt-4 opacity-60" style={{ color: 'var(--gold)' }}>
          {t('dash.footer')}
        </p>
      </div>
    </div>
  );
}
