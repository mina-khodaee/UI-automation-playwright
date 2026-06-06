import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { fetcher, endpoints, createItem, deleteItem, updateItem } from 'src/lib/api';

// ----------------------------------------------------------------------

export const useUnitsStore = create()(
    immer((set) => ({
        allUnitsByPagination: [],
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

        getUnitsWithPagination: async ({
            pageSize,
            page,
            searchTerm,
            sortColumn,
            sortOrder
        } = {}) => {
            try {
                set((state) => ({
                    loading: { ...state.loading, fetch: true },
                    error: null
                }));

                const response = await fetcher([
                    endpoints.units.list,
                    {
                        params: {
                            pageSize,
                            page,
                            searchTerm,
                            sortColumn,
                            sortOrder
                        }
                    }
                ]);

                set(() => ({
                    allUnitsByPagination: response.items,
                    totalCount: response.totalCount,
                }));

            } catch (error) {
                set(() => ({ error: true }));
                throw error;
            } finally {
                set((state) => ({
                    loading: { ...state.loading, fetch: false }
                }));
            }
        },


        deleteUnit: async (ids) => {
            try {
                set((state) => ({
                    loading: { ...state.loading, delete: true },
                    error: null
                }));
                await deleteItem(endpoints.units.delete, { ids: [ids] });
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

        createUnits: async (data) => {
            try {
                set((state) => ({
                    loading: { ...state.loading, create: true }
                }));
                const key = await createItem(endpoints.units.create, data);
                set(() => ({
                    createdKey: key
                }));
                return key;
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

        updateUnits: async (data) => {
            try {
                set((state) => ({
                    loading: { ...state.loading, update: true }
                }));
                await updateItem(endpoints.units.update, data);
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

    }))
);
