// ----------------------------------------------------------------------
// Query Keys
export const ocuupationTypeKeys = {
  all: ['occuType'],
  list: (params) => ['occuType', 'list', params],
  pagination: (params) => ['occuType', 'pagination', params],
  detail: (id) => ['occuType', id],
};