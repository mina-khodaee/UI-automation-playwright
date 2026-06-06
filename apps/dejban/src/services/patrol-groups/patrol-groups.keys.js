export const patrolGroupsKeys = {
  all: ['patrolGroups'],
  lists: () => [...patrolGroupsKeys.all, 'list'],
  list: (params) => [...patrolGroupsKeys.lists(), params],
  detail: (id) => [...patrolGroupsKeys.all, 'detail', id],
};
