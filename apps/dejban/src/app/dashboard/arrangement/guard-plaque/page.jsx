import { CONFIG } from 'src/global-config';
import { GuardPlaqueListView } from 'src/sections/guard-plaque/view/guard-plaque-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `لوح نگهبانی - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <GuardPlaqueListView />
    </>
  );
}
