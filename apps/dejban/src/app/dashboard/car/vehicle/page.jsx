import { CONFIG } from 'src/global-config';
import { VehicleListView } from 'src/sections/vehicle/view/vehicle-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `خودرو ها - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <VehicleListView />
    </>
  );
}
