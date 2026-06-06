import { CONFIG } from 'src/global-config';
import { VisitorBlackListView } from 'src/sections/visitor-black-list/view/visitor-black-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `مهمان ممنوع الورود - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <VisitorBlackListView />
    </>
  );
}
