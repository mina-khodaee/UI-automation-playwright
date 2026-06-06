import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as contractorApi from './contractor.http';
import { ContractorKeys } from './contractor.keys';

// ----------------------------------------------------------------------
// GET Contractors With Pagination
export const useGetContractors = (params) =>
  useQuery({
    queryKey: ContractorKeys.list(params),
    queryFn: () => contractorApi.getContractors(params),
    keepPreviousData: true,
  });

// ----------------------------------------------------------------------
// CREATE Contractor
export const useCreateContractor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => contractorApi.createContractors(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ContractorKeys.all });
    },
  });
};

// ----------------------------------------------------------------------
// UPDATE Contractor With Id in Url
export const useUpdateContractor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => contractorApi.updateContractors(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ContractorKeys.all });
    },
  });
};

// ----------------------------------------------------------------------
// DELETE Contractor
export const useDeleteContractor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => contractorApi.deleteContractor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ContractorKeys.all });
    },
  });
};

// ----------------------------------------------------------------------
// GET Contractors With Pagination

// export const useGetContractorsWithOutPagination = (params) =>
//   useQuery({
//     queryKey: ContractorKeys.list(params),
//     queryFn: () => contractorApi.getContractorsWithoutPagination(params),
//   });

// ----------------------------------------------------------------------
// CREATE Board
export const useCreateBoard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => contractorApi.createBoard(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ContractorKeys.all });
    },
  });
};

export const useGetContractorById = (id) => {
  return useQuery({
    queryKey: ContractorKeys.list(id),
    queryFn: () => contractorApi.getContractorById(id),
  });
};
