export interface AppConfig {
  appName: string;
  appVersion: string;
  serverUrl: string;
  assetsDir: string;
  isStaticExport: boolean;
  auth: {
    method: 'jwt';
    redirectPath: string;
  };
  mapboxApiKey: string;
}

export function createAppConfig(params: {
  appName: string;
  appVersion?: string;
  serverUrl?: string;
  assetsDir?: string;
  isStaticExport?: boolean;
  authRedirectPath?: string;
  mapboxApiKey?: string;
}): AppConfig {
  return {
    appName: params.appName,
    appVersion: params.appVersion || '0.0.0',
    serverUrl: params.serverUrl || '',
    assetsDir: params.assetsDir || '',
    isStaticExport: params.isStaticExport || false,
    auth: {
      method: 'jwt',
      redirectPath: params.authRedirectPath || '/sign-in',
    },
    mapboxApiKey: params.mapboxApiKey || '',
  };
}

export function getApiUrl(appName?: string): string {
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SERVER_URL) {
    return process.env.NEXT_PUBLIC_SERVER_URL;
  }
  // Vite environments
  try {
    // @ts-expect-error - import.meta.env is Vite-specific
    const viteUrl = import.meta.env.VITE_SERVER_URL;
    if (typeof viteUrl === 'string') return viteUrl;
  } catch {}
  return 'https://localhost:5000';
}
