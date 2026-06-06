import { CONFIG } from 'src/global-config';
import { ContractorListView } from 'src/sections/contractor/view/contractor-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `پیمانکاران - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <ContractorListView />
    </>
  );
}
