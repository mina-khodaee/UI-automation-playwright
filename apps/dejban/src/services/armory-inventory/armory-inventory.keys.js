// src/services/armory-inventory/armory-inventory.keys.js

export const armoryInventoryKeys = {
    all: ['armory-inventory'],
    lists: () => [...armoryInventoryKeys.all, 'list'],
    list: (params) => [...armoryInventoryKeys.lists(), params],
    detail: (id) => [...armoryInventoryKeys.all, 'detail', id],
};