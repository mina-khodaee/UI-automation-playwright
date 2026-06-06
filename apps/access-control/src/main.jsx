import { createRoot } from 'react-dom/client';
import signalRConnection from '@repo/ui/signalR';
import { ConfigProvider } from '@repo/ui/config';
import { initFileThumbnail } from '@repo/ui/file-thumbnail';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router';

import App from './app';
import { CONFIG } from './global-config';
import { routesSection } from './routes/sections';
import { ErrorBoundary } from './routes/components';

// -----------------------------------------------------------------------

// When navigating from the main app, the token is passed via hash fragment.
// Extract it and persist it so auth state is shared across origins in dev.
{
  const hash = window.location.hash.slice(1);
  const params = new URLSearchParams(hash);
  const token = params.get('accessToken');
  if (token) {
    localStorage.setItem('jwt_access_token', token);
    window.history.replaceState({}, '', window.location.pathname);
  }
}

// Initialize app-wide utilities with CONFIG
initFileThumbnail(CONFIG.assetsDir);
signalRConnection.initialize(CONFIG);

// -----------------------------------------------------------------------

const router = createBrowserRouter(
  [
    {
      Component: () => (
        <ConfigProvider value={CONFIG}>
          <App>
            <Outlet />
          </App>
        </ConfigProvider>
      ),
      errorElement: <ErrorBoundary />,
      children: routesSection,
    },
  ],
  { basename: '/access-control' }
);

const root = createRoot(document.getElementById('root'));

root.render(
  <>
    <RouterProvider router={router} />
  </>
);
