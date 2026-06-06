import { CONFIG } from 'src/global-config';

import { PositionCreateView } from 'src/sections/positions/view/positions-create-view';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new device user | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <PositionCreateView />
    </>
  );
}
