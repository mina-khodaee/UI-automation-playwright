import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { requestsKeys } from './request.keys';
import { approveRequest, denyRequest, getManagerRequest } from './requests.http';

// ----------------------------------------------------------------------
// List Manager Schedules
export const useGetManagerRequests = (params) =>
  useQuery({
    queryKey: requestsKeys.list(params),
    queryFn: (params) => getManagerRequest(params),
  });

// ----------------------------------------------------------------------
// Approve Schedule
export const useApproveRequest = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data) => approveRequest(data),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: requestsKeys.lists(),
      });
    },
  });
};

// ----------------------------------------------------------------------
// Deny Schedule
export const useDenyRequest = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data) => denyRequest(data),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: requestsKeys.lists(),
      });
    },
  });
};
