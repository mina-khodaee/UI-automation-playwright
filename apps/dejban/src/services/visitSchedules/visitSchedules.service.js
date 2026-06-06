import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVisitSchedules, createVisitSchedule, getManagerSchedule, approveSchedule, denySchedule } from './visitSchedules.http';
import { visitSchedulesKeys } from './visitSchedules.keys';

// ----------------------------------------------------------------------
// List Visit Schedules
export const useGetVisitSchedules = (params) =>
  useQuery({
    queryKey: visitSchedulesKeys.list(params),
    queryFn: () => getVisitSchedules(params),
  });

// ----------------------------------------------------------------------
// Create Visit Schedule
export const useCreateVisitSchedule = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data) => createVisitSchedule(data),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: visitSchedulesKeys.lists(),
      });
    },
  });
};

// ----------------------------------------------------------------------
// List Manager Schedules
export const useGetManagerSchedules = (params) =>
  useQuery({
    queryKey: visitSchedulesKeys.list(params),
    queryFn: (params) => getManagerSchedule(params),
  });

// ----------------------------------------------------------------------
// Approve Schedule
export const useApproveSchedule = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data) => approveSchedule(data),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: visitSchedulesKeys.lists(),
      });
    },
  });
};

// ----------------------------------------------------------------------
// Deny Schedule
export const useDenySchedule = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data) => denySchedule(data),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: visitSchedulesKeys.lists(),
      });
    },
  });
};
