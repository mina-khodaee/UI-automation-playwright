// ----------------------------------------------------------------------
// Query Keys
export const ContractKeys = {
  all: ['contracts'],
  lists: () => [...ContractKeys.all, 'list'],
  list: (params) => [...ContractKeys.lists(), { params }],
  details: () => [...ContractKeys.all, 'detail'],
  detail: (id) => [...ContractKeys.details(), id],
};
