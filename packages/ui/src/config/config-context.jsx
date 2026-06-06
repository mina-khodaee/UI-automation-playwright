'use client'

import { createContext, useContext } from 'react';

/**
 * ConfigContext provides framework-neutral app configuration to UI components.
 *
 * Configuration includes:
 * - appName: Name of the application
 * - appVersion: Version string
 * - serverUrl: Backend server URL
 * - assetsDir: Assets directory path
 * - mapboxApiKey: Mapbox API key
 * - auth: Authentication settings (method, redirectPath, skip flag)
 * - isStaticExport: Whether the app is statically exported
 *
 * @example
 * // In your app root:
 * import { CONFIG } from './global-config'; // From your app
 * import { ConfigProvider } from '@repo/ui/config';
 *
 * export default function App() {
 *   return (
 *     <ConfigProvider value={CONFIG}>
 *       <YourComponents />
 *     </ConfigProvider>
 *   );
 * }
 *
 * @example
 * // In a UI component:
 * import { useConfig } from '@repo/ui/config';
 *
 * export function MyComponent() {
 *   const { appName, serverUrl } = useConfig();
 *   return <div>{appName}</div>;
 * }
 */

const ConfigContext = createContext(null);

export function ConfigProvider({ value, children }) {
  if (!value) {
    console.warn(
      'ConfigProvider: No config value provided. Components using useConfig() will receive null. ' +
      'Make sure to provide CONFIG from your app\'s global-config.js'
    );
  }

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  );
}

/**
 * Hook to access app configuration in UI components.
 *
 * @returns {Object|null} The config object, or null if not provided
 * @throws {Error} If used outside of ConfigProvider
 *
 * @example
 * const { appName, serverUrl, mapboxApiKey } = useConfig();
 */
export function useConfig() {
  const context = useContext(ConfigContext);

  if (context === undefined) {
    throw new Error(
      'useConfig must be used within a ConfigProvider. ' +
      'Wrap your app root with <ConfigProvider value={CONFIG}> in your app\'s entry point.'
    );
  }

  return context;
}
