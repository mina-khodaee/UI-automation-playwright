import { CONFIG } from 'src/global-config';
import { ArmoryInventoryListView } from 'src/sections/armory/armory-inventory/view/armory-inventory-list-view';

// ----------------------------------------------------------------------

export const metadata = { title: `تعریف تجهیزات - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <ArmoryInventoryListView />
    </>
  );
}


