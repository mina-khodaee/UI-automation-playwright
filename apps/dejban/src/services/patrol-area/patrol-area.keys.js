export const patrolAreaKeys = {
  all: ['patrolArea'],
  lists: () => [...patrolAreaKeys.all, 'list'],
  list: (params) => [...patrolAreaKeys.lists(), params],
  detail: (id) => [...patrolAreaKeys.all, 'detail', id],
};
