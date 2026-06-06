import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSecurityEquipmentTypes,
  createSecurityEquipmentTypes,
  deleteSecurityEquipmentTypes,
  updateSecurityEquipmentTypes,
} from './security-equipment-types.http';
import { securityEquipmentTypesKeys } from './security-equipment-types.keys';

// ----------------------------------------------------------------------
// List SecurityEquipmentTypes
export const useGetSecurityEquipmentTypes = (params) =>
  useQuery({
    queryKey: securityEquipmentTypesKeys.list(params),
    queryFn: () => getSecurityEquipmentTypes(params),
  });

// ----------------------------------------------------------------------
// Create SecurityEquipmentTypes
export const useCreateSecurityEquipmentTypes = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data) => createSecurityEquipmentTypes(data),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: securityEquipmentTypesKeys.lists(),
      });
    },
  });
};

// Delete SecurityEquipmentTypes
export const useDeleteSecurityEquipmentTypes = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteSecurityEquipmentTypes(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: securityEquipmentTypesKeys.lists() }),
  });
};

// Update  SecurityEquipmentTypes
export const useUpdateSecurityEquipmentTypes = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateSecurityEquipmentTypes,
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: securityEquipmentTypesKeys.lists() });
      qc.invalidateQueries({ queryKey: securityEquipmentTypesKeys.detail(variables.id) });
    },
  });
};
