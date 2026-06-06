'use client';

import i18next from 'i18next';
import { useMemo } from 'react';
import { getStorage } from 'minimal-shared/utils';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next, I18nextProvider as Provider } from 'react-i18next';

import { CONFIG } from 'src/global-config';

import { i18nOptions, fallbackLng, storageConfig, i18nResourceLoader } from './locales-config';

// ----------------------------------------------------------------------

let i18nextLng;

if (CONFIG.isStaticExport) {
  i18nextLng = getStorage(
    storageConfig.localStorage.key,
    storageConfig.localStorage.autoDetection ? undefined : fallbackLng
  );
}

/**
 * Initialize i18next
 */
const initOptions = CONFIG.isStaticExport
  ? { ...i18nOptions(i18nextLng), detection: { caches: ['localStorage'] } }
  : { ...i18nOptions(), detection: { caches: ['localStorage', 'cookie'] } };

i18next.use(LanguageDetector).use(initReactI18next).use(i18nResourceLoader).init(initOptions);

// ----------------------------------------------------------------------

export function I18nProvider({ lang, children }) {
  /**
   * Language sync across apps:
   * 1. Check localStorage first (shared across all apps on the same domain)
   * 2. Fall back to the server-provided lang (from cookie)
   * This ensures cross-app language consistency.
   */
  useMemo(() => {
    const localLng = getStorage(
      storageConfig.localStorage.key,
      storageConfig.localStorage.autoDetection ? undefined : undefined
    );
    const effectiveLang = localLng || lang;
    if (effectiveLang && i18next.language !== effectiveLang) {
      i18next.changeLanguage(effectiveLang);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Provider i18n={i18next}>{children}</Provider>;
}
