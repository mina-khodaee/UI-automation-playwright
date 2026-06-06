import axios from 'axios';
import { tokenStorage } from './tokenStorage';
import { getErrorMessage } from './getErrorMessage';

function resolveBaseUrl(): string {
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SERVER_URL) {
    return process.env.NEXT_PUBLIC_SERVER_URL;
  }
  // Vite environments
  try {
    // @ts-expect-error - import.meta.env is Vite-specific
    const viteUrl = import.meta.env.VITE_SERVER_URL;
    if (typeof viteUrl === 'string') return viteUrl;
  } catch {}
  return 'http://localhost:5000';
}

export const endpoints = {
  auth: {
    getMe:                    '/auth/getme',
    login:                    '/auth/login',
    refresh:                  '/auth/refresh',
    logout:                   '/auth/logout',
    getMySessions:            '/auth/getmysessions',
    changePassword:           '/auth/changepassword',
    terminateSession:         '/auth/terminatesession',
    TerminateOtherSessions:   '/auth/terminateothersessions',
  },
  uiComponents: {
    list: '/uicomponents/getuicomponents',
  },
};

export function createApiClient(baseURL?: string) {
  const client = axios.create({
    baseURL,
    withCredentials: true, // ← this is what sends the httpOnly refresh cookie automatically
  });

  // ── Request: attach access token + language header ──────────────────
  client.interceptors.request.use((config) => {
    const language = localStorage.getItem('i18nextLng');
    config.headers['Accept-Language'] = language || 'fa-IR';

    const accessToken = tokenStorage.getAccess();
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  });

  // ── Response: handle 401 → refresh (cookie-based) → retry ───────────
  let refreshPromise: Promise<any> | null = null;

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url.includes('/auth/login')
      ) {
        originalRequest._retry = true;

        if (!refreshPromise) {
          refreshPromise = client
            .post(endpoints.auth.refresh)
            .finally(() => {
              refreshPromise = null;
            });
        }

        try {
          const { data, status } = await refreshPromise;

          if (status === 200 && data.accessToken) {
            tokenStorage.setAccess(data.accessToken);
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            return await client(originalRequest);
          }
        } catch (refreshError: any) {
          const status = refreshError.response?.status;
          if (status === 401 || status === 404 || status === 500) {
            try {
              await client.post(endpoints.auth.logout);
            } catch (logoutError) {
              console.error('Logout failed:', logoutError);
            } finally {
              tokenStorage.clear();
              window.location.href = '/auth/jwt/sign-in';
            }
          }

          return Promise.reject(
            getErrorMessage(
              refreshError.response?.data || 'commonTexts.requestError'
            )
          );
        }
      }

      return Promise.reject(
        getErrorMessage(error.response?.data || 'commonTexts.requestError')
      );
    }
  );

  return client;
}

// Single shared instance — all apps import this
export const apiClient = createApiClient(resolveBaseUrl());

// ── Convenience helpers (same as your original) ──────────────────────

export const fetcher = async (args: string | [string, object?]) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await apiClient.get(url, { ...config });
  return res.data;
};

export const getWithParams = async (url: string, params?: object) => {
  const response = await apiClient.get(url, { params });
  return response.data;
};

export const deleteItem = async (url: string, ids: unknown) => {
  await apiClient.delete(url, { data: ids });
  return true;
};

export const createItem = async (url: string, data: unknown) => {
  const response = await apiClient.post(url, data);
  return response.data;
};

export const updateItem = async (url: string, data: unknown) => {
  const response = await apiClient.put(url, data);
  return response.data;
};


