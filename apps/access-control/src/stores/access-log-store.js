import { create } from "zustand";

import { endpoints, fetcher } from "src/lib/api";

export const useAccessLogs = create((set) => ({
    items: [],
    authModes: [],
    authTypes: [],
    totalCount: 0,
    loading: false,
    error: null,

    getAccessLogs: async (params = {}) => {
        try {
            set(() => ({ loading: true, error: null }))
            const response = await fetcher([endpoints.accessLogs.list, { params }]);
            set(() => ({ items: response.items, totalCount: response.totalCount }))
        } catch (error) {
            set(() => ({ error: true }))
            throw error;
        } finally {
            set(() => ({ loading: false }))
        }
    },
    getAuthModes: async () => {
        try {
            const response = await fetcher([endpoints.aclUserManagement.getAuthModes]);
            set(() => ({ authModes: response }))
        } catch (error) {
            console.error('Error fetching auth modes:', error);
            throw error;
        }
    },
    getAuthTypes: async () => {
        try {
            const response = await fetcher([endpoints.aclUserManagement.getAuthTypes]);
            set(() => ({ authTypes: response }))
        } catch (error) {
            console.error('Error fetching auth types:', error);
            throw error;
        }
    }
}));