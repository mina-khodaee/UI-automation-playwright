export const calendarKeys = {
  all: ['calendar'],
  lists: () => [...calendarKeys.all, 'list'],
  list: (params) => [...calendarKeys.lists(), params],
  detail: (id) => [...calendarKeys.all, 'detail', id],
};
