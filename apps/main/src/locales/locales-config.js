import resourcesToBackend from 'i18next-resources-to-backend';

// MUI Core Locales
import {
  faIR as faIRCore
} from '@mui/material/locale';
// MUI Date Pickers Locales
import {
  enUS as enUSDate,
  faIR as faIRDate
} from '@mui/x-date-pickers/locales';
// MUI Data Grid Locales
import {
  enUS as enUSDataGrid,
  faIR as faIRDataGrid
} from '@mui/x-data-grid/locales';

// ----------------------------------------------------------------------

// Supported languages
export const supportedLngs = ['fa-IR', 'en-US'];

// Fallback and default namespace
export const fallbackLng = 'fa-IR';
export const defaultNS = 'common';

// Right to left languages
export const RTLLanguages = ['fa-IR'];

// Storage config
export const storageConfig = {
  cookie: { key: 'i18next', autoDetection: false },
  localStorage: { key: 'i18nextLng', autoDetection: false },
};

// ----------------------------------------------------------------------

/**
 * @countryCode https://flagcdn.com/en/codes.json
 * @adapterLocale https://github.com/iamkun/dayjs/tree/master/src/locale
 * @numberFormat https://simplelocalize.io/data/locales/
 */

export const allLangs = [
  {
    value: 'en-US',
    label: 'English',
    countryCode: 'GB',
    adapterLocale: 'en',
    numberFormat: { code: 'en-US', currency: 'USD' },
    systemValue: {
      components: { ...enUSDate.components, ...enUSDataGrid.components },
    },
  },
  {
    value: 'fa-IR',
    label: 'Farsi',
    countryCode: 'IR',
    adapterLocale: 'fa',
    numberFormat: { code: 'fa-IR', currency: 'IRR' },
    systemValue: {
      components: { ...faIRCore.components, ...faIRDate.components, ...faIRDataGrid.components },
    },
  }
];

// ----------------------------------------------------------------------

export const i18nResourceLoader = resourcesToBackend(
  (lang, namespace) => import(`./langs/${lang}/${namespace}.json`)
);

export function i18nOptions(lang = fallbackLng, namespace = defaultNS) {
  return {
    // debug: true,
    supportedLngs,
    fallbackLng,
    lng: lang,
    /********/
    fallbackNS: defaultNS,
    defaultNS,
    ns: namespace,
  };
}

export function getCurrentLang(lang) {
  const fallbackLang = allLangs.find((l) => l.value === fallbackLng) ?? allLangs[0];

  if (!lang) {
    return fallbackLang;
  }

  return allLangs.find((l) => l.value === lang) ?? fallbackLang;
}
