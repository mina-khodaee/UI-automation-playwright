import { CONFIG } from 'src/global-config';
import { VehicleEquipmentsListView } from 'src/sections/vehicle-equipments/view/vehicle-equipments-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `تجهیزات خودرو - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <VehicleEquipmentsListView />
    </>
  );
}
