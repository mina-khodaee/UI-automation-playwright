import { CONFIG } from 'src/global-config';
import LocationTreeNew from 'src/sections/location/view/location-tree-view';

// ----------------------------------------------------------------------

const metadata = { title: `مکان ها - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <LocationTreeNew />
    </>
  );
}
