import { CONFIG } from 'src/global-config';
import { PatrolGroupsListView } from 'src/sections/patrol-groups/view/patrol-groups-list-view';

// ----------------------------------------------------------------------

const metadata = { title: ` گروه‌های نگهبانی - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <PatrolGroupsListView />
    </>
  );
}
