import { create } from "zustand";

import { createItem, fetcher, endpoints, deleteItem, updateItem } from "src/lib/api";

// ----------------------------------------------------------------------

export const useRegionActions = create((set) => ({
    params: {},
    loading: false,
    error: null,
    regions: [],
    node: {},

    getRegions: async () => {
        try {
            set({ loading: true, error: null });
            const response = await fetcher(endpoints.regions.list);
            set({ regions: response });
        } catch (error) {
            set({ error: true });
            throw error;
        } finally {
            set({ loading: false });
        }
    },
    deleteRegions: async (ids) => {

        set({ loading: true, error: null });
        await deleteItem(endpoints.regions.delete, { ids: [ids] });
        set({ loading: false });

    },
    createRegion: async (data) => {

        set({ loading: true, error: null });
        const result = await createItem(endpoints.regions.create, data);
        set({ loading: false });
        return result;

    },
    updateRegion: async (data) => {

        set({ loading: true, error: null });
        const result = await updateItem(endpoints.regions.update, data);
        set({ loading: false });
        return result;

    },
    getRegionById: async (id) => {

        set({ loading: true, error: null });
        const result = await fetcher(`${endpoints.regions.detail}/${id}`);
        set({ loading: false });
        return result;
    },
    setDoorStatus: async (data) => {

        set({ loading: true, error: null });
        const result = await createItem(endpoints.devices.commands.setRegionDoorStatus, data);
        set({ loading: false });
        return result;

    },
}
));
