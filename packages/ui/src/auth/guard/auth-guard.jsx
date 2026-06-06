'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'src/routes/hooks';
import { SplashScreen } from 'src/components/loading-screen';
import { useConfig } from '@repo/ui/config';
import { useAuthContext } from '../hooks';

export function AuthGuard({ children, signInPath }) {
  const pathname = usePathname();
  const config = useConfig();
  const { authenticated, loading } = useAuthContext();
  const [isChecking, setIsChecking] = useState(true);
  const path = signInPath || config?.auth?.redirectPath || '/auth/jwt/sign-in';

  useEffect(() => {
    if (loading) return;

    if (!authenticated) {
      const queryString = new URLSearchParams({ returnTo: pathname }).toString();
      window.location.href = `${path}?${queryString}`;
      return;
    }

    setIsChecking(false);
  }, [authenticated, loading, pathname, path]);

  if (isChecking) return <SplashScreen />;
  return <>{children}</>;
}