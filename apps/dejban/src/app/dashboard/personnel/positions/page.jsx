import { CONFIG } from 'src/global-config';

import { PositionsListView } from 'src/sections/positions/view/positions-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `سمت ها - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <PositionsListView />
    </>
  );
}
