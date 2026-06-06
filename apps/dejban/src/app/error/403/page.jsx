import { CONFIG } from 'src/global-config';

import { View403 } from '@repo/ui/error';

// ----------------------------------------------------------------------

export const metadata = { title: `403 forbidden! | Error - ${CONFIG.appName}` };

export default function Page() {
  return <View403 />;
}
