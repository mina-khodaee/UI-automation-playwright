import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVisitSchedules, createVisitSchedule } from './visitorAndVisitScheduleReserve.https';
import { visitSchedulesKeys } from './visitorAndVisitScheduleReserve.keys';

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
