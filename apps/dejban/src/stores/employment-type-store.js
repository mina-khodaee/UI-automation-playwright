import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { fetcher, endpoints, createItem, deleteItem, updateItem } from 'src/lib/api';

// ----------------------------------------------------------------------

export const useEmploymentTypeStore = create()(
    immer((set) => ({
        allEmploymentTypeByPagination: [],
        items: [],
        loading: {
            getEmploymentType: false,
            getAccessTypes: false,
        },
        error: {
            getEmploymentType: null,
            getAccessTypes: null,
        },
        totalCount: 0,

        getEmploymentType: async (params = {}) => {
            try {
                set((state) => ({
                    loading: { ...state.loading, getEmploymentType: true },
                    error: { ...state.error, getEmploymentType: false },
                }));
                const response = await fetcher([endpoints.positions.list, { params }]);
                set(() => ({ items: response.items, totalCount: response.totalCount }));
            } catch (error) {
                set((state) => ({
                    error: { ...state.error, getEmploymentType: true },
                }));
                throw error;
            } finally {
                set((state) => ({
                    loading: { ...state.loading, getEmploymentType: false },
                }));
            }
        },


        getEmploymentTypeWithPagination: async ({
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
                    endpoints.positions.list,
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
                    allPositionByPagination: response.items,
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

        getEmploymentTypeById: async (id) => {
            try {
                set((state) => ({
                    loading: { ...state.loading, getEmploymentTypeById: true },
                    error: { ...state.error, getEmploymentTypeById: false },
                }));

                const response = await fetcher([
                    `${endpoints.positions.getById}/${id}`,
                ]);

                return response;

            } catch (error) {
                set((state) => ({
                    error: { ...state.error, getEmploymentTypeById: true },
                }));
                throw error;

            } finally {
                set((state) => ({
                    loading: { ...state.loading, getEmploymentTypeById: false },
                }));
            }
        },



        deleteEmploymentType: async (ids) => {
            try {
                set((state) => ({
                    loading: { ...state.loading, delete: true },
                    error: null
                }));
                await deleteItem(endpoints.positions.delete, { ids: [ids] });
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

        createEmploymentType: async (data) => {
            try {
                set((state) => ({
                    loading: { ...state.loading, create: true }
                }));
                const key = await createItem(endpoints.positions.create, data);
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

        updateEmploymentType: async (data) => {
            try {
                set((state) => ({
                    loading: { ...state.loading, update: true }
                }));
                await updateItem(endpoints.positions.update, data);
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
