import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCalendar, createCalendar, deleteCalendar, updateCalendar } from './calendar.https';
import { calendarKeys } from './calendar.keys';

// ----------------------------------------------------------------------
// List Calendar
export const useGetCalendar = (params) =>
  useQuery({
    queryKey: calendarKeys.list(params),
    queryFn: () => getCalendar(params),
  });

// ----------------------------------------------------------------------
// Create Calendar
export const useCreateCalendar = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data) => createCalendar(data),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: calendarKeys.lists(),
      });
    },
  });
};

// Delete Calendar
export const useDeleteCalendar = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteCalendar(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: calendarKeys.lists() }),
  });
};

// Update Calendar
export const useUpdateCalendar = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => updateCalendar(data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: calendarKeys.lists() });
      qc.invalidateQueries({ queryKey: calendarKeys.detail(variables.calendarId) });
    },
  });
};
