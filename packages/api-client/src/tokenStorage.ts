export const STORAGE_KEY = 'jwt_access_token';

export const tokenStorage = {
  getAccess: ()           => localStorage.getItem(STORAGE_KEY),
  setAccess: (t: string)  => localStorage.setItem(STORAGE_KEY, t),
  clear:     ()           => localStorage.removeItem(STORAGE_KEY),
};
