import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import translations, { DEFAULT_LANGUAGE, LANGUAGES } from './translations';
import { updateMyProfile } from '../api/client';

const STORAGE_KEY = 'app_language';
const VALID = LANGUAGES.map((l) => l.code);

const LanguageContext = createContext(null);

function readStored() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return VALID.includes(v) ? v : null;
  } catch {
    return null;
  }
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => readStored() || DEFAULT_LANGUAGE);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch { /* private mode — non-fatal */ }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  const setLanguage = useCallback((code) => {
    if (!VALID.includes(code)) return;
    setLanguageState(code);
    // Best-effort sync so the AI (chat + jathagam reading) answers in this language.
    if (localStorage.getItem('access_token')) {
      updateMyProfile({ preferred_language: code }).catch(() => {});
    }
  }, []);

  // If the profile loads with a different saved language and the user hasn't
  // explicitly chosen one this session, adopt the profile's.
  const adoptFromProfile = useCallback((code) => {
    if (VALID.includes(code) && !readStored()) setLanguageState(code);
  }, []);

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
