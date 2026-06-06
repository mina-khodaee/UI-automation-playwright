// units.hooks.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { unitsKeys } from './units.keys';
import * as unitApi from './units.http';

// List Units
export const useGetUnits = (params) =>
  useQuery({
    queryKey: unitsKeys.list(params),
    queryFn: () => unitApi.getUnits(params),
    keepPreviousData: true,
  });

// Get Unit By ID
export const useGetUnitById = (id) =>
  useQuery({
    queryKey: unitsKeys.detail(id),
    queryFn: () => unitApi.getUnitById(id),
  });

// Get Units Select List (dropdown)
export const useGetUnitsSelectList = (params = {}, enabled = true) =>
  useQuery({
    queryKey: unitsKeys.selectList(),
    queryFn: () => unitApi.getUnitsSelectList(params),
    enabled,
  });

// Create Unit
export const useCreateUnit = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: unitApi.createUnit,
    onSuccess: () => qc.invalidateQueries({ queryKey: unitsKeys.lists() }),
  });
};

// Update Unit
export const useUpdateUnit = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: unitApi.updateUnit,
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: unitsKeys.lists() });
      qc.invalidateQueries({ queryKey: unitsKeys.detail(variables.id) });
    },
  });
};

// Delete Unit
export const useDeleteUnit = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: unitApi.deleteUnit,
    onSuccess: () => qc.invalidateQueries({ queryKey: unitsKeys.lists() }),
  });
};

export const useGetUnitsWithOutPagination = (params) =>
  useQuery({
    queryKey: unitsKeys.list(params),
    queryFn: () => unitApi.getUnitsWithoutPagination(params),
  });
