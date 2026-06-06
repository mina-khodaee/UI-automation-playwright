export const securityEquipmentTypesKeys = {
  all: ['securityEquipmentTypes'],
  lists: () => [...securityEquipmentTypesKeys.all, 'list'],
  list: (params) => [...securityEquipmentTypesKeys.lists(), params],
  detail: (id) => [...securityEquipmentTypesKeys.all, 'detail', id],
};
