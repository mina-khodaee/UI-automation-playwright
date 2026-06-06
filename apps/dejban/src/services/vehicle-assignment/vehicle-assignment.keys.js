// ----------------------------------------------------------------------
// Query Keys
export const VehicleAssignmentKeys = {
    all: ['vehicleAssignments'],
    byVehicleId: (vehicleId) => ['vehicleAssignments', 'byVehicleId', vehicleId],
};