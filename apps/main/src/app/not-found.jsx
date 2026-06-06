import { NotFoundView } from '@repo/ui/sections-error';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

export const metadata = { title: `404 page not found! | Error - ${CONFIG.appName}` };

// ----------------------------------------------------------------------

export default function Page() {
  return <NotFoundView />;
}
