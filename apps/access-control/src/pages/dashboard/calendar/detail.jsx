
import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetCalendar } from 'src/actions/calendar';

import { CalendarDetailView } from 'src/sections/calendar/view/calendar-detail-view';

// ----------------------------------------------------------------------

const metadata = { title: `calendar details | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const { aclCalendar, aclCalendarLoading, aclCalendarError, mutate } = useGetCalendar(id);


  return (
    <>
        <title> {metadata.title}</title>
      <CalendarDetailView calendar={aclCalendar} loading={aclCalendarLoading} error={aclCalendarError} />
    </>
  );
}
