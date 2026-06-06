// ----------------------------------------------------------------------
// Query Keys
export const positionKeys = {
  all: ['positions'],
  list: (params) => ['positions', 'list', params],
  pagination: (params) => ['positions', 'pagination', params],
  detail: (id) => ['positions', id],
};
