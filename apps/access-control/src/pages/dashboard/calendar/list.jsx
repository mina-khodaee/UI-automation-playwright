
import { CONFIG } from 'src/global-config';

import { CalendarListView } from 'src/sections/calendar/view/calendar-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Calendar list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>
      <CalendarListView />
    </>
  );
}
