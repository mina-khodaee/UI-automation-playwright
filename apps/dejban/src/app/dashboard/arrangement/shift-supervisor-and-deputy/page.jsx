import { CONFIG } from 'src/global-config';
import { ShiftSupervisorAndDeputyListView } from 'src/sections/shift-supervisor-and-deputy/view/shift-supervisor-and-deputy-list-view';

const metadata = { title: `لوح نگهبانی - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <ShiftSupervisorAndDeputyListView />
    </>
  );
}
