
import { View500 } from '@repo/ui/error';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

const metadata = { title: `500 Internal server error! | Error - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <View500 />
    </>
  );
}
