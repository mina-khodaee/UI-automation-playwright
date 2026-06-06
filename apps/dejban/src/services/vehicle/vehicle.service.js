import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as vehicleApi from './vehicle.http';
import { VehicleKeys } from './vehicle.keys';

// ----------------------------------------------------------------------
// GET Vehicles
export const useGetVehicles = (params) =>
  useQuery({
    queryKey: VehicleKeys.list(params),
    queryFn: () => vehicleApi.getVehicles(params),
    keepPreviousData: true,
  });

// ----------------------------------------------------------------------
// CREATE Vehicle
export const useCreateVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => vehicleApi.createVehicles(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VehicleKeys.all });
    },
  });
};

// ----------------------------------------------------------------------
// UPDATE Vehicle
export const useUpdateVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => vehicleApi.updateVehicles(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VehicleKeys.all });
    },
  });
};

// ----------------------------------------------------------------------
// DELETE Vehicle
export const useDeleteVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => vehicleApi.deleteVehicle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VehicleKeys.all });
    },
  });
};

// ----------------------------------------------------------------------
// GET Vehicles Without Pagination
export const useGetVehicleWithOutPagination= (params) =>
  useQuery({
    queryKey: VehicleKeys.list(params),
    queryFn: () => vehicleApi.getVehiclesWithoutPagination(params),
  });