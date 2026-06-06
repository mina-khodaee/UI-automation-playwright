import { create } from "zustand";

import { createItem, endpoints, fetcher } from "src/lib/api";

// ----------------------------------------------------------------------

export const useDeviceActions = create((set) => ({
    items: [],
    trafficModes: [],
    totalCount: 0,
    deviceActionsLoading: {
        getDevices: false,
        getTrafficModes: false,
    },
    error: {
        getDevices: null,
        getTrafficModes: null,
    },

    getDevices: async (params = {}) => {
        try {
            set((state) => ({
                loading: { ...state.loading, getDevices: true },
                error: { ...state.error, getDevices: false },
            }));
            const response = await fetcher([endpoints.devices.list, { params }]);
            set(() => ({ items: response.items, totalCount: response.totalCount }))
        } catch (error) {
            set((state) => ({
                error: { ...state.error, getDevices: true },
            }));
            throw error;
        } finally {
            set((state) => ({
                loading: { ...state.loading, getDevices: false },
            }));
        }
    },
    getVirdiDoorStatus: async () => {

        const response = await fetcher(endpoints.devices.commands.getVirdiTerminalDoorStatus);
        return response;

    },
    syncDevicesWithAccessGroup: async (deviceId) => {

        const deviceIds = Array.isArray(deviceId) ? deviceId : [deviceId];
        await createItem(endpoints.devices.commands.syncDevicesWithAccessGroup, { deviceIds });

    },
    changeDeviceGroup: async (data) => {

        await createItem(endpoints.devices.commands.changeDeviceGroup, data);

    },
    setDeviceDoorStatus: async (data) => {

        await createItem(endpoints.devices.commands.setDeviceDoorStatus, data);

    },
    setMaintenanceMode: async (data) => {

        await createItem(endpoints.devices.commands.setMaintenanceMode, data);

    },
    getTrafficModes: async () => {
        try {
            set((state) => ({
                loading: { ...state.loading, getTrafficModes: true },
                error: { ...state.error, getTrafficModes: false },
            }));
            const response = await fetcher([endpoints.devices.getTrafficModes]);
            set(() => ({ trafficModes: response}))
        } catch (error) {
            set((state) => ({
                error: { ...state.error, getTrafficModes: true },
            }));
        } finally {
            set((state) => ({
                loading: { ...state.loading, getTrafficModes: false },
            }));
        }
    }
}));
