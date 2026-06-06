import { CONFIG } from 'src/global-config';
import { DegreeListView } from 'src/sections/degree/view/degree-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `واحد ها - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <DegreeListView />
    </>
  );
}
