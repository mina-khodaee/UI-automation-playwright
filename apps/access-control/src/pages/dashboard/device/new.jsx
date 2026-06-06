
import { CONFIG } from 'src/global-config';

import { DeviceCreateView } from 'src/sections/device/view';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new device | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <DeviceCreateView />
    </>
  );
}
