import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as majorsApi from './majors.http';
import { MajorKeys } from './majors.keys';

// ----------------------------------------------------------------------
// GET Majors
export const useGetMajors = (params) =>
  useQuery({
    queryKey: MajorKeys.list(params),
    queryFn: () => majorsApi.getMajors(params),
    keepPreviousData: true,
  });

// ----------------------------------------------------------------------
// CREATE Major
export const useCreateMajor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => majorsApi.createMajors(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MajorKeys.all });
    },
  });
};

// ----------------------------------------------------------------------
// UPDATE Major
export const useUpdateMajor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => majorsApi.updateMajors(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MajorKeys.all });
    },
  });
};

// ----------------------------------------------------------------------
// DELETE Major
export const useDeleteMajor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => majorsApi.deleteMajor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MajorKeys.all });
    },
  });
};

// ----------------------------------------------------------------------
// GET Majors Without Pagination
export const useGetMajorsWithOutPagination= (params) =>
  useQuery({
    queryKey: MajorKeys.list(params),
    queryFn: () => majorsApi.getMajorsWithoutPagination(params),
  });