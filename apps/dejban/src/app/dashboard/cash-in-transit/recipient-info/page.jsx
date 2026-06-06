import { CONFIG } from 'src/global-config';
import { RecipientInfoListView } from 'src/sections/cash-in-transit/recipient-info/view/recipient-info-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `تحویلدار - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <RecipientInfoListView />
    </>
  );
}
