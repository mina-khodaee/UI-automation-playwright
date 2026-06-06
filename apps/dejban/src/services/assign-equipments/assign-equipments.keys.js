export const assignEquipmentsKeys = {
  all: ['AssignEquipments'],
  lists: () => [...assignEquipmentsKeys.all, 'list'],
  list: (params) => [...assignEquipmentsKeys.lists(), params],
  detail: (id) => [...assignEquipmentsKeys.all, 'detail', id],
};
