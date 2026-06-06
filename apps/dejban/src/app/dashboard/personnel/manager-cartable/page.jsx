import { CONFIG } from 'src/global-config';
import ManagerInboxView from 'src/sections/manager-cartable/view/manager-cartable-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `کارتابل مدیر - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <ManagerInboxView />
    </>
  );
}
