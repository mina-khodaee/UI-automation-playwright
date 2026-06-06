import { create } from "zustand";

import { createItem, deleteItem, endpoints, fetcher, updateItem } from "src/lib/api";

// ----------------------------------------------------------------------

export const useAccessGroupActions = create((set) => ({
    loading: false,
    error: null,
    accessGroups: [],

    getAccessGroups: async (params = {}) => {
        try {
            set({ loading: true, error: null });
            console.log(params)
            const response = await fetcher([endpoints.accessGroups.list, { params }]);
            set({ accessGroups: response.items });
        } catch (error) {
            set({ loading: false, error });
            throw error;
        } finally {
            set({ loading: false });
        }
    },
    deleteAccessGroups: async (ids) => {

        set({ loading: true, error: null });
        await deleteItem(endpoints.regions.delete, { ids: [ids] });
        set({ loading: false });

    },
    createAccessGroup: async (data) => {

        set({ loading: true, error: null });
        const result = await createItem(endpoints.regions.create, data);
        set({ loading: false });
        return result;

    },
    updateAccessGroup: async (data) => {

        set({ loading: true, error: null });
        const result = await updateItem(endpoints.regions.update, data);
        set({ loading: false });
        return result;

    },
    getAccessGroupById: async (id) => {

        set({ loading: true, error: null });
        const result = await fetcher(`${endpoints.regions.detail}/${id}`);
        set({ loading: false });
        return result;
    }
}
));
