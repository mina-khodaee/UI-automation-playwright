
import { CONFIG } from 'src/global-config';

import { TrafficRportView } from 'src/sections/traffic-report/view/traffic-report-view';

// ----------------------------------------------------------------------

const metadata = { title: `Traffic reports | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <TrafficRportView />

    </>
  );
}
