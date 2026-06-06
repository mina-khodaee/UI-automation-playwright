import { CONFIG } from 'src/global-config';

import { GuestVisitor } from 'src/sections/guest-visitor/view/guest-visitor-view';

// ----------------------------------------------------------------------

export const metadata = {
  title: `Account general settings | Dashboard - ${CONFIG.appName}`,
};

export default function Page() {
  return <GuestVisitor />;
}
