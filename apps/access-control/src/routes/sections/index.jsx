import { Navigate } from 'react-router';

import { mainRoutes } from './main';
import { dashboardRoutes } from './dashboard';

// ----------------------------------------------------------------------

export const routesSection = [
  // Dashboard
  ...dashboardRoutes,

  // Main
  ...mainRoutes,

  // No match
  { path: '*', element: <Navigate to="/404" replace /> },
];
