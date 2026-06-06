import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVisitorItemTypes, createVisitorItemType } from './visitorItemTypes.http';
import { visitorItemTypesKeys } from './VisitorItemTypes.keys';

// ----------------------------------------------------------------------
// List Visitor Item Types
export const useGetVisitorItemTypes = (params = {}, enabled = false) =>
  useQuery({
    queryKey: visitorItemTypesKeys.list(params),
    queryFn: getVisitorItemTypes,
    enabled,
  });

// ----------------------------------------------------------------------
// Create Visitor Item Type
export const useCreateVisitorItemType = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data) => createVisitorItemType(data),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: visitorItemTypesKeys.lists(),
      });
    },
  });
};
