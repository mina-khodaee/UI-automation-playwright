import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getShiftSupervisorAndDeputy,
  createShiftSupervisorAndDeputy,
  deleteShiftSupervisorAndDeputy,
  updateShiftSupervisorAndDeputy,
} from './shift-supervisor-and-deputy.https';
import { shiftSupervisorAndDeputyKeys } from './shift-supervisor-and-deputy.keys';

// ----------------------------------------------------------------------
// List ShiftSupervisorAndDeputy
export const useGetShiftSupervisorAndDeputy = (params) =>
  useQuery({
    queryKey: shiftSupervisorAndDeputyKeys.list(params),
    queryFn: () => getShiftSupervisorAndDeputy(params),
  });

// ----------------------------------------------------------------------
// Create ShiftSupervisorAndDeputy
export const useCreateShiftSupervisorAndDeputy = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data) => createShiftSupervisorAndDeputy(data),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: shiftSupervisorAndDeputyKeys.lists(),
      });
    },
  });
};

// Delete ShiftSupervisorAndDeputy
export const useDeleteShiftSupervisorAndDeputy = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteShiftSupervisorAndDeputy(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: shiftSupervisorAndDeputyKeys.lists() }),
  });
};

// Update ShiftSupervisorAndDeputy
export const useUpdateShiftSupervisorAndDeputy = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => updateShiftSupervisorAndDeputy(data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({
        queryKey: shiftSupervisorAndDeputyKeys.lists(),
      });
      qc.invalidateQueries({
        queryKey: shiftSupervisorAndDeputyKeys.detail(variables.id),
      });
    },
  });
};
