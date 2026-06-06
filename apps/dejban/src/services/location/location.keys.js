// ----------------------------------------------------------------------
// Query Keys
export const locationKeys = {
  all: ['location'],
  list: (params) => ['location', params],
  country: (params) => ['location', 'country', params],
  provience: (params) => ['location', 'provience', params],
  city: (params) => ['location', 'city', params],
  detail: (id) => ['location', id],
};
