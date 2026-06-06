import { CONFIG } from 'src/global-config';
import { StationInfoListView } from 'src/sections/armory/station-info/view/station-info-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `ایستگاه ها - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <StationInfoListView />
    </>
  );
}
