export const visitorBlackListReasonsKeys = {
  all: ['VisitorBlackListReasons'],
  lists: () => [...visitorBlackListReasonsKeys.all, 'list'],
  list: (params) => [...visitorBlackListReasonsKeys.lists(), params],
  detail: (id) => [...visitorBlackListReasonsKeys.all, 'detail', id],
};
