'use client';

import { useEffect } from 'react';
import { initFileThumbnail } from '@repo/ui/file-thumbnail';
import signalRConnection from '@repo/ui/signalR';
import { CONFIG } from 'src/global-config';
import { ConfigProvider } from '@repo/ui/config';
/**
 * Client initialization component that sets up app-wide dependencies.
 * Must be wrapped in a client component to run on browser startup.
 */
export function ClientInit({ children }) {
  useEffect(() => {
    // Initialize file thumbnail utilities with assets directory
    initFileThumbnail(CONFIG.assetsDir);

    // Initialize SignalR connection
    signalRConnection.initialize(CONFIG);
  }, []);

  return (
    <ConfigProvider value={CONFIG}>
      {children}
    </ConfigProvider>
  );
}
