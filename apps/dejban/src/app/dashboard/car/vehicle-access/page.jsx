import { CONFIG } from 'src/global-config';
import { VehicleAccessBlackListView } from 'src/sections/vehicle-access/view/vehicle-access-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `تردد خودرو - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <VehicleAccessBlackListView />
    </>
  );
}
