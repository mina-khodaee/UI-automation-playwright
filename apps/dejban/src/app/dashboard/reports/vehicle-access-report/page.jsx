import { CONFIG } from 'src/global-config';
import { VehicleAccessReportListView } from 'src/sections/reports/vehicle-access-report/view/vehicle-access-report-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `گزارش تردد خودرو ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <VehicleAccessReportListView />
    </>
  );
}
