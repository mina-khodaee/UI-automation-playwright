import { CONFIG } from 'src/global-config';
import { WayInfoListView } from 'src/sections/cash-in-transit/way-info/view/way-info-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `مسیر ها - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <title>{metadata.title}</title>

            <WayInfoListView />
        </>
    );
}
