export const personnelBlockListKeys = {
  all: ['PersonnelBlockList'],
  lists: () => [...personnelBlockListKeys.all, 'list'],
  list: (params) => [...personnelBlockListKeys.lists(), params],
  detail: (id) => [...personnelBlockListKeys.all, 'detail', id],
};
