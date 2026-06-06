// ----------------------------------------------------------------------
// Query Keys
export const claimKeys = {
  all: ['claim'],
  list: (params) => ['claim', 'list', params],
  pagination: (params) => ['claim', 'pagination', params],
  detail: (id) => ['claim', id],
};