
// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  HOME: '/home/'
};

// ----------------------------------------------------------------------

export const paths = {
  page403: '/error/403',
  page404: '/error/404',
  page500: '/error/500',
  home:
  {
    root: ROOTS.HOME
  },
  // AUTH
  auth: {
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`,
    }
  }
}