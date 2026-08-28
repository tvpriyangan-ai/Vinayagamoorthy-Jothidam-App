import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export default function LanguageSwitcher({ compact = false }) {
  const { language, setLanguage, languages, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const current = languages.find((l) => l.code === language) || languages[0];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={t('common.language')}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="btn-gold !py-1.5 !px-3 text-sm flex items-center gap-1.5"
      >
        <span aria-hidden="true">🌐</span>
        <span>{compact ? current.code.toUpperCase() : current.label}</span>
        <span aria-hidden="true" className="text-xs opacity-70">▾</span>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 mt-1 z-50 rounded-lg overflow-hidden shadow-lg min-w-[9rem]"
          style={{ background: 'var(--parchment-light)', border: '1px solid var(--parchment-dark)' }}
        >
          {languages.map((l) => (
            <li key={l.code} role="option" aria-selected={l.code === language}>
              <button
                type="button"
                onClick={() => {
                  setLanguage(l.code);
                  setOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm"
                style={{
                  color: 'var(--ink-brown)',
                  background: l.code === language ? 'rgba(201,164,92,0.45)' : 'transparent',
                  fontWeight: l.code === language ? 700 : 500,
                }}
              >
                {l.label}
                <span className="opacity-55 text-xs ml-1.5">{l.english}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
