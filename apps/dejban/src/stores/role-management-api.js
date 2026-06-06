import { create } from 'zustand';

import { createItem, deleteItem, endpoints, fetcher, updateItem } from 'src/lib/api';

// ----------------------------------------------------------------------

export const useRoleManagementAPI = create((set) => ({
  allRoles: [],
  params: {},
  totalCount: 0,
  loading: {
    fetch: false,
    myFetch: false,
    delete: false,
    create: false,
    update: false,
    scopes: false,
  },
  error: null,

  getRoles: async (params = {}) => {
    try {
      set((state) => ({
        loading: { ...state.loading, fetch: true },
        error: null,
      }));

      const response = await fetcher([endpoints.roleManagement.roleList, { params }]);

      set(() => ({
        allRoles: response.items,
        totalCount: response.totalCount,
      }));
    } catch (error) {
      set(() => ({
        error: true,
      }));

      throw error;
    } finally {
      set((state) => ({
        loading: { ...state.loading, fetch: false },
      }));
    }
  },

  deleteRoleManagement: async (ids) => {
    try {
      set((state) => ({
        loading: { ...state.loading, delete: true },
        error: null,
      }));
      await deleteItem(endpoints.roleManagement.deleteRole, { ids: [ids] });
    } catch (error) {
      set(() => ({
        error: true,
      }));
      throw error;
    } finally {
      set((state) => ({
        loading: { ...state.loading, delete: false },
      }));
    }
  },

  createRoleManagement: async (data) => {
    try {
      set((state) => ({
        loading: { ...state.loading, create: true },
      }));
      const key = await createItem(endpoints.roleManagement.createRole, data);
      set(() => ({
        createdKey: key,
      }));
      return key;
    } catch (error) {
      set(() => ({
        error: true,
      }));
      throw error;
    } finally {
      set((state) => ({
        loading: { ...state.loading, create: false },
      }));
    }
  },

  getRoleManagementById: async (id) => {
    try {
      set((state) => ({
        loading: { ...state.loading, getRoleManagementById: true },
        error: { ...state.error, getRoleManagementById: false },
      }));

      const response = await fetcher([`${endpoints.roleManagement.getById}/${id}`]);

      return response;
    } catch (error) {
      set((state) => ({
        error: { ...state.error, getRoleManagementById: true },
      }));
      throw error;
    } finally {
      set((state) => ({
        loading: { ...state.loading, getRoleManagementById: false },
      }));
    }
  },

  updateRoleManagement: async (data) => {
    try {
      set((state) => ({
        loading: { ...state.loading, update: true },
      }));
      await updateItem(endpoints.roleManagement.updateRole, data);
    } catch (error) {
      set(() => ({
        error: true,
      }));
      throw error;
    } finally {
      set((state) => ({
        loading: { ...state.loading, update: false },
      }));
    }
  },
}));
