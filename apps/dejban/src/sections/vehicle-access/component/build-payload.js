import moment from 'moment-jalaali';

export const combineDateTime = (date, time) => {
  if (!date || !time) return '';
  const dateObj = moment(date);
  const timeObj = moment(time);
  dateObj.hour(timeObj.hour());
  dateObj.minute(timeObj.minute());
  dateObj.second(0);
  return dateObj.toISOString();
};

export const buildPayload = ({
  formData,
  selectedVehicle,
  currentItem,
  driverData,
  originalPlate,
  originalOwnerId,
  originalOwnerName,
}) => {
  const entryDateTime = combineDateTime(formData.entryDate, formData.entryTime);
  const exitDateTime = combineDateTime(formData.exitDate, formData.exitTime);

  const plateToSend = originalPlate || '';
  const ownerIdToSend = originalOwnerId || null;

  const entryOccupantsData = (formData.entryOccupants || []).map((o) => ({
    id: o.id || null,
    fullName: o.fullName || '',
    nationalCode: o.nationalCode || null,
  }));
  
  const exitOccupantsData = (formData.exitOccupants || []).map((o) => ({
    id: o.id || null,
    fullName: o.fullName || '',
    nationalCode: o.nationalCode || null,
  }));

  const payload = {
    entry: {
      dateTime: entryDateTime,
      doorId: formData.entryDoorId || '',
      occupants: entryOccupantsData,
    },
    exit: {
      dateTime: exitDateTime,
      doorId: formData.exitDoorId || '',
      occupants: exitOccupantsData,
    },
    vehicleId: selectedVehicle?.id || null,
    vehicleType: formData.vehicleType || '',
    plate: plateToSend,
    driverId: driverData.id,
    driverName: driverData.name,
    ownerId: ownerIdToSend,
    ownerName: selectedVehicle?.ownerName || originalOwnerName || '',
    tagId: null,
  };

  console.log('🚀 Final payload:', JSON.stringify(payload, null, 2));
  
  return payload;
};