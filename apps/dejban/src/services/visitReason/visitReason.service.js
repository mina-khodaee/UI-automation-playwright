// visitReason.hooks.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVisitReason, createVisitReason } from './visitReason.http';
import { visitReasonKeys } from './visitReason.keys';

// List VisitReason
export const useGetVisitReason = (params = {}, enabled = true) =>
  useQuery({
    queryKey: visitReasonKeys.lists(),
    queryFn: getVisitReason,
    enabled,
  });

// Create VisitReason
export const useCreateVisitReason = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => createVisitReason({}),
    onSuccess: () => qc.invalidateQueries({ queryKey: '' }),
  });
};
