import { CONFIG } from 'src/global-config';
import { SecurityEquipmentsListView } from 'src/sections/security-equipments/view/security-equipments-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `تعریف تجهیزات - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <SecurityEquipmentsListView />
    </>
  );
}
