import { CONFIG } from 'src/global-config';
import { ContractorBoardOfDirectorsListView } from 'src/sections/contractor-board-of-directors/view/contractor-board-of-directors-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `هییت مدیره پیمانکاران - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <ContractorBoardOfDirectorsListView />
    </>
  );
}
