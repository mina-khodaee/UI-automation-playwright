import { CONFIG } from 'src/global-config';
import { VisitorAndAppointmentList } from 'src/sections/visitor-and-appointment/view/visitor-and-appointment-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `رزرو مهمان و قرار ملاقات - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <VisitorAndAppointmentList />
    </>
  );
}
