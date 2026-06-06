export const visitorItemTypesKeys = {
  all: ['visitorItemTypes'],
  lists: () => [...visitorItemTypesKeys.all, 'list'],
  list: (params) => [...visitorItemTypesKeys.lists(), params],
  detail: (id) => [...visitorItemTypesKeys.all, 'detail', id],
};
