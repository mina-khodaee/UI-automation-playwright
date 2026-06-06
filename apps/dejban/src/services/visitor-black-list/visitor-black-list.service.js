import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getVisitorBlockList,
  createVisitorBlockList,
  deleteVisitorBlockList,
} from './visitor-black-list.http';
import { blockListKeys } from './visitor-black-list.keys';

// ----------------------------------------------------------------------
// List BlockUsers
export const useGetBlockUsers = (params) =>
  useQuery({
    queryKey: blockListKeys.list(params),
    queryFn: () => getVisitorBlockList(params),
  });

// ----------------------------------------------------------------------
// Create BlockUsers
export const useCreateBlockUsers = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data) => createVisitorBlockList(data),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: blockListKeys.lists(),
      });
    },
  });
};

// Delete BlockUsers
export const useDeleteBlockUsers = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteVisitorBlockList(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: blockListKeys.lists() }),
  });
};
