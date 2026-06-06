import { CONFIG } from 'src/global-config';
import { ContractAgreementListView } from 'src/sections/contracting-agreement/view/contracting-agreement-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `قرارداد پیمانکاران - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <ContractAgreementListView />
    </>
  );
}
