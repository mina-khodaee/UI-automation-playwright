import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as contractsApi from './contracts.http';
import { ContractKeys } from './contracts.keys';

// ----------------------------------------------------------------------
// GET Contracts with pagination
export const useGetContracts = (params) => {
  return useQuery({
    queryKey: ContractKeys.list(params),
    queryFn: () => contractsApi.getContracts(params),
    keepPreviousData: true,
  });
};

// ----------------------------------------------------------------------
// GET Contract by ID
export const useGetContractById = (id) => {
  return useQuery({
    queryKey: ContractKeys.detail(id),
    queryFn: () => contractsApi.getContractById(id),
    enabled: !!id, // فقط زمانی اجرا شود که id وجود داشته باشد
  });
};

// ----------------------------------------------------------------------
// CREATE Contract
export const useCreateContract = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => contractsApi.createContract(data),
    onSuccess: () => {
      // اینوالیدیت کردن لیست قراردادها بعد از ایجاد موفق
      queryClient.invalidateQueries({ queryKey: ContractKeys.lists() });
    },
  });
};

// ----------------------------------------------------------------------
// UPDATE Contract
export const useUpdateContract = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => contractsApi.updateContract(data),
    onSuccess: (data, variables) => {
      // اینوالیدیت کردن هم لیست و هم جزئیات قرارداد آپدیت شده
      queryClient.invalidateQueries({ queryKey: ContractKeys.lists() });
      if (variables?.id) {
        queryClient.invalidateQueries({ queryKey: ContractKeys.detail(variables.id) });
      }
    },
  });
};

// ----------------------------------------------------------------------
// DELETE Contracts
export const useDeleteContracts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contractIds) => contractsApi.deleteContracts(contractIds),
    onSuccess: () => {
      // اینوالیدیت کردن لیست قراردادها بعد از حذف
      queryClient.invalidateQueries({ queryKey: ContractKeys.lists() });
    },
  });
};

// ----------------------------------------------------------------------
// DELETE Single Contract (wrapper for convenience)
export const useDeleteContract = () => {
  const queryClient = useQueryClient();
  const deleteContractsMutation = useDeleteContracts();

  return useMutation({
    mutationFn: (contractId) => deleteContractsMutation.mutateAsync([contractId]),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ContractKeys.lists() });
    },
  });
};

// ----------------------------------------------------------------------
// GET Contracts Without Pagination
export const useGetContractsWithoutPagination = (params) => {
  return useQuery({
    queryKey: [...ContractKeys.lists(), 'withoutPagination', params],
    queryFn: () => contractsApi.getContractsWithoutPagination(params),
  });
};