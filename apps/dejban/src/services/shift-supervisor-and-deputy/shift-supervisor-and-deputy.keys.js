export const shiftSupervisorAndDeputyKeys = {
  all: ['shiftSupervisorAndDeputy'],
  lists: () => [...shiftSupervisorAndDeputyKeys.all, 'list'],
  list: (params) => [...shiftSupervisorAndDeputyKeys.lists(), params],
  detail: (id) => [...shiftSupervisorAndDeputyKeys.all, 'detail', id],
};
