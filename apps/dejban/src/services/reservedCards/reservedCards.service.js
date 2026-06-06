// reservedCards.hooks.js

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getReservedCards, createReservedCard } from './reservedCards.http';
import { reservedCardsKeys } from './reservedCards.keys';

// ----------------------------------------------------------------------
// List Reserved Cards
export const useGetReservedCards = (params = {}, enabled = true) =>
  useQuery({
    queryKey: reservedCardsKeys.list(params),
    queryFn: getReservedCards,
    enabled,
  });

// ----------------------------------------------------------------------
// Create Reserved Card
export const useCreateReservedCard = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data) => createReservedCard(data),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: reservedCardsKeys.lists(),
      });
    },
  });
};
