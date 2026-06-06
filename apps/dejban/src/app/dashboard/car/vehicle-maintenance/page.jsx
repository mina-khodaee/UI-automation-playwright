import { CONFIG } from 'src/global-config';
import { VehicleMaintenanceListView } from 'src/sections/vehicle-maintenance/view/vehicle-maintenance-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `تعمیرات و نگهداری - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <VehicleMaintenanceListView />
    </>
  );
}
