// visitReason.keys.js
export const visitReasonKeys = {
  all: ['visitReasons'],
  lists: () => [...visitReasonKeys.all, 'list'],
  list: (params) => [...visitReasonKeys.lists(), params],
  detail: (id) => [...visitReasonKeys.all, 'detail', id],
};
