// units.keys.js
export const unitsKeys = {
  all: ['units'],
  lists: () => [...unitsKeys.all, 'list'],
  list: (params) => [...unitsKeys.lists(), params],
  selectList: () => [...unitsKeys.all, 'selectList'],
  detail: (id) => [...unitsKeys.all, 'detail', id],
};
