import { CONFIG } from 'src/global-config';
import { DestinationInfoListView } from 'src/sections/cash-in-transit/destination-info/view/destination-info-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `مقاصد - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <DestinationInfoListView />
    </>
  );
}
