export const contractKeys = {
  all: ['Contract'],
  lists: () => [...contractKeys.all, 'list'],
  list: (params) => [...contractKeys.lists(), params],
  detail: (id) => [...contractKeys.all, 'detail', id],
};
