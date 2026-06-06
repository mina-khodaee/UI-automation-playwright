
import { CONFIG } from 'src/global-config';

import { AccessGroupListView } from 'src/sections/access-group/view';

// ----------------------------------------------------------------------

const metadata = { title: `Access Group list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <AccessGroupListView />
    </>
  );
}
