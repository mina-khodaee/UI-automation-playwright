import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPatrolArea,
  createPatrolArea,
  deletePatrolArea,
  updatePatrolArea,
} from './patrol-area.https';
import { patrolAreaKeys } from './patrol-area.keys';

// ----------------------------------------------------------------------
// List PatrolArea
export const useGetPatrolArea = (params) =>
  useQuery({
    queryKey: patrolAreaKeys.list(params),
    queryFn: () => getPatrolArea(params),
  });

// ----------------------------------------------------------------------
// Create PatrolArea
export const useCreatePatrolArea = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data) => createPatrolArea(data),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: patrolAreaKeys.lists(),
      });
    },
  });
};

// Delete PatrolArea
export const useDeletePatrolArea = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => deletePatrolArea(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: patrolAreaKeys.lists() }),
  });
};

// Update  PatrolArea
export const useUpdatePatrolArea = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => updatePatrolArea(data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: patrolAreaKeys.lists() });
      qc.invalidateQueries({ queryKey: patrolAreaKeys.detail(variables.id) });
    },
  });
};
