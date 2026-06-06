export const accessGroupsKeys = {
  all: ['BlockUsers'],
  lists: () => [...accessGroupsKeys.all, 'list'],
  list: (params) => [...accessGroupsKeys.lists(), params],
  detail: (id) => [...accessGroupsKeys.all, 'detail', id],
};
