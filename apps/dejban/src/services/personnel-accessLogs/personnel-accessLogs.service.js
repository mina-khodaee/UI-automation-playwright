import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as personnelPairedAccessLogsApi from './personnel-accessLogs.https';
import { personnelPairedAccessLogsKeys } from './personnel-accessLogs.keys';

// ----------------------------------------------------------------------
// GET Personnel Access Logs with pagination
export const useGetPersonnelPairedAccessLogsWithPagination = (params) =>
  useQuery({
    queryKey: personnelPairedAccessLogsKeys.pagination(params),
    queryFn: () => personnelPairedAccessLogsApi.getPersonnelPairedAccessLogs(params),
    keepPreviousData: true,
  });

// ----------------------------------------------------------------------
// CREATE Personnel Access Log
export const useCreatePersonnelAccessLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => personnelPairedAccessLogsApi.createPersonnelPairedAccessLogs(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: personnelPairedAccessLogsKeys.all });
    },
  });
};

// ----------------------------------------------------------------------
// UPDATE Personnel Access Log
export const useUpdatePersonnelAccessLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => personnelPairedAccessLogsApi.updatePersonnelPairedAccessLogs(data),
    onSuccess: (data, variables) => {
      // Invalidate specific log and all lists
      queryClient.invalidateQueries({
        queryKey: personnelPairedAccessLogsKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: personnelPairedAccessLogsKeys.all });
    },
  });
};

// ----------------------------------------------------------------------
// DELETE Personnel Access Log
export const useDeletePersonnelAccessLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tagId) => personnelPairedAccessLogsApi.deletePersonnelPairedAccessLogs(tagId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: personnelPairedAccessLogsKeys.all });
    },
  });
};

// ----------------------------------------------------------------------
