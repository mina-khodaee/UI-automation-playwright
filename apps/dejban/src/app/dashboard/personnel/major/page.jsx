import { CONFIG } from 'src/global-config';
import { MajorListView } from 'src/sections/major/view/major-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `واحد ها - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <MajorListView />
    </>
  );
}
