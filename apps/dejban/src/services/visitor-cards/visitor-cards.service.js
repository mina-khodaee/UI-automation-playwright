import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVisitorCards, createVisitorCards, deleteVisitorCards } from './visitor-cards.http';
import { VisitorCardsKeys } from './visitor-cards.keys';

// ----------------------------------------------------------------------
// List VisitorCards
export const useGetVisitorCards = (params) =>
  useQuery({
    queryKey: VisitorCardsKeys.list(params),
    queryFn: () => getVisitorCards(params),
  });

// ----------------------------------------------------------------------
// Create VisitorCards
export const useCreateVisitorCards = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data) => createVisitorCards(data),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: VisitorCardsKeys.lists(),
      });
    },
  });
};

// Delete VisitorCards
export const useDeleteVisitorCards = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteVisitorCards(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: VisitorCardsKeys.lists() }),
  });
};
