import { CONFIG } from 'src/global-config';
import { AssignEquipmentsListView } from 'src/sections/assign-equipments/view/assign-equipments-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `تخصیص تجهیزات  - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <AssignEquipmentsListView />
    </>
  );
}
