import { createAppConfig } from '@repo/config';
import { paths } from 'src/routes/paths';

export const CONFIG = createAppConfig({
  appName: 'DejbanNew',
  appVersion: process.env.NEXT_PUBLIC_APP_VERSION || '0.0.0',
  serverUrl: process.env.NEXT_PUBLIC_SERVER_URL || '',
  assetsDir: process.env.NEXT_PUBLIC_ASSETS_DIR || '',
  isStaticExport: process.env.BUILD_STATIC_EXPORT === 'true',
  authRedirectPath: paths.auth.jwt.signIn,
  mapboxApiKey: process.env.NEXT_PUBLIC_MAPBOX_API_KEY || '',
});