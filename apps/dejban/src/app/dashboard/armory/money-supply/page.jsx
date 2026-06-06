import { CONFIG } from 'src/global-config';
import { MoneySupplyListView } from 'src/sections/armory/money-supply/view/money-supply-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `عملیات پولرسانی - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <MoneySupplyListView />
    </>
  );
}
