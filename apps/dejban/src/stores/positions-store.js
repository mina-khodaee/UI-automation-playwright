import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { fetcher, endpoints, createItem, deleteItem, updateItem } from 'src/lib/api';

// ----------------------------------------------------------------------

export const usePositionStore = create()(
  immer((set) => ({
    cards: [],
    fingerprints: [],
    allPosition: [],
    allPositionByPagination: [],
    items: [],
    accessTypes: [],
    loading: {
      getPositions: false,
      getAccessTypes: false,
    },
    error: {
      getPositions: null,
      getAccessTypes: null,
    },
    totalCount: 0,
    userTypes: [],

    getPositions: async (params = {}) => {
      try {
        set((state) => ({
          loading: { ...state.loading, getPositions: true },
          error: { ...state.error, getPositions: false },
        }));
        const response = await fetcher([endpoints.positions.list, { params }]);
        set(() => ({ items: response.items, totalCount: response.totalCount }));
      } catch (error) {
        set((state) => ({
          error: { ...state.error, getPositions: true },
        }));
        throw error;
      } finally {
        set((state) => ({
          loading: { ...state.loading, getPositions: false },
        }));
      }
    },

    getPositionsWithPagination: async ({
      pageSize,
      page,
      searchTerm,
      sortColumn,
      sortOrder,
    } = {}) => {
      try {
        set((state) => ({
          loading: { ...state.loading, fetch: true },
          error: null,
        }));

        const response = await fetcher([
          endpoints.positions.list,
          {
            params: {
              pageSize,
              page,
              searchTerm,
              sortColumn,
              sortOrder,
            },
          },
        ]);

        set(() => ({
          allPositionByPagination: response.items,
          totalCount: response.totalCount,
        }));
      } catch (error) {
        set(() => ({ error: true }));
        throw error;
      } finally {
        set((state) => ({
          loading: { ...state.loading, fetch: false },
        }));
      }
    },

    getPositionById: async (id) => {
      try {
        set((state) => ({
          loading: { ...state.loading, getPositionById: true },
          error: { ...state.error, getPositionById: false },
        }));

        const response = await fetcher([`${endpoints.positions.getById}/${id}`]);

        return response;
      } catch (error) {
        set((state) => ({
          error: { ...state.error, getPositionById: true },
        }));
        throw error;
      } finally {
        set((state) => ({
          loading: { ...state.loading, getPositionById: false },
        }));
      }
    },

    deletePosition: async (ids) => {
      try {
        set((state) => ({
          loading: { ...state.loading, delete: true },
          error: null,
        }));
        await deleteItem(endpoints.positions.delete, { ids: [ids] });
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

    createPositions: async (data) => {
      try {
        set((state) => ({
          loading: { ...state.loading, create: true },
        }));
        const key = await createItem(endpoints.positions.create, data);
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

    updatePositions: async (data) => {
      try {
        set((state) => ({
          loading: { ...state.loading, update: true },
        }));
        await updateItem(endpoints.positions.update, data);
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
  }))
);
