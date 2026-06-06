// src/services/doors/doors.keys.js

export const doorsKeys = {
  all: ['doors'],
  lists: () => [...doorsKeys.all, 'list'],
  list: (params) => [...doorsKeys.lists(), params],
  detail: (id) => [...doorsKeys.all, 'detail', id],
};