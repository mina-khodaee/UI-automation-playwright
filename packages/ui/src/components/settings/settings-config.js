import { themeConfig } from '../../theme/theme-config';

// -----------------------------------------------------------------------

export const SETTINGS_STORAGE_KEY = 'app-settings';

/**
 * Create default settings with the provided app config.
 * This function accepts framework-neutral config to remain independent of any specific framework.
 * @param {Object} config - App configuration containing appVersion and other settings
 * @returns {Object} Default settings object
 * @example
 * import { createDefaultSettings } from '@repo/ui/settings';
 * import { CONFIG } from './global-config';
 * 
 * const defaultSettings = createDefaultSettings(CONFIG);
 */
export function createDefaultSettings(config = {}) {
  return {
    mode: themeConfig.defaultMode,
    direction: themeConfig.direction,
    contrast: 'default',
    navLayout: 'mini',
    primaryColor: 'default',
    navColor: 'apparent',
    compactLayout: false,
    fontSize: 16,
    fontFamily: themeConfig.fontFamily.primary,
    version: config?.appVersion || '0.0.0',
  };
}

// For backwards compatibility with existing code that imports defaultSettings
// This should be initialized in the app's root with the actual CONFIG
export const defaultSettings = createDefaultSettings();
