
import { CONFIG } from 'src/global-config';

import { CalendarCreateView } from 'src/sections/calendar/view/calendar-create-view';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new calendar | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <CalendarCreateView />
    </>
  );
}
