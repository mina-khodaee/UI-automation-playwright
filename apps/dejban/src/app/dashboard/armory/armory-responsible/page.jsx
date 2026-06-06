import { CONFIG } from 'src/global-config';
import { ArmoryResponsibleListView } from 'src/sections/armory/armory-responsible/view/armory-responsible-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `مسئول اسلحه خانه - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <ArmoryResponsibleListView />
    </>
  );
}
