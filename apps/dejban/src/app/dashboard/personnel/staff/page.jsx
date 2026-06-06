import { CONFIG } from 'src/global-config';
import { StaffListView } from 'src/sections/staff/view/staff-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `پرسنل - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <StaffListView />
    </>
  );
}
