
import { CONFIG } from 'src/global-config';

import { APIKeyListView } from 'src/sections/api-key/view';

// ----------------------------------------------------------------------

const metadata = { title: `API list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <APIKeyListView />
    </>
  );
}
