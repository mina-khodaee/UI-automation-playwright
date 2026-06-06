export const patrolShiftWorkPeriodKeys = {
  all: ['patrolShiftWorkPeriods'],
  lists: () => [...patrolShiftWorkPeriodKeys.all, 'list'],
  list: (params) => [...patrolShiftWorkPeriodKeys.lists(), params],
  detail: (id) => [...patrolShiftWorkPeriodKeys.all, 'detail', id],
};
