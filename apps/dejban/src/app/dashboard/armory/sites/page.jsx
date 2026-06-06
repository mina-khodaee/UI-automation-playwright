import { CONFIG } from 'src/global-config';
import { SitesListView } from 'src/sections/armory/sites/view/sites-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `مراکز - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <SitesListView />
    </>
  );
}
