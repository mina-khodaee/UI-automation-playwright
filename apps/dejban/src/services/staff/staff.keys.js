// ----------------------------------------------------------------------
// Query Keys
export const staffKeys = {
  all: ['staff'],
  list: (params) => ['staff', 'list', params],
  pagination: (params) => ['staff', 'pagination', params],
  detail: (id) => ['staff', id],
  selectList: (params) => ['personnels', 'select', params],
};
