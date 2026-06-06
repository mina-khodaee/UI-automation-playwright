import { CONFIG } from 'src/global-config';
import { WeaponInfoListView } from 'src/sections/armory/weapon-info/view/weapon-info-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `اسلحه - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <WeaponInfoListView />
    </>
  );
}
