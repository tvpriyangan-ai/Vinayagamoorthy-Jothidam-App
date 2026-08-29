import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import translations, { DEFAULT_LANGUAGE, LANGUAGES } from './translations';
import { updateMyProfile } from '../api/client';

// The single key the chosen language lives under. ("app_language" was the old
// name — still read once, then migrated, so nobody loses their choice.)
const STORAGE_KEY = 'language';
const LEGACY_KEYS = ['app_language'];
const VALID = LANGUAGES.map((l) => l.code); // ['ta','ml','en','hi','pa']

// Turn on verbose logging from the browser console with:
//   localStorage.setItem('debug_i18n', '1')   (then reload)
function dbg(...args) {
  try {
    if (localStorage.getItem('debug_i18n')) console.log('[i18n]', ...args);
  } catch { /* ignore */ }
}

function readStored() {
  try {
    for (const k of [STORAGE_KEY, ...LEGACY_KEYS]) {
      const v = localStorage.getItem(k);
      if (VALID.includes(v)) return v;
    }
  } catch { /* private mode / storage disabled */ }
  return null;
}

function persist(code) {
  try {
    localStorage.setItem(STORAGE_KEY, code);
    LEGACY_KEYS.forEach((k) => localStorage.removeItem(k));
  } catch { /* private mode — non-fatal, language still lives in memory */ }
}

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => readStored() || DEFAULT_LANGUAGE);

  // Has the language been PINNED yet? — pinned by an explicit pick in the UI,
  // OR by adopting the account's saved preference once on login. Seeded true
  // when a value is already persisted from a previous visit. While pinned, a
  // profile / API response can NEVER change the language.
  const pinnedRef = useRef(readStored() != null);

  dbg('provider init — language:', language, '| stored:', readStored(), '| pinned:', pinnedRef.current);

  // Keep <html lang> in sync. Persistence is NOT done here on purpose: an
  // effect firing for the tentative startup default must not look like a
  // real choice, or it would block adoptFromProfile below.
  useEffect(() => {
    if (typeof document !== 'undefined') document.documentElement.lang = language;
  }, [language]);

  const applyLanguage = useCallback((code, { sync }) => {
    if (!VALID.includes(code)) return;
    pinnedRef.current = true;
    persist(code);                 // synchronous — happens before any refetch
    setLanguageState(code);
    dbg('applyLanguage:', code, '| sync-to-profile:', !!sync);
    if (sync && localStorage.getItem('access_token')) {
      updateMyProfile({ preferred_language: code })
        .then(() => dbg('profile preferred_language saved:', code))
        .catch((e) => dbg('profile save failed (kept locally):', e?.message));
    }
  }, []);

  // Explicit user choice (language switcher, profile page).
  const setLanguage = useCallback((code) => applyLanguage(code, { sync: true }), [applyLanguage]);

  // Called once after the profile loads. Follows the language saved on the
  // user's account ONLY if the user hasn't already pinned one in this browser.
  const adoptFromProfile = useCallback((code) => {
    if (pinnedRef.current) { dbg('adoptFromProfile skipped (already pinned):', code); return; }
    if (!VALID.includes(code)) { dbg('adoptFromProfile skipped (invalid):', code); return; }
    dbg('adoptFromProfile ->', code);
    applyLanguage(code, { sync: false });
  }, [applyLanguage]);

  const t = useCallback(
    (key, vars) => {
      const table = translations[language] || translations.en;
      let str = table[key] ?? translations.en[key] ?? key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) str = str.replaceAll(`{${k}}`, v);
      }
      return str;
    },
    [language],
  );

  const value = useMemo(
    () => ({ language, setLanguage, adoptFromProfile, t, languages: LANGUAGES }),
    [language, setLanguage, adoptFromProfile, t],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}

// Convenience: const t = useT();
export function useT() {
  return useLanguage().t;
}
