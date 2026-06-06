import { CONFIG } from 'src/global-config';
import { ArmoryEquipmentsListView } from 'src/sections/armory/armory-equipments/view/armory-equipments-list-view';

// ----------------------------------------------------------------------

export const metadata = { title: `تعریف تجهیزات - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <ArmoryEquipmentsListView />
    </>
  );
}
