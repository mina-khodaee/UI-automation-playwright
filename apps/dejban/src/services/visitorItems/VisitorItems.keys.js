export const visitorItemsKeys = {
  all: ['visitorItems'],
  lists: () => [...visitorItemsKeys.all, 'list'],
  list: (params) => [...visitorItemsKeys.lists(), params],
  detail: (id) => [...visitorItemsKeys.all, 'detail', id],
};
