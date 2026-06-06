import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as vehicleAccessLogsApi from './vehicle-accessLogs.https';
import { vehicleAccessLogsKeys } from './vehicle-accessLogs.keys';

// ----------------------------------------------------------------------
// GET Vehicle Access Logs (simple list)
export const useGetVehicleAccessLogs = (params) =>
  useQuery({
    queryKey: vehicleAccessLogsKeys.list(params),
    queryFn: () => vehicleAccessLogsApi.getVehicleAccessLogs(params),
  });

// ----------------------------------------------------------------------
// GET Vehicle Access Logs with pagination
export const useGetVehicleAccessLogsWithPagination = (params) =>
  useQuery({
    queryKey: vehicleAccessLogsKeys.pagination(params),
    queryFn: () => vehicleAccessLogsApi.getVehicleAccessLogsWithPagination(params),
    keepPreviousData: true,
  });

// ----------------------------------------------------------------------
// GET Vehicle Access Log by Id
export const useGetVehicleAccessLogById = (id, options = {}) =>
  useQuery({
    queryKey: vehicleAccessLogsKeys.detail(id),
    queryFn: () => vehicleAccessLogsApi.getVehicleAccessLogById(id),
    enabled: !!id,
    ...options,
  });

// ----------------------------------------------------------------------
// CREATE Vehicle Access Log
export const useCreateVehicleAccessLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => vehicleAccessLogsApi.createVehicleAccessLog(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehicleAccessLogsKeys.all });
    },
  });
};

// ----------------------------------------------------------------------
// UPDATE Vehicle Access Log
export const useUpdateVehicleAccessLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => vehicleAccessLogsApi.updateVehicleAccessLog(data),
    onSuccess: (data, variables) => {
      // Invalidate specific log and all lists
      queryClient.invalidateQueries({ queryKey: vehicleAccessLogsKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: vehicleAccessLogsKeys.all });
    },
  });
};

// ----------------------------------------------------------------------
// DELETE Vehicle Access Log
export const useDeleteVehicleAccessLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => vehicleAccessLogsApi.deleteVehicleAccessLog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehicleAccessLogsKeys.all });
    },
  });
};

// ----------------------------------------------------------------------
// BULK DELETE Vehicle Access Logs
export const useBulkDeleteVehicleAccessLogs = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids) => vehicleAccessLogsApi.bulkDeleteVehicleAccessLogs(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehicleAccessLogsKeys.all });
    },
  });
};
