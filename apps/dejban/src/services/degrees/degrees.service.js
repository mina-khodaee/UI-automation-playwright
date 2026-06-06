import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as degreesApi from './degrees.http';
import { DegreeKeys } from './degrees.keys';

// ----------------------------------------------------------------------
// GET Degrees With Pagination
export const useGetDegrees = (params) =>
  useQuery({
    queryKey: DegreeKeys.list(params),
    queryFn: () => degreesApi.getDegrees(params),
    keepPreviousData: true,
  });

// ----------------------------------------------------------------------
// CREATE Degree
export const useCreateDegree = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => degreesApi.createDegrees(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DegreeKeys.all });
    },
  });
};

// ----------------------------------------------------------------------
// UPDATE Degree With Id in Url
export const useUpdateDegree = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => degreesApi.updateDegrees(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DegreeKeys.all });
    },
  });
};

// ----------------------------------------------------------------------
// DELETE Degree
export const useDeleteDegree = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => degreesApi.deleteDegree(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DegreeKeys.all });
    },
  });
};

// ----------------------------------------------------------------------
// GET Degrees With Pagination

export const useGetDegreesWithOutPagination = (params) =>
  useQuery({
    queryKey: DegreeKeys.list(params),
    queryFn: () => degreesApi.getDegreesWithoutPagination(params),
  });