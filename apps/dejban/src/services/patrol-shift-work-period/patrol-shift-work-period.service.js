import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPatrolShiftWorkPeriod,
  createPatrolShiftWorkPeriod,
  deletePatrolShiftWorkPeriod,
  updatePatrolShiftWorkPeriod,
} from './patrol-shift-work-period.https';
import { patrolShiftWorkPeriodKeys } from './patrol-shift-work-period.keys';

// ----------------------------------------------------------------------
// List PatrolShiftWorkPeriod
export const useGetPatrolShiftWorkPeriod = (params) =>
  useQuery({
    queryKey: patrolShiftWorkPeriodKeys.list(params),
    queryFn: () => getPatrolShiftWorkPeriod(params),
  });

// ----------------------------------------------------------------------
// Create PatrolShiftWorkPeriod
export const useCreatePatrolShiftWorkPeriod = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data) => createPatrolShiftWorkPeriod(data),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: patrolShiftWorkPeriodKeys.lists(),
      });
    },
  });
};

// Delete PatrolShiftWorkPeriod
export const useDeletePatrolShiftWorkPeriod = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => deletePatrolShiftWorkPeriod(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: patrolShiftWorkPeriodKeys.lists() }),
  });
};

// Update PatrolShiftWorkPeriod
export const useUpdatePatrolShiftWorkPeriod = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => updatePatrolShiftWorkPeriod(data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: patrolShiftWorkPeriodKeys.lists() });
      qc.invalidateQueries({
        queryKey: patrolShiftWorkPeriodKeys.detail(variables.id),
      });
    },
  });
};
