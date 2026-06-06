export const visitSchedulesKeys = {
  all: ['visitSchedules'],
  lists: () => [...visitSchedulesKeys.all, 'list'],
  list: (params) => [...visitSchedulesKeys.lists(), params],
  detail: (id) => [...visitSchedulesKeys.all, 'detail', id],
};
