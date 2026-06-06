import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createAssignEquipments, getAssignEquipmentsList } from './assign-equipments.http';
import { assignEquipmentsKeys } from './assign-equipments.keys';

// ----------------------------------------------------------------------
// List AssignEquipments
export const useGetAssignEquipments = (params) =>
  useQuery({
    queryKey: assignEquipmentsKeys.list(params),
    queryFn: () => getAssignEquipmentsList(params),
  });

// ----------------------------------------------------------------------
// Create AssignEquipments
export const useCreateAssignEquipments = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data) => createAssignEquipments(data),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: assignEquipmentsKeys.lists(),
      });
    },
  });
};
