
import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetCalendar } from 'src/actions/calendar';

import { CalendarEditView } from 'src/sections/calendar/view/calendar-edit-view';

// ----------------------------------------------------------------------

const metadata = { title: `calendar edit | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const { aclCalendar, aclCalendarLoading, mutate } = useGetCalendar(id);


  return (
    <>
      <title> {metadata.title}</title>
      <CalendarEditView calendar={aclCalendar} calendarLoading={aclCalendarLoading} />
    </>
  );
}
