import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

export const metadata = { title: `Home - ${CONFIG.appName}` };

console.log('AppLauncherClient render');

export default function Page() {
  return <div>Home works</div>;
}
