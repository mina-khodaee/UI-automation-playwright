export const visitorAndVisitScheduleKeys = {
  all: ['visitorAndVisitSchedule'],
  lists: () => [...visitorAndVisitScheduleKeys.all, 'list'],
  list: (params) => [...visitorAndVisitScheduleKeys.lists(), params],
  detail: (id) => [...visitorAndVisitScheduleKeys.all, 'detail', id],
};
