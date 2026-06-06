
const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/',
  ACCOUNT: '/account'
};

// ----------------------------------------------------------------------

export const paths = {
  maintenance: '/maintenance',
  // AUTH
  auth: {
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    device: {
      root: `${ROOTS.DASHBOARD}device`,
      create: `${ROOTS.DASHBOARD}device/create`,
      edit: (id) => `${ROOTS.DASHBOARD}device/${id}/edit`,
      details: (id) => `${ROOTS.DASHBOARD}device/${id}`
    },
    deviceType: {
      root: `${ROOTS.DASHBOARD}deviceType`,
      create: `${ROOTS.DASHBOARD}deviceType/create`,
      edit: (id) => `${ROOTS.DASHBOARD}deviceType/${id}/edit`,
    },
    region: {
      root: `${ROOTS.DASHBOARD}region`,
    },
    accessGroup: {
      root: `${ROOTS.DASHBOARD}accessGroup`,
      create: `${ROOTS.DASHBOARD}accessGroup/create`,
      edit: (id) => `${ROOTS.DASHBOARD}accessGroup/${id}/edit`,
    },
    aclUserManagement: {
      root: `${ROOTS.DASHBOARD}aclUserManagement`,
      create: `${ROOTS.DASHBOARD}aclUserManagement/create`,
      edit: (id) => `${ROOTS.DASHBOARD}aclUserManagement/${id}/edit`,
      details: (id) => `${ROOTS.DASHBOARD}aclUserManagement/${id}`
    },
    calendar: {
      root: `${ROOTS.DASHBOARD}calendar`,
      create: `${ROOTS.DASHBOARD}calendar/create`,
      edit: (id) => `${ROOTS.DASHBOARD}calendar/${id}/edit`,
      details: (id) => `${ROOTS.DASHBOARD}calendar/${id}`
    },
    trafficReport: {
      root: `${ROOTS.DASHBOARD}trafficReport`,
    },
    APIKeys: {
      root: `${ROOTS.DASHBOARD}ApiKeyManagement`
    }
  },
  // ACCOUNT MANAGER
  account: {
    root: ROOTS.ACCOUNT,
  }
};
