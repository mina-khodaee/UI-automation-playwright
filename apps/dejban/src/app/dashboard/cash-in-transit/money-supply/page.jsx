import { CONFIG } from 'src/global-config';
import { MoneySupplyListView } from 'src/sections/cash-in-transit/money-supply/view/money-supply-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `عملیات پول رسانی - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <MoneySupplyListView />
    </>
  );
}
