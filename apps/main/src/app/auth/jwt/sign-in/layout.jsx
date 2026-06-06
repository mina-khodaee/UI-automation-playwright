
import { CONFIG } from 'src/global-config';

import { GuestGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------
const metadata = { title: `Sign in | Jwt - ${CONFIG.appName}` };

export default function Layout({ children }) {
  return (
    <GuestGuard>
      <title> {metadata.title}</title>
        {children}
    </GuestGuard>
  );
}

