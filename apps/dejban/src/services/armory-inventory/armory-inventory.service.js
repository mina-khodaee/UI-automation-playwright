// src/services/armory-inventory/armory-inventory.service.js

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as inventoryApi from './armory-inventory.http';
import { armoryInventoryKeys } from './armory-inventory.keys';

// ----------------------------------------------------------------------
// Get Inventory List
export const useGetInventory = (params = {}, enabled = true) =>
    useQuery({
        queryKey: armoryInventoryKeys.list(params),
        queryFn: () => inventoryApi.getInventoryList(params),
        keepPreviousData: true,
        enabled,
    });

// ----------------------------------------------------------------------
// Get Inventory By ID
export const useGetInventoryById = (id) =>
    useQuery({
        queryKey: armoryInventoryKeys.detail(id),
        queryFn: () => inventoryApi.getInventoryById(id),
        enabled: !!id,
    });

// ----------------------------------------------------------------------
// Create Inventory
export const useCreateInventory = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: inventoryApi.createInventory,
        onSuccess: () => qc.invalidateQueries({ queryKey: armoryInventoryKeys.lists() }),
    });
};

// ----------------------------------------------------------------------
// Update Inventory
export const useUpdateInventory = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: inventoryApi.updateInventory,
        onSuccess: (_, variables) => {
            qc.invalidateQueries({ queryKey: armoryInventoryKeys.lists() });
            qc.invalidateQueries({ queryKey: armoryInventoryKeys.detail(variables.id) });
        },
    });
};

// ----------------------------------------------------------------------
// Delete Inventory
export const useDeleteInventory = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: inventoryApi.deleteInventory,
        onSuccess: () => qc.invalidateQueries({ queryKey: armoryInventoryKeys.lists() }),
    });
};

// ----------------------------------------------------------------------
// Disable Inventory (غیرفعال‌سازی)
export const useDisableInventory = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: inventoryApi.disableInventory,
        onSuccess: (_, id) => {
            qc.invalidateQueries({ queryKey: armoryInventoryKeys.lists() });
            qc.invalidateQueries({ queryKey: armoryInventoryKeys.detail(id) });
        },
    });
};

// ----------------------------------------------------------------------
// Enable Inventory (فعال‌سازی مجدد)
export const useEnableInventory = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: inventoryApi.enableInventory,
        onSuccess: (_, id) => {
            qc.invalidateQueries({ queryKey: armoryInventoryKeys.lists() });
            qc.invalidateQueries({ queryKey: armoryInventoryKeys.detail(id) });
        },
    });
};

// ----------------------------------------------------------------------
// Change Status
export const useChangeStatus = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }) => inventoryApi.changeStatus(id, status),
        onSuccess: (_, { id }) => {
            qc.invalidateQueries({ queryKey: armoryInventoryKeys.lists() });
            qc.invalidateQueries({ queryKey: armoryInventoryKeys.detail(id) });
        },
    });
};