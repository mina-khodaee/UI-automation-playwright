export const vehicleAccessLogsKeys = {
  all: ['vehicleAccessLogs'],
  list: (params) => ['vehicleAccessLogs', 'list', params],
  pagination: (params) => ['vehicleAccessLogs', 'pagination', params],
  detail: (id) => ['vehicleAccessLogs', id],
};
