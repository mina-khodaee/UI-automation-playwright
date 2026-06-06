import { CONFIG } from 'src/global-config';
import { VisitorCardsListView } from 'src/sections/visitor-cards/view/visitor-cards-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `ممنوع الورود ها - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <VisitorCardsListView />
    </>
  );
}
