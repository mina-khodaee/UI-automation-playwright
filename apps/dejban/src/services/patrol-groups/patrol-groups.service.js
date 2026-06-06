import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPatrolGroups,
  createPatrolGroups,
  deletePatrolGroups,
  updatePatrolGroups,
} from './patrol-groups.https';
import { patrolGroupsKeys } from './patrol-groups.keys';

// ----------------------------------------------------------------------
// List PatrolGroups
export const useGetPatrolGroups = (params) =>
  useQuery({
    queryKey: patrolGroupsKeys.list(params),
    queryFn: () => getPatrolGroups(params),
  });

// ----------------------------------------------------------------------
// Create PatrolGroups
export const useCreatePatrolGroups = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data) => createPatrolGroups(data),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: patrolGroupsKeys.lists(),
      });
    },
  });
};

// Delete PatrolGroups
export const useDeletePatrolGroups = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => deletePatrolGroups(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: patrolGroupsKeys.lists() }),
  });
};

// Update  PatrolGroups
export const useUpdatePatrolGroups = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => updatePatrolGroups(data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: patrolGroupsKeys.lists() });
      qc.invalidateQueries({ queryKey: patrolGroupsKeys.detail(variables.id) });
    },
  });
};
