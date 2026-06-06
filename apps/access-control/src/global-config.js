import { createAppConfig } from '@repo/config';

import { paths } from './routes/paths';

export const CONFIG = createAppConfig({
  appName: 'Dejban',
  appVersion: import.meta.env.VITE_APP_VERSION || '0.0.0',
  serverUrl: import.meta.env.VITE_SERVER_URL || '',
  assetsDir: import.meta.env.VITE_ASSETS_DIR || '',
  isStaticExport: false,
  authRedirectPath: paths.auth.jwt.signIn,
  mapboxApiKey: import.meta.env.VITE_MAPBOX_API_KEY || '',
});