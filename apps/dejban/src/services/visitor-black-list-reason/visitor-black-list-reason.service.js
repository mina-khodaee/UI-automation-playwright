import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getVisitorBlackListReasons,
  createVisitorBlackListReason,
  deleteVisitorBlackListReason,
} from './visitor-black-list-reason.http';
import { visitorBlackListReasonsKeys } from './visitor-black-list-reason.keys';

// ----------------------------------------------------------------------
// List BlockUsers Reasons
export const useGetVisitorBlackListReasons = (params) =>
  useQuery({
    queryKey: visitorBlackListReasonsKeys.list(params),
    queryFn: () => getVisitorBlackListReasons(params),
  });

// ----------------------------------------------------------------------
// Create BlockUsers Reason
export const useCreateVisitorBlackListReason = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => createVisitorBlackListReason(data),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: visitorBlackListReasonsKeys.lists(),
      });
    },
  });
};

// Delete BlockUsers Reason
export const useDeleteVisitorBlackListReason = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteVisitorBlackListReason(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: visitorBlackListReasonsKeys.lists() }),
  });
};
