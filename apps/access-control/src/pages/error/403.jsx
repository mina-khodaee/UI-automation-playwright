import { View403 } from '@repo/ui/error';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

const metadata = { title: `403 forbidden! | Error - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <View403 />
    </>
  );
}
