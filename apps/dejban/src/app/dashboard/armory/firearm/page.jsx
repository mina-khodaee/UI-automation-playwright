import { CONFIG } from 'src/global-config';
import { FirearmListView } from 'src/sections/armory/firearm/view/firearm-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `ُسلاح گرم - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <FirearmListView />
    </>
  );
}
