// visitor.hooks.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as visitorApi from './visitor.http';
import { visitorKeys } from './visitor.keys';

export const useGetVisitors = (params, enabled = true) =>
  useQuery({
    queryKey: visitorKeys.list(params),
    queryFn: () => visitorApi.getVisitors(params),
    keepPreviousData: true,
    enabled,
  });

// Get Visitor By ID
export const useVisitorById = (id) =>
  useQuery({
    queryKey: visitorKeys.detail(id),
    queryFn: () => visitorApi.getVisitorById(id),
  });

export const useCreateVisitor = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: visitorApi.createVisitor,
    onSuccess: () => qc.invalidateQueries({ queryKey: visitorKeys.list() }),
  });
};

export const useUpdateVisitor = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => visitorApi.updateVisitor(data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: visitorKeys.list() });
    },
  });
};

export const useDeleteVisitors = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => visitorApi.deleteVisitors(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: visitorKeys.lists() }),
  });
};
