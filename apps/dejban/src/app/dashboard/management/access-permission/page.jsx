import { CONFIG } from 'src/global-config';

import { AccessPermissionNewEditForm } from 'src/sections/access-permission/view/access-permission-view';

// ----------------------------------------------------------------------

const metadata = { title: ` مجوز دسترسی ها - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <AccessPermissionNewEditForm />
    </>
  );
}
