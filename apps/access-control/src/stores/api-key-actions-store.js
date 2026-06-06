import { create } from "zustand";

import { createItem, deleteItem, endpoints, fetcher, updateItem } from "src/lib/api";

// ----------------------------------------------------------------------

export const useAPIKeyActions = create((set) => ({
  allAPIKeys: [],
  myAPIKeys: [],
  createdKey: null,
  myAPIKeyById: null,
  APIKeyById: null,
  params: {},
  scopes: [],
  totalCount: 0,
  loading: {
    fetch: false,
    myFetch: false,
    delete: false,
    create: false,
    update: false,
    scopes: false
  },
  error: null,

  getMyAPIKeys: async (pageSize, page) => {
    try {
      set((state) => ({
        loading: { ...state.loading, myFetch: true },
        error: null
      }));
      const response = await fetcher([endpoints.apiKeyManagement.myList, { params: { pageSize, page, sortColumn: 'createdAt', sortOrder: 'desc' } }]);
      set(() => ({
        myAPIKeys: response.items,
        totalCount: response.totalCount
      }));
    } catch (error) {
      set(() => ({
        error: true
      }));
      throw error;
    } finally {
      set((state) => ({
        loading: { ...state.loading, myFetch: false }
      }));
    }
  },
  getAPIKeys: async (pageSize, page, searchTerm, sortColumn, sortOrder) => {
    try {
      set((state) => ({
        loading: { ...state.loading, fetch: true },
        error: null
      }));

      const response = await fetcher([endpoints.apiKeyManagement.list, { params: { pageSize, page, searchTerm, sortColumn, sortOrder } }]);

      set(() => ({
        allAPIKeys: response.items,
        totalCount: response.totalCount,
      }));
    } catch (error) {
      set(() => ({
        error: true,
      }));
      throw error;
    } finally {
      set((state) => ({
        loading: { ...state.loading, fetch: false }
      }));
    }
  },
  deleteMyAPIKeys: async (ids) => {
    try {
      set((state) => ({
        loading: { ...state.loading, delete: true },
        error: null
      }));
      await deleteItem(endpoints.apiKeyManagement.myDelete, { ids: [ids] });
    } catch (error) {
      set(() => ({
        error: true
      }));
      throw error;
    } finally {
      set((state) => ({
        loading: { ...state.loading, delete: false }
      }));
    }
  },
  deleteAPIKeys: async (ids) => {
    try {
      set((state) => ({
        loading: { ...state.loading, delete: false }
      }));
      await deleteItem(endpoints.apiKeyManagement.delete, { ids: [ids] });
    } catch (error) {
      set(() => ({
        error: true
      }));
      throw error;
    } finally {
      set((state) => ({
        loading: { ...state.loading, delete: false }
      }));
    }
  },
  createAPIKey: async (data) => {
    try {
      set((state) => ({
        loading: { ...state.loading, create: false }
      }));
      const key = await createItem(endpoints.apiKeyManagement.create, data);
      set(() => ({
        createdKey: key
      }));
    } catch (error) {
      set(() => ({
        error: true
      }));
      throw error;
    } finally {
      set((state) => ({
        loading: { ...state.loading, create: false }
      }));
    }
  },
  updateAPIKey: async (data) => {
    try {
      set((state) => ({
        loading: { ...state.loading, update: false }
      }));
      await updateItem(endpoints.apiKeyManagement.update, data);
    } catch (error) {
      set(() => ({
        error: true
      }));
      throw error;
    } finally {
      set((state) => ({
        loading: { ...state.loading, update: false }
      }));
    }
  },
  updateMyAPIKey: async (data) => {
    try {
      set((state) => ({
        loading: { ...state.loading, update: false }
      }));
      await updateItem(endpoints.apiKeyManagement.myUpdate, data);
    } catch (error) {
      set(() => ({
        error: true
      }));
      throw error;
    } finally {
      set((state) => ({
        loading: { ...state.loading, update: false }
      }));
    }
  },
  getMyAPIKeyById: async (id) => {
    try {
      set((state) => ({
        loading: { ...state.loading, delete: false }
      }));
      const result = await fetcher(`${endpoints.apiKeyManagement.myDetail}/${id}`);
      set(() => ({
        myAPIKeyById: result
      }));
    } catch (error) {
      set(() => ({
        error: true,
        myAPIKeyById: null
      }));
      throw error;
    } finally {
      set((state) => ({
        loading: { ...state.loading, delete: false }
      }));
    }
  },
  getAPIKeyById: async (id) => {
    try {
      set((state) => ({
        loading: { ...state.loading, delete: false }
      }));
      const result = await fetcher(`${endpoints.apiKeyManagement.detail}/${id}`);
      set(() => ({
        APIKeyById: result
      }));
    } catch (error) {
      set(() => ({
        error: true,
        APIKeyById: null
      }));
      throw error;
    } finally {
      set((state) => ({
        loading: { ...state.loading, delete: false }
      }));
    }
  },
  getScopes: async () => {
    try {
      set((state) => ({
        loading: { ...state.loading, scopes: false }
      }));
      const result = await fetcher(endpoints.apiKeyManagement.getScopes);
      set(() => ({
        scopes: result
      }));
    } catch (error) {
      set(() => ({
        error: true,
      }));
      throw error;
    } finally {
      set((state) => ({
        loading: { ...state.loading, scopes: false }
      }));
    }
  }
}));
