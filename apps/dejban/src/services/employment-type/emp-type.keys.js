// ----------------------------------------------------------------------
// Query Keys
export const empTypeKeys = {
  all: ['empType'],
  list: (params) => ['empType', 'list', params],
  pagination: (params) => ['empType', 'pagination', params],
  detail: (id) => ['empType', id],
};