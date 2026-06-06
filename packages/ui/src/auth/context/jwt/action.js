'use client';
import { apiClient, endpoints } from '@repo/api-client';
import { tokenStorage } from '@repo/api-client';

export const signInWithPassword = async ({ username, password }) => {
  try {
    const { data } = await apiClient.post(endpoints.auth.login, { username, password });
    const { accessToken, user } = data;
    if (accessToken) {
      tokenStorage.setAccess(accessToken);
    }
    return user || data;
  } catch (error) {
    const message = error.response?.data?.title || error.response?.data?.message || 'Login failed';
    throw new Error(message);
  }
};

export const signOut = async () => {
  await apiClient.post(endpoints.auth.logout);
  tokenStorage.clear();
};
