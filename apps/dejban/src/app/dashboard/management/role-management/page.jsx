import { CONFIG } from 'src/global-config';

import { RoleManagementListView } from 'src/sections/role-management/view';

// ----------------------------------------------------------------------

export const metadata = { title: `مدیریت نقش‌ها - ${CONFIG.appName}` };

export default function Page() {
  return <RoleManagementListView />;
}
