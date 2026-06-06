'use client';

import 'dayjs/locale/fa';
import 'dayjs/locale/en';

import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AdapterMomentJalaali } from '@mui/x-date-pickers/AdapterMomentJalaali';
import { LocalizationProvider as Provider } from '@mui/x-date-pickers/LocalizationProvider';
import { useTranslate } from './use-locales';

export function LocalizationProvider({ children }) {
  const { currentLang } = useTranslate();
  dayjs.locale(currentLang.adapterLocale);

  return (
    <Provider
      dateAdapter={currentLang.value === 'fa-IR' ? AdapterMomentJalaali : AdapterDayjs}
      adapterLocale={currentLang.adapterLocale}
    >
      {children}
    </Provider>
  );
}
