// src/services/armory-equipments/armory-equipments.service.js

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as equipmentsApi from './armory-equipments.http';
import { armoryEquipmentsKeys } from './armory-equipments.keys';

export const useGetEquipments = (params = {}, enabled = true) =>
    useQuery({
        queryKey: armoryEquipmentsKeys.list(params),
        queryFn: () => equipmentsApi.getEquipmentsList(params),
        keepPreviousData: true,
        enabled,
    });

export const useGetEquipmentById = (id) =>
    useQuery({
        queryKey: armoryEquipmentsKeys.detail(id),
        queryFn: () => equipmentsApi.getEquipmentById(id),
        enabled: !!id,
    });

export const useCreateEquipment = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: equipmentsApi.createEquipment,
        onSuccess: () => qc.invalidateQueries({ queryKey: armoryEquipmentsKeys.lists() }),
    });
};

export const useUpdateEquipment = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: equipmentsApi.updateEquipment,
        onSuccess: (_, variables) => {
            qc.invalidateQueries({ queryKey: armoryEquipmentsKeys.lists() });
            qc.invalidateQueries({ queryKey: armoryEquipmentsKeys.detail(variables.id) });
        },
    });
};

export const useDeleteEquipment = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: equipmentsApi.deleteEquipment,
        onSuccess: () => qc.invalidateQueries({ queryKey: armoryEquipmentsKeys.lists() }),
    });
};