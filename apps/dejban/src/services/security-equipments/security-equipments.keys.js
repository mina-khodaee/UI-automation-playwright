export const securityEquipmentsKeys = {
  all: ['securityEquipments'],
  lists: () => [...securityEquipmentsKeys.all, 'list'],
  list: (params) => [...securityEquipmentsKeys.lists(), params],
  detail: (id) => [...securityEquipmentsKeys.all, 'detail', id],
};
