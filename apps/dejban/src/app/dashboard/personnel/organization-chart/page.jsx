import { CONFIG } from 'src/global-config';
import { OrganizationChartView } from 'src/sections/staff/organization-chart-view';

// ----------------------------------------------------------------------

const metadata = { title: `چارت سازمانی - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <OrganizationChartView />
    </>
  );
}
