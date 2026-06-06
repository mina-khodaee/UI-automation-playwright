'use client';

import i18next from 'i18next';
import { useMemo } from 'react';
import { getStorage } from 'minimal-shared/utils';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next, I18nextProvider as Provider } from 'react-i18next';

import { i18nOptions, fallbackLng, storageConfig, i18nResourceLoader } from './locales-config';

// ----------------------------------------------------------------------

export function I18nProvider({ lang, children, isStaticExport = false }) {
  /**
   * Cookie storage
   * Restore the selected language after a page refresh.
   * since i18next might lose the language state on reload.
   */
  const i18nextLng = isStaticExport
    ? getStorage(
      storageConfig.localStorage.key,
      storageConfig.localStorage.autoDetection ? undefined : fallbackLng
    )
    : undefined;

  const initOptions = isStaticExport
    ? { ...i18nOptions(i18nextLng), detection: { caches: ['localStorage'] } }
    : { ...i18nOptions(), detection: { caches: ['localStorage', 'cookie'] } };

  i18next.use(LanguageDetector).use(initReactI18next).use(i18nResourceLoader).init(initOptions);

  useMemo(() => {
    if (lang) {
      i18next.changeLanguage(lang);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Provider i18n={i18next}>{children}</Provider>;
}
