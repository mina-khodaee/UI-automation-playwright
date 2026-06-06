import { CONFIG } from 'src/global-config';
import { OrganizationTreeView } from 'src/sections/staff/organization-tree-view';

// ----------------------------------------------------------------------

const metadata = { title: `درخت سازمانی - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <OrganizationTreeView />
    </>
  );
}
