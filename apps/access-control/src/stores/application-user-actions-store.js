import { create } from "zustand";

import { endpoints, fetcher } from "src/lib/api";

export const useApplicationUserActions = create((set) => ({
    applicationUsers: [], 
    params: {},
    loading: false, 
    error: null, 

    getApplicationUsers: async (pageSize) => {
        if (set.applicationUsers?.length > 0) {
            return set.applicationUsers;
        }
            set({ loading: true, error: null });
            set({params: {pageSize}});

            const response = await fetcher([endpoints.accountManagement.list, {params: {pageSize}}]);

            set({ applicationUsers: response.data, loading: false });
            return response.items;
    },
}));
