import { themeConfig } from '@repo/ui/theme';

// -----------------------------------------------------------------------

export const SETTINGS_STORAGE_KEY = 'app-settings';

// NOTE: This defaultSettings will be initialized with CONFIG in the app layout
// See: src/app/layout.jsx for initialization
export let defaultSettings = {
  mode: themeConfig.defaultMode,
  // direction: themeConfig.direction,
  direction: 'rtl',
  contrast: 'default',
  navLayout: 'vertical',
  primaryColor: 'preset3',
  navColor: 'apparent',
  compactLayout: true,
  fontSize: 14,
  fontFamily: themeConfig.fontFamily.primary,
  version: '0.0.0',
};

/**
 * Initialize defaultSettings with app configuration.
 * This should be called once during app startup.
 * @param {Object} config - App configuration object
 */
export function initializeDefaultSettings(config) {
  defaultSettings = {
    ...defaultSettings,
    version: config?.appVersion || '0.0.0',
  };
}
