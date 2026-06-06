
import { CONFIG } from 'src/global-config';

import { AccessGroupCreateView } from 'src/sections/access-group/view';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new Access Group | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <AccessGroupCreateView />
    </>
  );
}
