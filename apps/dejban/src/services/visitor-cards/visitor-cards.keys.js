export const VisitorCardsKeys = {
  all: ['VisitorCards'],
  lists: () => [...VisitorCardsKeys.all, 'list'],
  list: (params) => [...VisitorCardsKeys.lists(), params],
  detail: (id) => [...VisitorCardsKeys.all, 'detail', id],
};
