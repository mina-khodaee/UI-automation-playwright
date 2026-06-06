
import { CONFIG } from 'src/global-config';

import { RegionListView } from 'src/sections/region/view';

// ----------------------------------------------------------------------

const metadata = { title: `Region list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <RegionListView />
    </>
  );
}
