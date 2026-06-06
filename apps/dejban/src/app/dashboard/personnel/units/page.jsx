import { CONFIG } from 'src/global-config';

import { UnitsListView } from 'src/sections/units/view/units-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `واحد ها - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <UnitsListView />
    </>
  );
}
