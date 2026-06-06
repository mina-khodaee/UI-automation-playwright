export const patrolShiftsKeys = {
  all: ['patrolShifts'],
  lists: () => [...patrolShiftsKeys.all, 'list'],
  list: (params) => [...patrolShiftsKeys.lists(), params],
  detail: (id) => [...patrolShiftsKeys.all, 'detail', id],
};
