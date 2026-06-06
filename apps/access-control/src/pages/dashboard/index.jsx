
import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

const metadata = { title: `Dashboard - ${CONFIG.appName}` };

export default function OverviewAppPage() {
  return (
    <>
        <title> {metadata.title}</title>
    </>
  );
}
