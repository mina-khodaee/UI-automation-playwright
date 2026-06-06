'use client';

import dayjs from 'dayjs';
import { useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { useRouter } from 'src/routes/hooks';

import { toast } from 'src/components/snackbar';
import { useSettingsContext } from '../components/settings';

import { fallbackLng, getCurrentLang } from './locales-config';

// ----------------------------------------------------------------------

export function useTranslate(namespace) {
  const router = useRouter();
  const settings = useSettingsContext();

  const { t, i18n } = useTranslation(namespace);
  const { t: tMessages } = useTranslation();

  const currentLang = getCurrentLang(i18n.resolvedLanguage);

  const updateDirection = useCallback(
    (lang) => {
      settings.setState({ direction: i18n.dir(lang) });
    },
    [i18n, settings]
  );

  const updateDayjsLocale = useCallback((lang) => {
    const updatedLang = getCurrentLang(lang);
    dayjs.locale(updatedLang.adapterLocale);
  }, []);

  const handleChangeLang = useCallback(
    async (lang) => {
      try {
        const changeLangPromise = i18n.changeLanguage(lang);

        toast.promise(changeLangPromise, {
          loading: tMessages('commonTexts.languageSwitchLoading'),
          success: () => tMessages('commonTexts.languageSwitchSuccess'),
          error: () => tMessages('commonTexts.languageSwitchError'),
        });

        await changeLangPromise;

        updateDirection(lang);
        updateDayjsLocale(lang);

        try {
          const direction = i18n.dir(lang);
          const stored = localStorage.getItem('app-settings');
          const parsed = stored ? JSON.parse(stored) : {};
          if (parsed.direction !== direction) {
            parsed.direction = direction;
            localStorage.setItem('app-settings', JSON.stringify(parsed));
          }
        } catch (e) {}

        router.refresh(); // only nextjs
        } catch (err) {
          console.error(err);
          try {
            toast.error(tMessages('commonTexts.languageSwitchError'));
          } catch {
            // ignore errors from toast during error reporting
          }
        }
    },
    [i18n, router, tMessages, updateDayjsLocale, updateDirection]
  );

  const handleResetLang = useCallback(() => {
    handleChangeLang(fallbackLng);
  }, [handleChangeLang]);

  return {
    t,
    i18n,
    currentLang,
    onChangeLang: handleChangeLang,
    onResetLang: handleResetLang,
  };
}

// ----------------------------------------------------------------------

export function useLocaleDirectionSync() {
  const { i18n, currentLang } = useTranslate();
  const { state, setState } = useSettingsContext();

  const handleSync = useCallback(async () => {
    const selectedLang = currentLang.value;
    const i18nDir = i18n.dir(selectedLang);

    if (document.dir !== i18nDir) {
      document.dir = i18nDir;
    }

    if (state.direction !== i18nDir) {
      setState({ direction: i18nDir });
    }

    if (i18n.resolvedLanguage !== selectedLang) {
      await i18n.changeLanguage(selectedLang);
    }
  }, [currentLang.value, i18n, setState, state.direction]);

  useEffect(() => {
    handleSync();
  }, [handleSync]);

  return null;
}
