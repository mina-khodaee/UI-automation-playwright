import { CONFIG } from 'src/global-config';

import { ClaimListView } from 'src/sections/claim-list/view/claim-list-view';

// ----------------------------------------------------------------------

const metadata = { title: ` لیست دسترسی ها - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <ClaimListView />
    </>
  );
}
