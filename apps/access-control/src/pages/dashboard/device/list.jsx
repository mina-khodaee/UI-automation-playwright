
import { CONFIG } from 'src/global-config';

import { DeviceListView } from 'src/sections/device/view';

// ----------------------------------------------------------------------

const metadata = { title: `Device list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <DeviceListView />
    </>
  );
}
