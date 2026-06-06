// src/services/doors/doors.service.js

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as doorsApi from './doors.http';
import { doorsKeys } from './doors.keys';

// ----------------------------------------------------------------------
// Get Doors List
export const useGetDoors = (params = {}, enabled = true) =>
  useQuery({
    queryKey: doorsKeys.list(params),
    queryFn: () => doorsApi.getDoorsList(params),
    keepPreviousData: true,
    enabled,
  });

// ----------------------------------------------------------------------
// Get Door By ID
export const useGetDoorById = (id) =>
  useQuery({
    queryKey: doorsKeys.detail(id),
    queryFn: () => doorsApi.getDoorById(id),
    enabled: !!id,
  });

// ----------------------------------------------------------------------
// Create Door
export const useCreateDoor = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: doorsApi.createDoor,
    onSuccess: () => qc.invalidateQueries({ queryKey: doorsKeys.lists() }),
  });
};

// ----------------------------------------------------------------------
// Update Door
export const useUpdateDoor = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: doorsApi.updateDoor,
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: doorsKeys.lists() });
      qc.invalidateQueries({ queryKey: doorsKeys.detail(variables.id) });
    },
  });
};

// ----------------------------------------------------------------------
export const useDeleteDoor = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: doorsApi.deleteDoor,
    onSuccess: () => {
      qc.refetchQueries({ queryKey: doorsKeys.lists() });
    },
  });
};