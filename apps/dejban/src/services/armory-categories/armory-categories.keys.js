// src/services/armory-categories/armory-categories.keys.js

export const armoryCategoriesKeys = {
    all: ['armory-categories'],
    lists: () => [...armoryCategoriesKeys.all, 'list'],
    list: (params) => [...armoryCategoriesKeys.lists(), params],
    detail: (id) => [...armoryCategoriesKeys.all, 'detail', id],
};