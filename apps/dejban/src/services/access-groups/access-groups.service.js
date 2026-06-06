import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAccessGroupsList, createAccessGroups } from './access-groups.http';
import { accessGroupsKeys } from './access-groups.keys';

// ----------------------------------------------------------------------
// List AccessGroups
export const useGetAccessGroups = (params) =>
  useQuery({
    queryKey: accessGroupsKeys.list(params),
    queryFn: () => getAccessGroupsList(params),
  });

// ----------------------------------------------------------------------
// Create AccessGroups
export const useCreateAccessGroups = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data) => createAccessGroups(data),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: accessGroupsKeys.lists(),
      });
    },
  });
};
