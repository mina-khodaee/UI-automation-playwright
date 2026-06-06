import { CONFIG } from 'src/global-config';
import { PersonnelBlackListReasonView } from 'src/sections/personnel-black-list-reasons/view/personnel-black-list-reasons-view';

// ----------------------------------------------------------------------

const metadata = { title: `علل ممنوع الورود پرسنل - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <PersonnelBlackListReasonView />
    </>
  );
}
