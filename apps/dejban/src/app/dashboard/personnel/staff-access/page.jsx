import { CONFIG } from 'src/global-config';
import { StaffAccessBlackListView } from 'src/sections/staff-access/view/staff-access-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `تردد پرسنل - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <StaffAccessBlackListView />
    </>
  );
}
