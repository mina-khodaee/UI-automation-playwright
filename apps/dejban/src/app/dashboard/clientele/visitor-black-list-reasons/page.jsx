import { CONFIG } from 'src/global-config';
import { VisitorBlackListReasonView } from 'src/sections/visitor-black-list-reasons/view/visitor-black-list-reasons-view';

// ----------------------------------------------------------------------

const metadata = { title: `علل ممنوع الورود مهمان - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <VisitorBlackListReasonView />
    </>
  );
}
