// src/services/armory-equipments/armory-equipments.keys.js

export const armoryEquipmentsKeys = {
    all: ['armory-equipments'],
    lists: () => [...armoryEquipmentsKeys.all, 'list'],
    list: (params) => [...armoryEquipmentsKeys.lists(), params],
    detail: (id) => [...armoryEquipmentsKeys.all, 'detail', id],
};