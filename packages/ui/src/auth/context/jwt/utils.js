import { tokenStorage } from '@repo/api-client';

export function jwtDecode(token) {
  if (!token) return null;

  const parts = token.split('.');
  if (parts.length < 2) {
    throw new Error('Invalid token!');
  }

  const base64Url = parts[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const decoded = JSON.parse(atob(base64));

  return decoded;
}

export function setSession(accessToken) {
  if (accessToken) {
    tokenStorage.setAccess(accessToken);
  } else {
    tokenStorage.clear();
  }
}
