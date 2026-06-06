import { AuthGuard } from '@repo/ui/auth-guard';
import { AccountLayout } from '@repo/ui/layouts-dashboard';

import { CONFIG } from 'src/global-config';
import { _account } from 'src/layouts/nav-config-account';

// ----------------------------------------------------------------------

export default function Layout({ children }) {
  if (CONFIG.auth.skip) {
    return <AccountLayout slotProps={{ account: { data: _account } }}>{children}</AccountLayout>;
  }

  return (
    <AuthGuard>
      <AccountLayout slotProps={{ account: { data: _account } }}>{children}</AccountLayout>
    </AuthGuard>
  );
}