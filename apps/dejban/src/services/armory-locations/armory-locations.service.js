// src/services/armory-locations/armory-locations.service.js

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as armoryLocationsApi from './armory-locations.http';
import { armoryLocationsKeys } from './armory-locations.keys';

// ----------------------------------------------------------------------
// Get Armory Locations List
export const useGetArmoryLocations = (params = {}, enabled = true) =>
    useQuery({
        queryKey: armoryLocationsKeys.list(params),
        queryFn: () => armoryLocationsApi.getArmoryLocationsList(params),
        keepPreviousData: true,
        enabled,
    });

// ----------------------------------------------------------------------
// Get Armory Location By ID
export const useGetArmoryLocationById = (id) =>
    useQuery({
        queryKey: armoryLocationsKeys.detail(id),
        queryFn: () => armoryLocationsApi.getArmoryLocationById(id),
        enabled: !!id,
    });

// ----------------------------------------------------------------------
// Create Armory Location
export const useCreateArmoryLocation = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: armoryLocationsApi.createArmoryLocation,
        onSuccess: () => qc.invalidateQueries({ queryKey: armoryLocationsKeys.lists() }),
    });
};

// ----------------------------------------------------------------------
// Update Armory Location
export const useUpdateArmoryLocation = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: armoryLocationsApi.updateArmoryLocation,
        onSuccess: (_, variables) => {
            qc.invalidateQueries({ queryKey: armoryLocationsKeys.lists() });
            qc.invalidateQueries({ queryKey: armoryLocationsKeys.detail(variables.id) });
        },
    });
};

// ----------------------------------------------------------------------
// Delete Armory Location
export const useDeleteArmoryLocation = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: armoryLocationsApi.deleteArmoryLocation,
        onSuccess: () => qc.invalidateQueries({ queryKey: armoryLocationsKeys.lists() }),
    });
};