import { CONFIG } from 'src/global-config';

import AppLauncherClient from './app-launcher-client';

// ----------------------------------------------------------------------

export const metadata = { title: `Home - ${CONFIG.appName}` };

console.log('AppLauncherClient render');

export default function Page() {
  return <AppLauncherClient />;
}
