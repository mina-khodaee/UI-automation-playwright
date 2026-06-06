// src/services/armory-locations/armory-locations.keys.js

export const armoryLocationsKeys = {
    all: ['armory-locations'],
    lists: () => [...armoryLocationsKeys.all, 'list'],
    list: (params) => [...armoryLocationsKeys.lists(), params],
    detail: (id) => [...armoryLocationsKeys.all, 'detail', id],
};