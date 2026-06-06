import axiosInstance, { endpoints } from 'src/lib/api';

// ----------------------------------------------------------------------
// GET Maintenance with pagination
export const getMaintenance = async ({
  page = 1,
  pageSize = 10,
  searchTerm = '',
  sortColumn,
  sortOrder,
  vehicleId, // فیلتر بر اساس وسیله نقلیه
  startDate, // فیلتر تاریخ شروع
  endDate,   // فیلتر تاریخ پایان
} = {}) => {
  try {
    const params = {
      page,
      pageSize,
      searchTerm,
      sortColumn,
      sortOrder,
      vehicleId,
      startDate,
      endDate,
    };

    const response = await axiosInstance.get(endpoints.maintenance.list, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching Maintenance:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// CREATE Maintenance
export const createMaintenance = async (data) => {
  try {
    const response = await axiosInstance.post(endpoints.maintenance.create, data);
    return response.data;
  } catch (error) {
    console.error('Error creating Maintenance:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// UPDATE Maintenance
export const updateMaintenance = async (data ) => {
  try {
    // اگر آپدیت به صورت PUT /maintenance/update/{id} است
    const response = await axiosInstance.put(`${endpoints.maintenance.update}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating Maintenance:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// DELETE Maintenance
export const deleteMaintenance = async (id) => {
  try {
    await axiosInstance.delete(endpoints.maintenance.delete, {
      data: { MaintenanceId: id } // یا Id: id بستگی به بک‌اند شما دارد
    });
    return true;
  } catch (error) {
    console.error('Error deleting Maintenance:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// GET Maintenance without pagination
export const getMaintenanceWithoutPagination = async (params = {}) => {
  try {
    const response = await axiosInstance.get(endpoints.maintenance.list, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Maintenance (without pagination):', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// GET single Maintenance by ID
export const getMaintenanceById = async (id) => {
  try {
    const response = await axiosInstance.get(`${endpoints.maintenance.list}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Maintenance by ID:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// GET Maintenance by Vehicle ID
export const getMaintenanceByVehicleId = async (vehicleId, params = {}) => {
  try {
    const response = await axiosInstance.get(`${endpoints.maintenance.list}/vehicle/${vehicleId}`, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Maintenance by Vehicle ID:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// GET Maintenance statistics
export const getMaintenanceStatistics = async (params = {}) => {
  try {
    const response = await axiosInstance.get(`${endpoints.maintenance.list}/statistics`, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Maintenance statistics:', error);
    throw error;
  }
};