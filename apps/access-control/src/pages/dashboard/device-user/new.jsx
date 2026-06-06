
import { CONFIG } from 'src/global-config';

import { DeviceUserCreateView } from 'src/sections/device-user/view';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new device user | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <DeviceUserCreateView />
    </>
  );
}
