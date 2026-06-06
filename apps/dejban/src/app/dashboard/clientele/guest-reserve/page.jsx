import { CONFIG } from 'src/global-config';
import { GuestReserveList } from 'src/sections/guest-reserve/view/guest-reserve-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `رزرو مهمان - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <GuestReserveList />
    </>
  );
}
