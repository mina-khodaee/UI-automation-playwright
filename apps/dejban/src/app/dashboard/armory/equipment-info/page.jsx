import { CONFIG } from 'src/global-config';
import { EquipmentInfoListView } from 'src/sections/armory/equipment-info/view/equipment-info-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `تجهیزات - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <EquipmentInfoListView />
    </>
  );
}
