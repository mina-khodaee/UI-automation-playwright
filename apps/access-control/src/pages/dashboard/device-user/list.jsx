
import { CONFIG } from 'src/global-config';

import { DeviceUserListView } from 'src/sections/device-user/view';

// ----------------------------------------------------------------------

const metadata = { title: `Device user list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <DeviceUserListView />
    </>
  );
}
