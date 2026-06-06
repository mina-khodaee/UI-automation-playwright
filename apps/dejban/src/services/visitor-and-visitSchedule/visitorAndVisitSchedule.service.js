import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getVisitorAndVisitSchedule,
  createVisitorAndVisitSchedule,
  VisitorAndVisitScheduleById,
  updateVisitorAndVisitSchedule,
} from './visitorAndVisitSchedule.https';
import { visitorAndVisitScheduleKeys } from './visitorAndVisitSchedule.keys';

// ----------------------------------------------------------------------
// List Visit Schedules
export const useGetVisitorAndVisitSchedule = (params) =>
  useQuery({
    queryKey: visitorAndVisitScheduleKeys.list(params),
    queryFn: () => getVisitorAndVisitSchedule(params),
  });

// Get VisitorAndVisitSchedule By ID
export const useGetVisitorAndVisitScheduleById = (id, options = {}) =>
  useQuery({
    queryKey: visitorAndVisitScheduleKeys.detail(id),
    queryFn: () => VisitorAndVisitScheduleById(id),
    enabled: !!id,
    ...options,
  });

// ----------------------------------------------------------------------
// Create VisitorAndVisitSchedule
export const useCreateVisitorAndVisitSchedule = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data) => createVisitorAndVisitSchedule(data),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: visitorAndVisitScheduleKeys.lists(),
      });
    },
  });
};

// Update VisitorAndVisitSchedule

export const useUpdateVisitorAndVisitSchedule = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => updateVisitorAndVisitSchedule(data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: visitorAndVisitScheduleKeys.list() });
    },
  });
};
