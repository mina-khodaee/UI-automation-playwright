import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as empTypeApi from './emp-type.http';
import { empTypeKeys } from './emp-type.keys';

// ----------------------------------------------------------------------
// GET Employment Type (simple list)
export const useGetEmploymentType = (params) =>
  useQuery({
    queryKey: empTypeKeys.list(params),
    queryFn: () => empTypeApi.getEmploymentType(params),
  });

// ----------------------------------------------------------------------
// GET Employment Type with pagination
export const useGetEmploymentTypeWithPagination = (params) =>
  useQuery({
    queryKey: empTypeKeys.pagination(params),
    queryFn: () => empTypeApi.getEmploymentTypeWithPagination(params),
    keepPreviousData: true,
  });

// ----------------------------------------------------------------------
// GET Employment Type by Id
export const useGetEmploymentTypeById = (id, options = {}) =>
  useQuery({
    queryKey: empTypeKeys.detail(id),
    queryFn: () => empTypeApi.getEmploymentTypeById(id),
    enabled: !!id,
    ...options,
  });

// ----------------------------------------------------------------------
// CREATE Employment Type
export const useCreateEmploymentType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => empTypeApi.createEmploymentType(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: empTypeKeys.all });
    },
  });
};

// ----------------------------------------------------------------------
// UPDATE Employment Type
export const useUpdateEmploymentType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => empTypeApi.updateEmploymentType(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: empTypeKeys.all });
    },
  });
};

// ----------------------------------------------------------------------
// DELETE Employment Type
export const useDeleteEmploymentType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => empTypeApi.deleteEmploymentType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: empTypeKeys.all });
    },
  });
};
