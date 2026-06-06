import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPersonnelBlackList,
  createPersonnelBlackList,
  deletePersonnelBlackList,
} from './personnel-black-list.http';
import { personnelBlockListKeys } from './personnel-black-list.keys';

// ----------------------------------------------------------------------
// List BlockUsers
export const useGetPersonnelBlackList = (params) =>
  useQuery({
    queryKey: personnelBlockListKeys.list(params),
    queryFn: () => getPersonnelBlackList(params),
  });

// ----------------------------------------------------------------------
// Create BlockUsers
export const useCreatePersonnelBlackList = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data) => createPersonnelBlackList(data),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: personnelBlockListKeys.lists(),
      });
    },
  });
};

// Delete BlockUsers
export const useDeletePersonnelBlackList = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => deletePersonnelBlackList(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: personnelBlockListKeys.lists() }),
  });
};
