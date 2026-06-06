export const getPlateValue = (vehicle) =>
  !vehicle?.plate ? '' : typeof vehicle.plate === 'object' ? vehicle.plate.value || '' : vehicle.plate;

export const getVehicleTypeValue = (vehicle) =>
  !vehicle?.vehicleType
    ? ''
    : typeof vehicle.vehicleType === 'object'
      ? vehicle.vehicleType.name || ''
      : vehicle.vehicleType;

export const getOwnerInfo = (vehicle) => {
  if (!vehicle) return { ownerId: '', ownerName: '' };
  let ownerId = '',
    ownerName = '';
  if (vehicle.ownerships?.length) {
    const first = vehicle.ownerships[0];
    ownerId = first.ownerId || '';
    ownerName = first.ownerName || first.owner?.name || first.owner?.fullName || '';
  }
  if (!ownerId) ownerId = vehicle.ownerId || '';
  if (!ownerName) ownerName = vehicle.ownerName || vehicle.owner?.name || vehicle.owner?.fullName || '';
  if (!ownerName && ownerId) ownerName = 'مالک';
  return { ownerId, ownerName };
};