import { create } from "zustand";

import { createItem, endpoints, deleteItem, fetcher, updateItem } from "src/lib/api";

// ----------------------------------------------------------------------

export const useDeviceTypeActions = create((set) => ({
    params: {},
    loading: false,
    error: null,
    deviceTypes: [],

    getDeviceTypes: async (pageSize) => {

        set({ loading: true, error: null });

        const response = await fetcher([endpoints.deviceTypes.list, { params: { pageSize} }]);

        set({ loading: false, deviceTypes: response });

        return response.items;
    },
    deleteDeviceTypes: async (ids) => {

        set({ loading: true, error: null });
        await deleteItem(endpoints.regions.delete, { ids: [ids] });
        set({ loading: false });

    },
    createDeviceType: async (data) => {

        set({ loading: true, error: null });
        const result = await createItem(endpoints.regions.create, data);
        set({ loading: false });
        return result;

    },
    updateDeviceType: async (data) => {

        set({ loading: true, error: null });
        const result = await updateItem(endpoints.regions.update, data);
        set({ loading: false });
        return result;

    },
    getDeviceTypeById: async (id) => {

        set({ loading: true, error: null });
        const result = await fetcher(`${endpoints.regions.detail}/${id}`);
        set({ loading: false });
        return result;
    }
}
));
