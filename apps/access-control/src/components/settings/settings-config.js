import { createDefaultSettings } from '@repo/ui/components-settings';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

export const SETTINGS_STORAGE_KEY = 'app-settings';

// ----------------------------------------------------------------------

export const defaultSettings = createDefaultSettings(CONFIG);
