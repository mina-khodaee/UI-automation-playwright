// reservedCards.keys.js

export const reservedCardsKeys = {
  all: ['reservedCards'],
  lists: () => [...reservedCardsKeys.all, 'list'],
  list: (params) => [...reservedCardsKeys.lists(), params],
  detail: (id) => [...reservedCardsKeys.all, 'detail', id],
};
