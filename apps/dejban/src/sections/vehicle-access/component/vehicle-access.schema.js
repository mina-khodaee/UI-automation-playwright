import { z as zod } from 'zod';

export const VehicleAccessSchema = zod.object({
  searchQuery: zod.string().optional(),
  driverName: zod.string().optional(),
  vehicleType: zod.string().optional(),
  vehiclePlate: zod.string().optional(),
  selectedVehicleId: zod.string().optional(),

  entryDate: zod.string().optional(),
  entryTime: zod.string().optional(),
  entryDoorId: zod.string().optional(),
  entryOccupants: zod.array(
    zod.object({
      id: zod.string().nullable().optional(),
      fullName: zod.string().optional(),
      nationalCode: zod.string().nullable().optional(),
    })
  ).optional().default([]),

  exitDate: zod.string().optional(),
  exitTime: zod.string().optional(),
  exitDoorId: zod.string().optional(),
  exitOccupants: zod.array(
    zod.object({
      id: zod.string().nullable().optional(),
      fullName: zod.string().optional(),
      nationalCode: zod.string().nullable().optional(),
    })
  ).optional().default([]),
});