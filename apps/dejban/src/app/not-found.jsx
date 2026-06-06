
import { CONFIG } from 'src/global-config';

import { NotFoundView } from '@repo/ui/error';

// ----------------------------------------------------------------------

export const metadata = { title: `404 page not found! | Error - ${CONFIG.appName}` };

export default function Page() {
  return <NotFoundView />;
}
