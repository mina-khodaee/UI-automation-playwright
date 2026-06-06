// ----------------------------------------------------------------------

export const fallbackLng = 'fa-IR';
export const languages = ['fa-IR', 'en-US'];
export const RTLLanguages = ['fa-IR'];
export const defaultNS = 'common';

// ----------------------------------------------------------------------

export function i18nOptions(lng = fallbackLng, ns = defaultNS) {
  return {
    // debug: true,
    lng,
    fallbackLng,
    ns,
    defaultNS,
    fallbackNS: defaultNS,
    supportedLngs: languages,
  };
}

// ----------------------------------------------------------------------

export const changeLangMessages = {
  "fa-IR": {
    success: 'زبان نرم‌افزار تغییر کرد',
    error: 'خطا در تغییر زبان نرم‌افزار',
    loading: 'در حال بارگزاری...',
  },
  "en-US": {
    success: 'Language has been changed!',
    error: 'Error changing language!',
    loading: 'Loading...',
  }
};
