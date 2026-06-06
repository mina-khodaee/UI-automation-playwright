import 'src/global.css';
import { SettingsDrawer, defaultSettings, SettingsProvider } from '@repo/ui/components-settings';
import { themeConfig, ThemeProvider, primary as primaryColor } from '@repo/ui/theme';;

import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';

import { CONFIG } from 'src/global-config';
import { LocalizationProvider } from 'src/locales';
import { detectLanguage } from '../locales/server';
import { I18nProvider } from 'src/locales/i18n-provider';

import { Snackbar } from 'src/components/snackbar';
import { ProgressBar } from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';

import { AuthProvider as JwtAuthProvider } from '@repo/ui/auth-context-jwt';
import { ClientProviders } from 'src/components/react-query-provider/client-providers';
import { ClientInit } from './client-init';

const AuthProvider = CONFIG.auth.method === 'jwt' && JwtAuthProvider;

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: primaryColor.main,
};

export const metadata = {
  title: {
    default: 'سامانه جامع دژبان',
    template: '%s | سامانه جامع دژبان',
  },
  description: 'توضیحات سامانه دژبان',
  icons: [
    {
      rel: 'icon',
      url: `${CONFIG.assetsDir}/logo/dejban-logo.jpg`,
    },
  ],
};

async function getAppConfig() {
  const lang = CONFIG.isStaticExport ? 'en' : await detectLanguage();

  return {
    lang,
    i18nLang: lang,
    dir: defaultSettings.direction,
  };
}

export default async function RootLayout({ children }) {
  const appConfig = await getAppConfig();
  return (
    <html lang={appConfig.lang} dir={appConfig.dir} suppressHydrationWarning>
      <head>
        <InitColorSchemeScript
          modeStorageKey={themeConfig.modeStorageKey}
          attribute={themeConfig.cssVariables.colorSchemeSelector}
          defaultMode={themeConfig.defaultMode}
        />
      </head>
      <body>

        <I18nProvider lang={appConfig.i18nLang}>
          <AuthProvider>
            <SettingsProvider
              defaultSettings={defaultSettings}
            >
              <LocalizationProvider>
                <ThemeProvider
                  modeStorageKey={themeConfig.modeStorageKey}
                  defaultMode={themeConfig.defaultMode}
                >
                  <ClientInit>
                    <ClientProviders>
                      <MotionLazy>
                        <Snackbar />
                        <ProgressBar />
                        <SettingsDrawer defaultSettings={defaultSettings} />
                        {children}
                      </MotionLazy>
                    </ClientProviders>
                  </ClientInit>
                </ThemeProvider>
              </LocalizationProvider>
            </SettingsProvider>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
