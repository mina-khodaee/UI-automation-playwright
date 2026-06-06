import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPersonnelBlackListReasons,
  createPersonnelBlackListReason,
  deletePersonnelBlackListReason,
} from './personnel-black-list-reason.http';
import { personnelBlackListReasonsKeys } from './personnel-black-list-reason.keys';

// ----------------------------------------------------------------------
// List BlockUsers Reasons
export const useGetPersonnelBlackListReasons = (params) =>
  useQuery({
    queryKey: personnelBlackListReasonsKeys.list(params),
    queryFn: () => getPersonnelBlackListReasons(params),
  });

// ----------------------------------------------------------------------
// Create BlockUsers Reason
export const useCreatePersonnelBlackListReason = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => createPersonnelBlackListReason(data),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: personnelBlackListReasonsKeys.lists(),
      });
    },
  });
};

// Delete BlockUsers Reason
export const useDeletePersonnelBlackListReason = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => deletePersonnelBlackListReason(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: personnelBlackListReasonsKeys.lists() }),
  });
};
