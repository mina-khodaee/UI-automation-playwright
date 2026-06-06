import { CONFIG } from 'src/global-config';
import { StaffAccessReportListView } from 'src/sections/reports/staff-access-report/view/staff-access-report-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `گزارش تردد پرسنل - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <StaffAccessReportListView />
    </>
  );
}
