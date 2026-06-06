import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVisitorItems, createVisitorItem } from './visitorItems-http';
import { visitorItemsKeys } from './VisitorItems.keys';

// ----------------------------------------------------------------------
// List Visitor Items
export const useGetVisitorItems = (params = {}, enabled = false) =>
  useQuery({
    queryKey: visitorItemsKeys.list(params),
    queryFn: getVisitorItems,
    enabled,
  });

// ----------------------------------------------------------------------
// Create Visitor Item
export const useCreateVisitorItem = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data) => createVisitorItem(data),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: visitorItemsKeys.lists(),
      });
    },
  });
};
