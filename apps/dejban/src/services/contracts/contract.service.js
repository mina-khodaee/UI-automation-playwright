import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getContract, createContract, deleteContract } from './contract.http';
import { contractKeys } from './contract.keys';

// ----------------------------------------------------------------------
// List Contract
export const useGetContract = (params) =>
  useQuery({
    queryKey: contractKeys.list(params),
    queryFn: () => getContract(params),
  });

// ----------------------------------------------------------------------
// Create Contract
export const useCreateContract = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data) => createContract(data),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: contractKeys.lists(),
      });
    },
  });
};

// Delete Contract
export const useDeleteContract = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteContract(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: contractKeys.lists() }),
  });
};
