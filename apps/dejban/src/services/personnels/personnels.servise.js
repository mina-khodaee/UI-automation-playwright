import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as personnelApi from './personnels.http';
import { personnelKeys } from './personnels.keys';

// List Personnels
export const useGetPersonnels = (params = {}, enabled = true) => {
  const encodedParams = {
    ...params,
  };

  return useQuery({
    queryKey: personnelKeys.list(encodedParams),
    queryFn: () => personnelApi.getPersonnelsList(encodedParams),
    keepPreviousData: true,
    enabled,
  });
};

// Get Personnel By ID
export const useGetPersonnelById = (id) =>
  useQuery({
    queryKey: personnelKeys.detail(id),
    queryFn: () => personnelApi.getPersonnelById(id),
  });

// Create Personnel
export const useCreatePersonnel = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: personnelApi.createPersonnel,
    onSuccess: () => qc.invalidateQueries({ queryKey: personnelKeys.lists() }),
  });
};

// Update Personnel
export const useUpdatePersonnel = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: personnelApi.updatePersonnel,
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: personnelKeys.lists() });
      qc.invalidateQueries({ queryKey: personnelKeys.detail(variables.personnelId) });
    },
  });
};

// Delete Personnels
export const useDeletePersonnels = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: personnelApi.deletePersonnels,
    onSuccess: () => qc.invalidateQueries({ queryKey: personnelKeys.lists() }),
  });
};
