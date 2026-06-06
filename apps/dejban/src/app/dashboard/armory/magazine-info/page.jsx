import { CONFIG } from 'src/global-config';
import { MagazineInfoListView } from 'src/sections/armory/magazine-info/view/magazine-info-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `خشاب - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <MagazineInfoListView />
    </>
  );
}
