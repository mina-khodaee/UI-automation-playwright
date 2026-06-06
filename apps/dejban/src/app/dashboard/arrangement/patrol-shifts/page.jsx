import { CONFIG } from 'src/global-config';
import { PatrolShiftsListView } from 'src/sections/patrol-shifts/view/patrol-shifts-list-view';

// ----------------------------------------------------------------------

const metadata = { title: ` شیفت های نگهبانی - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <PatrolShiftsListView />
    </>
  );
}
