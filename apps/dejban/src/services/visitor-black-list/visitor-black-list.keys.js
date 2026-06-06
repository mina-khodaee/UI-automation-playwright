export const blockListKeys = {
  all: ['BlockUsers'],
  lists: () => [...blockListKeys.all, 'list'],
  list: (params) => [...blockListKeys.lists(), params],
  detail: (id) => [...blockListKeys.all, 'detail', id],
};
