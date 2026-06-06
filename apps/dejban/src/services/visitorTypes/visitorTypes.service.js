// visitorType.hooks.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as visitorTypeApi from './visitorTypes.http';
import { visitorTypeKeys } from './visitorTypes.keys';

// List Visitor Types

export const useGetVisitorTypes = () =>
  useQuery({
    queryKey: visitorTypeKeys.lists(),
    queryFn: visitorTypeApi.getVisitorTypesList,
  });


// Select List Visitor Types
export const useGetSelectVisitorTypesList = (enabled = true) =>
  useQuery({
    queryKey: visitorTypeKeys.lists(),
    queryFn: visitorTypeApi.getSelectVisitorTypesList,
    enabled,
  });

// Create Visitor Type
export const useCreateVisitorType = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: visitorTypeApi.createVisitorType,
    onSuccess: () => qc.invalidateQueries({ queryKey: visitorTypeKeys.lists() }),
  });
};

// Update Visitor Type
export const useUpdateVisitorType = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: visitorTypeApi.updateVisitorType,
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: visitorTypeKeys.lists() });
      qc.invalidateQueries({ queryKey: visitorTypeKeys.detail(variables.id) });
    },
  });
};

// Delete Visitor Type
export const useDeleteVisitorType = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: visitorTypeApi.deleteVisitorType,
    onSuccess: () => qc.invalidateQueries({ queryKey: visitorTypeKeys.lists() }),
  });
};
