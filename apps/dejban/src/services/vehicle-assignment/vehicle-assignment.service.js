import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as vehicleAssignmentApi from './vehicle-assignment.http';
import { VehicleAssignmentKeys } from './vehicle-assignment.keys';

// ----------------------------------------------------------------------
// GET Active Vehicle Assignments by Vehicle ID
export const useGetActiveVehicleAssignmentsByVehicleId = (vehicleId) => {
    return useQuery({
        queryKey: ["activeVehicleAssignments", vehicleId],
        queryFn: () => vehicleAssignmentApi.getActiveVehicleAssignmentsByVehicleId(vehicleId),
        enabled: !!vehicleId && typeof vehicleId === "string",
    });
};
// ----------------------------------------------------------------------
// CREATE Vehicle Assignment
export const useCreateVehicleAssignment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => vehicleAssignmentApi.createVehicleAssignment(data),
        onSuccess: (data, variables) => {
            if (variables?.vehicleId) {
                queryClient.invalidateQueries({
                    queryKey: VehicleAssignmentKeys.byVehicleId(variables.vehicleId)
                });
            }
            queryClient.invalidateQueries({ queryKey: VehicleAssignmentKeys.all });
        },
    });
};

// ----------------------------------------------------------------------
// UPDATE Vehicle Assignment
export const useUpdateVehicleAssignment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => vehicleAssignmentApi.updateVehicleAssignment(data),
        onSuccess: (data, variables) => {
            if (variables?.vehicleId) {
                queryClient.invalidateQueries({
                    queryKey: VehicleAssignmentKeys.byVehicleId(variables.vehicleId)
                });
            }
            queryClient.invalidateQueries({ queryKey: VehicleAssignmentKeys.all });
        },
    });
};

// ----------------------------------------------------------------------
// DELETE Vehicle Assignment
export const useDeleteVehicleAssignment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => vehicleAssignmentApi.deleteVehicleAssignment(id),
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({ queryKey: VehicleAssignmentKeys.all });
        },
    });
};

export const useEndVehicleAssignment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => vehicleAssignmentApi.endVehicleAssignment (data),
        onSuccess: (data, variables) => {
            if (variables?.vehicleId) {
                queryClient.invalidateQueries({
                    queryKey: VehicleAssignmentKeys.byVehicleId(variables.vehicleId)
                });
            }
            queryClient.invalidateQueries({ queryKey: VehicleAssignmentKeys.all });
        },
    });
};