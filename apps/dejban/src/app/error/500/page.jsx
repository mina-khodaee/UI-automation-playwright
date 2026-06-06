import { CONFIG } from 'src/global-config';

import { View500 } from '@repo/ui/error';

// ----------------------------------------------------------------------

export const metadata = {
  title: `500 Internal server error! | Error - ${CONFIG.appName}`,
};

export default function Page() {
  return <View500 />;
}
