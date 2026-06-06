// ----------------------------------------------------------------------

const ROOTS = {
  DASHBOARD: '/dashboard',
  AUTH: '/auth',
};

// ----------------------------------------------------------------------

export const paths = {
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
  },
  auth: {
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`
    }
  },
};
