export const requestsKeys = {
  all: ['requests'],
  lists: () => [...requestsKeys.all, 'list'],
  list: (params) => [...requestsKeys.lists(), params],
  detail: (id) => [...requestsKeys.all, 'detail', id],
};
