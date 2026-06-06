import { CONFIG } from 'src/global-config';
import { WeaponModelListView } from 'src/sections/armory/weapon-models/view/weapon-models-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `سلاح - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <WeaponModelListView />
    </>
  );
}
