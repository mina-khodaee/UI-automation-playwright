// visitorType.keys.js
export const visitorTypeKeys = {
  all: ['visitorTypes'],
  lists: () => [...visitorTypeKeys.all, 'list'],
  list: (params) => [...visitorTypeKeys.lists(), params],
  detail: (id) => [...visitorTypeKeys.all, 'detail', id],
};
