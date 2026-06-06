import { CONFIG } from 'src/global-config';

import { GuestReportList } from 'src/sections/reports/guest-report/view/guest-report-list-view';

// ----------------------------------------------------------------------

export const metadata = {
  title: `- گزارش ارباب رجوع${CONFIG.appName}`,
};

export default function Page() {
  return <GuestReportList />;
}
