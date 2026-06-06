import { create } from "zustand";
import { immer } from 'zustand/middleware/immer'

import { fetcher, endpoints, createItem } from "src/lib/api";

// ----------------------------------------------------------------------

export const useDeviceUserStore = create()(
    immer((set) => ({
        cards: [],
        fingerprints: [],
        items: [],
        accessTypes: [],
        loading: {
            getDeviceUsers: false,
            getAccessTypes: false,
        },
        error: {
            getDeviceUsers: null,
            getAccessTypes: null,
        },
        totalCount: 0,
        userTypes: [],
        getDeviceUsers: async (params = {}) => {
            try {
                set((state) => ({
                    loading: { ...state.loading, getDeviceUsers: true },
                    error: { ...state.error, getDeviceUsers: false },
                }));
                const response = await fetcher([endpoints.aclUserManagement.list, { params }]);
                set(() => ({ items: response.items, totalCount: response.totalCount }));
            } catch (error) {
                set((state) => ({
                    error: { ...state.error, getDeviceUsers: true },
                }));
                throw error;
            } finally {
                set((state) => ({
                    loading: { ...state.loading, getDeviceUsers: false },
                }));
            }
        },
        getUserBiometricDataById: async (data) => {
            try {
                await createItem(endpoints.aclUserManagement.getBiometricData, data);
            } catch (error) {
                set(() => ({ error: true }))
                throw error;
            }
        },
        getUserTypes: async () => {
            try {
                const response = await fetcher([endpoints.aclUserManagement.getUserTypes]);
                set(() => ({ userTypes: response }))
            } catch (error) {
                set(() => ({ error: true }))
                throw error;
            }
        },
        addCard: (card) => set((state) => {
            state.cards.push(card);
        }),
        removeCard: (cardNumber) => set((state) => {
            state.cards = state.cards.filter(h => h.cardNumber !== cardNumber);
        }),
        remainLastCard: () => set((state) => {
            if (state.cards.length > 1) {
                state.cards = [{ ...state.cards[state.cards.length - 1], cardNumber: 1 }];
            }
        }),
        resetCards: () => set(() => ({ cards: [] })),
        setCards: (cards) => set((state) => {
            state.cards = cards;
        }),
        addFingerprint: (fingerprint) => set((state) => {
            state.fingerprints.push(fingerprint);
        }),
        removeFingerprint: (fingerID) => set((state) => {
            state.fingerprints = state.fingerprints.filter(s => s.fingerID !== fingerID);
        }),
        resetFingerprints: () => set(() => ({ fingerprints: [] })),
        setFingerprints: (fingerprints) => set((state) => {
            state.fingerprints = fingerprints;
        }),
        getCardTypes: async () => {

            const response = await fetcher(endpoints.aclUserManagement.getCardTypes);

            return response;
        },
        getAccessTypes: async () => {
            try {
                set((state) => ({
                    loading: { ...state.loading, getAccessTypes: true },
                    error: { ...state.error, getAccessTypes: false },
                }));
                const response = await fetcher([endpoints.aclUserManagement.getAccessTypes]);
                set(() => ({ accessTypes: response }))
            } catch (error) {
                set((state) => ({
                    error: { ...state.error, getAccessTypes: true },
                }));
                throw error;
            } finally {
                set((state) => ({
                    loading: { ...state.loading, getAccessTypes: false },
                }));
            }
        },
    })));