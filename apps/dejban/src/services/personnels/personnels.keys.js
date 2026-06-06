// personnel.keys.js
export const personnelKeys = {
  all: ['personnels'],
  lists: () => [...personnelKeys.all, 'list'],
  list: (params) => [...personnelKeys.lists(), params],
  detail: (id) => [...personnelKeys.all, 'detail', id],
};
