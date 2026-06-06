import { CONFIG } from 'src/global-config';
import { PatrolAreaListView } from 'src/sections/patrol-area/view/patrol-area-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `محل نگهبانی - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <PatrolAreaListView />
    </>
  );
}
