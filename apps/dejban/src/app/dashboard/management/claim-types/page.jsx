import { CONFIG } from 'src/global-config';

import { ClaimTypeListView } from 'src/sections/claim-tyeps/view/claim-types-list-view';

// ----------------------------------------------------------------------

const metadata = { title: ` نوع دسترسی ها - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <ClaimTypeListView />
    </>
  );
}
