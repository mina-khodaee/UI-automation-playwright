'use client';

import { SettingsProvider } from '../../components/settings';

import { ThemeProvider } from '../../theme/theme-provider';

import { I18nProvider } from 'src/locales/i18n-provider';

import { LocalizationProvider } from 'src/locales/localization-provider';

import { MotionLazy } from 'src/components/animate/motion-lazy';

import { ProgressBar } from 'src/components/progress-bar';

import { Snackbar } from 'src/components/snackbar';

import { detectLanguage } from 'src/locales/server'; // server-side only

// exported so each app's root layout can use it

export { SettingsProvider, ThemeProvider, I18nProvider };