import { CONFIG } from 'src/global-config';
import { PatrolShiftWorkPeriodListView } from 'src/sections/patrol-shift-work-period/view/patrol-shift-work-period-list-view';

// ----------------------------------------------------------------------

const metadata = { title: ` دوره کاری شیفت  - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <PatrolShiftWorkPeriodListView />
    </>
  );
}
