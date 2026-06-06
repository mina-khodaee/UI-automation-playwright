import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPatrolShift,
  createPatrolShift,
  deletePatrolShift,
  updatePatrolShift,
} from './patrol-shift.https';
import { patrolShiftsKeys } from './patrol-shift.keys';

// ----------------------------------------------------------------------
// List PatrolShift
export const useGetPatrolShift = (params) =>
  useQuery({
    queryKey: patrolShiftsKeys.list(params),
    queryFn: () => getPatrolShift(params),
  });

// ----------------------------------------------------------------------
// Create PatrolShift
export const useCreatePatrolShift = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data) => createPatrolShift(data),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: patrolShiftsKeys.lists(),
      });
    },
  });
};

// Delete PatrolShift
export const useDeletePatrolShift = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => deletePatrolShift(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: patrolShiftsKeys.lists() }),
  });
};

// Update  PatrolShift
export const useUpdatePatrolShift = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => updatePatrolShift(data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: patrolShiftsKeys.lists() });
      qc.invalidateQueries({ queryKey: patrolShiftsKeys.detail(variables.id) });
    },
  });
};
