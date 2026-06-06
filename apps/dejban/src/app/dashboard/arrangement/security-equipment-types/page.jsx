import { CONFIG } from 'src/global-config';
import { SecurityEquipmentTypesListView } from 'src/sections/security-equipment-types/view/security-equipment-types-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `انواع تجهیزات نگهبانی - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <SecurityEquipmentTypesListView />
    </>
  );
}
