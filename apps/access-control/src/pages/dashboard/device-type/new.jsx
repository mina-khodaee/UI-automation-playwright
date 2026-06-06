
import { CONFIG } from 'src/global-config';

import { DeviceTypeCreateView } from 'src/sections/device-type/view';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new device type | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <DeviceTypeCreateView />
    </>
  );
}
