import '@repo/ui/global-css';

import { useEffect } from 'react';
import { themeConfig, ThemeProvider } from '@repo/ui/theme';
import { AuthProvider as JwtAuthProvider } from '@repo/ui/auth-context-jwt';
import { SettingsDrawer, defaultSettings, SettingsProvider } from '@repo/ui/components-settings';

import { usePathname } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { LocalizationProvider } from 'src/locales';
import { I18nProvider } from 'src/locales/i18n-provider';

import { Snackbar } from 'src/components/snackbar';
import { ProgressBar } from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';


// ----------------------------------------------------------------------

const AuthProvider = CONFIG.auth.method === 'jwt' && JwtAuthProvider;

// ----------------------------------------------------------------------

export default function App({ children }) {
  useScrollToTop();

  return (
    <I18nProvider>
      <AuthProvider>
        <SettingsProvider defaultSettings={defaultSettings}>
          <LocalizationProvider>
            <ThemeProvider
              noSsr
              defaultMode={themeConfig.defaultMode}
              modeStorageKey={themeConfig.modeStorageKey}
            >
              <MotionLazy>
                  <Snackbar />
                  <ProgressBar />
                  <SettingsDrawer defaultSettings={defaultSettings} />
                  {children}
              </MotionLazy>
            </ThemeProvider>
          </LocalizationProvider>
        </SettingsProvider>
      </AuthProvider>
    </I18nProvider>
  );
}

function useScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
