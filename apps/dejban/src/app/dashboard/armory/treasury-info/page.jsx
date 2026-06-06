import { CONFIG } from 'src/global-config';
import { TreasuryInfoListView } from 'src/sections/armory/treasury/view/treasury-info-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `خزانه - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <TreasuryInfoListView />
    </>
  );
}
