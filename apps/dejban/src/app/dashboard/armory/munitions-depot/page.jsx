import { CONFIG } from 'src/global-config';
import { MunitionsDepotListView } from 'src/sections/armory/munitions-depot/view/munitions-depot-list-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Armory | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <MunitionsDepotListView />;
}
