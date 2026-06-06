import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as maintenanceApi from './maintenance.http';

// ----------------------------------------------------------------------
// Query Keys
export const MaintenanceKeys = {
  all: ['maintenance'],
  list: (params) => ['maintenance', 'list', params],
  detail: (id) => ['maintenance', 'detail', id],
  byVehicle: (vehicleId, params) => ['maintenance', 'byVehicle', vehicleId, params],
  statistics: (params) => ['maintenance', 'statistics', params],
};

// ----------------------------------------------------------------------
// GET Maintenance with pagination
export const useGetMaintenance = (params) =>
  useQuery({
    queryKey: MaintenanceKeys.list(params),
    queryFn: () => maintenanceApi.getMaintenance(params),
    keepPreviousData: true,
  });

// ----------------------------------------------------------------------
// GET Maintenance Without Pagination
export const useGetMaintenanceWithoutPagination = (params) =>
  useQuery({
    queryKey: MaintenanceKeys.list(params),
    queryFn: () => maintenanceApi.getMaintenanceWithoutPagination(params),
  });

// ----------------------------------------------------------------------
// GET single Maintenance by ID
export const useGetMaintenanceById = (id) =>
  useQuery({
    queryKey: MaintenanceKeys.detail(id),
    queryFn: () => maintenanceApi.getMaintenanceById(id),
    enabled: !!id, // فقط زمانی اجرا شود که id وجود داشته باشد
  });

// ----------------------------------------------------------------------
// GET Maintenance by Vehicle ID
export const useGetMaintenanceByVehicleId = (vehicleId, params) =>
  useQuery({
    queryKey: MaintenanceKeys.byVehicle(vehicleId, params),
    queryFn: () => maintenanceApi.getMaintenanceByVehicleId(vehicleId, params),
    enabled: !!vehicleId, // فقط زمانی اجرا شود که vehicleId وجود داشته باشد
  });

// ----------------------------------------------------------------------
// GET Maintenance Statistics
export const useGetMaintenanceStatistics = (params) =>
  useQuery({
    queryKey: MaintenanceKeys.statistics(params),
    queryFn: () => maintenanceApi.getMaintenanceStatistics(params),
  });

// ----------------------------------------------------------------------
// CREATE Maintenance
export const useCreateMaintenance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => maintenanceApi.createMaintenance(data),
    onSuccess: (_, variables) => {
      // اینوالیدیت کردن لیست
      queryClient.invalidateQueries({ queryKey: MaintenanceKeys.all });
      
      // اگر vehicleId در داده وجود دارد، لیست اون وسیله رو هم اینوالیدیت کن
      if (variables?.vehicleId) {
        queryClient.invalidateQueries({ 
          queryKey: MaintenanceKeys.byVehicle(variables.vehicleId) 
        });
      }
      
      // اینوالیدیت کردن آمار
      queryClient.invalidateQueries({ 
        queryKey: MaintenanceKeys.statistics() 
      });
    },
  });
};

// ----------------------------------------------------------------------
// UPDATE Maintenance
export const useUpdateMaintenance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => maintenanceApi.updateMaintenance(data),
    onSuccess: (_, variables) => {
      // اینوالیدیت کردن لیست
      queryClient.invalidateQueries({ queryKey: MaintenanceKeys.all });
      
      // اینوالیدیت کردن جزئیات
      if (variables?.id) {
        queryClient.invalidateQueries({ 
          queryKey: MaintenanceKeys.detail(variables.id) 
        });
      }
      
      // اگر vehicleId در داده وجود دارد
      if (variables?.vehicleId) {
        queryClient.invalidateQueries({ 
          queryKey: MaintenanceKeys.byVehicle(variables.vehicleId) 
        });
      }
      
      // اینوالیدیت کردن آمار
      queryClient.invalidateQueries({ 
        queryKey: MaintenanceKeys.statistics() 
      });
    },
  });
};

// ----------------------------------------------------------------------
// DELETE Maintenance
export const useDeleteMaintenance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => maintenanceApi.deleteMaintenance(id),
    onSuccess: (_, deletedId) => {
      // اینوالیدیت کردن لیست
      queryClient.invalidateQueries({ queryKey: MaintenanceKeys.all });
      
      // پاک کردن جزئیات از کش
      queryClient.removeQueries({ 
        queryKey: MaintenanceKeys.detail(deletedId) 
      });
      
      // اینوالیدیت کردن آمار
      queryClient.invalidateQueries({ 
        queryKey: MaintenanceKeys.statistics() 
      });
      
      // اینوالیدیت کردن همه لیست‌های وابسته به وسیله
      queryClient.invalidateQueries({ 
        queryKey: ['maintenance', 'byVehicle'] 
      });
    },
  });
};

// ----------------------------------------------------------------------
// Bulk DELETE Maintenance
export const useBulkDeleteMaintenance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids) => Promise.all(ids.map(id => maintenanceApi.deleteMaintenance(id))),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MaintenanceKeys.all });
      queryClient.invalidateQueries({ queryKey: ['maintenance', 'byVehicle'] });
      queryClient.invalidateQueries({ queryKey: MaintenanceKeys.statistics() });
    },
  });
};