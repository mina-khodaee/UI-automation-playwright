export const personnelBlackListReasonsKeys = {
  all: ['PersonnelBlackListReasons'],
  lists: () => [...personnelBlackListReasonsKeys.all, 'list'],
  list: (params) => [...personnelBlackListReasonsKeys.lists(), params],
  detail: (id) => [...personnelBlackListReasonsKeys.all, 'detail', id],
};
