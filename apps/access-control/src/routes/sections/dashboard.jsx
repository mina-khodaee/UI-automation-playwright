import { Outlet } from 'react-router';
import { lazy, Suspense, useMemo } from 'react';
import { AuthGuard } from '@repo/ui/auth-guard';
import { DashboardLayout } from '@repo/ui/layouts-dashboard';

import { usePathname } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useTranslate } from 'src/locales';
import { _account } from 'src/layouts/nav-config-account';
import { navData } from 'src/layouts/nav-config-dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

// Device
const DevicesPage = lazy(() => import('src/pages/dashboard/device/list'));
const DevicePage = lazy(() => import('src/pages/dashboard/device/detail'));
const NewDevicePage = lazy(() => import('src/pages/dashboard/device/new'));
const EditDevicePage = lazy(() => import('src/pages/dashboard/device/edit'));
// DeviceType
const DeviceTypesPage = lazy(() => import('src/pages/dashboard/device-type/list'));
const EditDeviceTypePage = lazy(() => import('src/pages/dashboard/device-type/edit'));
const NewDeviceTypePage = lazy(() => import('src/pages/dashboard/device-type/new'));
// Region
const RegionsPage = lazy(() => import('src/pages/dashboard/region/list'));
// Traffic Report
const TrafficReportPage = lazy(() => import('src/pages/dashboard/traffic-report/list'));
// Calendar
const CalendarsPage = lazy(() => import('src/pages/dashboard/calendar/list'));
const CalendarPage = lazy(() => import('src/pages/dashboard/calendar/detail'));
const NewCalendarPage = lazy(() => import('src/pages/dashboard/calendar/new'));
const EditCalendarPage = lazy(() => import('src/pages/dashboard/calendar/edit'));
// Access Group
const AccessGroupsPage = lazy(() => import('src/pages/dashboard/access-group/list'));
const NewAccessGroupPage = lazy(() => import('src/pages/dashboard/access-group/new'));
const EditAccessGroupPage = lazy(() => import('src/pages/dashboard/access-group/edit'));
// ACL User Management
const ACLUsersManagementsPage = lazy(() => import('src/pages/dashboard/device-user/list'));
const ACLUserManagementPage = lazy(() => import('src/pages/dashboard/device-user/detail'));
const NewACLUserManagementPage = lazy(() => import('src/pages/dashboard/device-user/new'));
const EditACLUserManagementPage = lazy(() => import('src/pages/dashboard/device-user/edit'));
// API Key
const APIKeysPage = lazy(() => import('src/pages/dashboard/api-key/list'));
// Overview
const IndexPage = lazy(() => import('src/pages/dashboard'));

// ----------------------------------------------------------------------

function translateItem(item, t) {
  return {
    ...item,
    title: t(item.title),
    children: item.children ? item.children.map((child) => translateItem(child, t)) : undefined,
    caption: item.caption ? t(item.caption) : undefined,
  };
}

function DashboardLayoutWrapper() {
  const { t } = useTranslate('navbar');
  const pathname = usePathname();

  const translatedNavData = useMemo(
    () =>
      navData.map((group) => ({
        ...group,
        subheader: group.subheader ? t(group.subheader) : undefined,
        items: group.items.map((item) => translateItem(item, t)),
      })),
    [t]
  );

  return (
    <DashboardLayout
      pathname={pathname}
      slotProps={{
        nav: { data: translatedNavData },
        account: { data: _account },
      }}
    >
      <Suspense fallback={<LoadingScreen />}>
        <Outlet />
      </Suspense>
    </DashboardLayout>
  );
}

export const dashboardRoutes = [
  {
    path: '/',
    element: CONFIG.auth.skip ? <DashboardLayoutWrapper /> : <AuthGuard><DashboardLayoutWrapper /></AuthGuard>,
    children: [
      { element: <IndexPage />, index: true },
      {
        path: 'device',
        children: [
          { element: <DevicesPage />, index: true },
          { path: 'list', element: <DevicesPage /> },
          { path: ':id', element: <DevicePage /> },
          { path: ':id/edit', element: <EditDevicePage /> },
          { path: 'create', element: <NewDevicePage /> },
        ],
      },
      {
        path: 'deviceType',
        children: [
          { element: <DeviceTypesPage />, index: true },
          { path: 'list', element: <DeviceTypesPage /> },
          { path: ':id/edit', element: <EditDeviceTypePage /> },
          { path: 'create', element: <NewDeviceTypePage /> },
        ],
      },
      {
        path: 'region',
        children: [
          { element: <RegionsPage />, index: true },
          { path: 'list', element: <RegionsPage /> }
        ],
      },
      {
        path: 'calendar',
        children: [
          { element: <CalendarsPage />, index: true },
          { path: 'list', element: <CalendarsPage /> },
          { path: ':id', element: <CalendarPage /> },
          { path: ':id/edit', element: <EditCalendarPage /> },
          { path: 'create', element: <NewCalendarPage /> },
        ],
      },
      {
        path: 'trafficReport',
        children: [
          { element: <TrafficReportPage />, index: true },
        ],
      },
      {
        path: 'accessGroup',
        children: [
          { element: <AccessGroupsPage />, index: true },
          { path: 'list', element: <AccessGroupsPage /> },
          { path: ':id/edit', element: <EditAccessGroupPage /> },
          { path: 'create', element: <NewAccessGroupPage /> },
        ],
      },
      {
        path: 'aclUserManagement',
        children: [
          { element: <ACLUsersManagementsPage />, index: true },
          { path: 'list', element: <ACLUsersManagementsPage /> },
          { path: ':id', element: <ACLUserManagementPage /> },
          { path: ':id/edit', element: <EditACLUserManagementPage /> },
          { path: 'create', element: <NewACLUserManagementPage /> },
        ],
      },
      {
        path: 'ApiKeyManagement',
        children: [
          { element: <APIKeysPage />, index: true },
          { path: 'list', element: <APIKeysPage /> }
        ],
      }
    ],
  },
];
