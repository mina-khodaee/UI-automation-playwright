import { CONFIG } from 'src/global-config';
import { AmmunitionInfoListView } from 'src/sections/armory/ammunition-info/view/ammunition-info-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `مهمات - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <AmmunitionInfoListView />
    </>
  );
}
