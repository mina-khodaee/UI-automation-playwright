'use client';

import { useEffect } from 'react';
import signalRConnection from '@repo/ui/signalR';
import { ConfigProvider } from '@repo/ui/config';
import { initFileThumbnail } from '@repo/ui/file-thumbnail';
import { CONFIG } from 'src/global-config';

/**
 * Client initialization component that sets up app-wide dependencies.
 * Must be wrapped in a client component to run on browser startup.
 */
export function ClientInit({ children }) {
  useEffect(() => {

    initFileThumbnail(CONFIG.assetsDir);

    signalRConnection.initialize(CONFIG);
  }, []);

  return (
    <ConfigProvider value={CONFIG}>
      {children}
    </ConfigProvider>
  );
}
