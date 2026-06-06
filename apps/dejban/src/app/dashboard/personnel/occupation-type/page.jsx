import { CONFIG } from 'src/global-config';
import { OccupationTypeListView } from 'src/sections/occupation-type/view/occupation-type-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `واحد ها - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <OccupationTypeListView />
    </>
  );
}
