import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as occuTypeApi from './occupation-type.http';
import { ocuupationTypeKeys } from './occupation.keys';

// ----------------------------------------------------------------------
// GET Positions Without Pagination (simple list)
export const useGetOccupationTypeType = (params) =>
  useQuery({
    queryKey: ocuupationTypeKeys.list(params),
    queryFn: () => occuTypeApi.getOccupationType(params),
  });

// ----------------------------------------------------------------------
// GET Positions with pagination
export const useGetOccupationTypeWithPagination = (params) =>
  useQuery({
    queryKey: ocuupationTypeKeys.pagination(params),
    queryFn: () => occuTypeApi.getOccupationTypeWithPagination(params),
    keepPreviousData: true,
  });

// ----------------------------------------------------------------------
// GET Position by Id
export const useGetOccupationTypeById = (id, options = {}) =>
  useQuery({
    queryKey: ocuupationTypeKeys.detail(id),
    queryFn: () => occuTypeApi.getOccupationTypeById(id),
    enabled: !!id,
    ...options,
  });

// ----------------------------------------------------------------------
// CREATE Position
export const useCreateOccupationType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => occuTypeApi.createOccupationType(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ocuupationTypeKeys.all });
    },
  });
};

// ----------------------------------------------------------------------
// UPDATE Position
export const useUpdateOccupationType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => occuTypeApi.updateOccupationType(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ocuupationTypeKeys.all });
    },
  });
};

// ----------------------------------------------------------------------
// DELETE Position
export const useDeleteOccupationType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => occuTypeApi.deleteOccupationType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ocuupationTypeKeys.all });
    },
  });
};
