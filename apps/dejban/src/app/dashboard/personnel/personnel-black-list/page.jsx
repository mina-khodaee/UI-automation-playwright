import { CONFIG } from 'src/global-config';
import { PersonnelBlackListView } from 'src/sections/personnel-black-list/view/personnel-black-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `پرسنل ممنوع الورود - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <PersonnelBlackListView />
    </>
  );
}
