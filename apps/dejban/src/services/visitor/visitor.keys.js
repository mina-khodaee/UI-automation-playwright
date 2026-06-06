export const visitorKeys = {
  all: ['visitors'],
  lists: () => [...visitorKeys.all, 'list'],
  list: (params) => [...visitorKeys.lists(), params],
  detail: (id) => [...visitorKeys.all, 'detail', id],
};
