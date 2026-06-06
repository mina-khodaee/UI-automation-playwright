import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as equipmentApi from './equipment.http';
import { EquipmentKeys } from './equipment.keys';

// ----------------------------------------------------------------------
// GET Equipment with pagination
export const useGetEquipment = (params) =>
  useQuery({
    queryKey: EquipmentKeys.list(params),
    queryFn: () => equipmentApi.getSecurityEquipments(params),
    keepPreviousData: true,
  });

// ----------------------------------------------------------------------
// GET Equipment Without Pagination
export const useGetEquipmentWithoutPagination = (params) =>
  useQuery({
    queryKey: EquipmentKeys.list(params),
    queryFn: () => equipmentApi.getSecurityEquipmentsWithoutPagination(params),
  });

// ----------------------------------------------------------------------
// GET single Equipment by ID
export const useGetEquipmentById = (id) =>
  useQuery({
    queryKey: EquipmentKeys.detail(id),
    queryFn: () => equipmentApi.getSecurityEquipmentsById(id),
    enabled: !!id,
  });

// ----------------------------------------------------------------------
// CREATE Equipment
export const useCreateEquipment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => equipmentApi.createSecurityEquipments(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EquipmentKeys.all });
    },
  });
};

// ----------------------------------------------------------------------
// UPDATE Equipment
export const useUpdateEquipment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => equipmentApi.updateSecurityEquipments(data),
    onSuccess: (_, variables) => {
      // اینوالیدیت کردن لیست و جزئیات
      queryClient.invalidateQueries({ queryKey: EquipmentKeys.all });
      if (variables?.id) {
        queryClient.invalidateQueries({ queryKey: EquipmentKeys.detail(variables.id) });
      }
    },
  });
};

// ----------------------------------------------------------------------
// DELETE Equipment
export const useDeleteEquipment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => equipmentApi.deleteSecurityEquipments(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EquipmentKeys.all });
    },
  });
};
