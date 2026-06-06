
import { CONFIG } from 'src/global-config';

import { DeviceTypeListView } from 'src/sections/device-type/view';

// ----------------------------------------------------------------------

const metadata = { title: `Device Type list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <DeviceTypeListView />
    </>
  );
}
