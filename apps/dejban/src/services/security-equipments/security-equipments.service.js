import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSecurityEquipments,
  createSecurityEquipments,
  deleteSecurityEquipments,
  updateSecurityEquipments,
} from './security-equipments.http';
import { securityEquipmentsKeys } from './security-equipments.keys';

// ----------------------------------------------------------------------
// List SecurityEquipments
export const useGetSecurityEquipments = (params) =>
  useQuery({
    queryKey: securityEquipmentsKeys.list(params),
    queryFn: () => getSecurityEquipments(params),
  });

// ----------------------------------------------------------------------
// Create SecurityEquipments
export const useCreateSecurityEquipments = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data) => createSecurityEquipments(data),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: securityEquipmentsKeys.lists(),
      });
    },
  });
};

// Delete SecurityEquipments
export const useDeleteSecurityEquipments = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteSecurityEquipments(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: securityEquipmentsKeys.lists() }),
  });
};

// Update  SecurityEquipments
export const useUpdateSecurityEquipments = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateSecurityEquipments,
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: securityEquipmentsKeys.lists() });
      qc.invalidateQueries({ queryKey: securityEquipmentsKeys.detail(variables.id) });
    },
  });
};
