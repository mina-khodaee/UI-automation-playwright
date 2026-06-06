import axiosInstance, { endpoints } from 'src/lib/api';

// ----------------------------------------------------------------------
// GET Vehicle Access Logs (simple list)
export const getVehicleAccessLogs = async (params = {}) => {
  try {
    const response = await axiosInstance.get(endpoints.VehicleAccessLogs.list, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching vehicle access logs:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// GET Vehicle Access Logs with pagination
export const getVehicleAccessLogsWithPagination = async ({
  page,
  pageSize,
  searchTerm = '',
  sortColumn,
  sortOrder,
} = {}) => {
  try {
    const params = {
      page,
      pageSize,
      searchTerm,
      sortColumn,
      sortOrder,
    };

    const response = await axiosInstance.get(endpoints.VehicleAccessLogs.list, {
      params,
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching vehicle access logs with pagination:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// GET Single Vehicle Access Log by Id
export const getVehicleAccessLogById = async (id) => {
  try {
    const response = await axiosInstance.get(`${endpoints.VehicleAccessLogs.list}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching vehicle access log by id:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// CREATE Vehicle Access Log
export const createVehicleAccessLog = async (data) => {
  try {
    const response = await axiosInstance.post(endpoints.VehicleAccessLogs.create, data);
    return response.data;
  } catch (error) {
    console.error('Error creating vehicle access log:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// UPDATE Vehicle Access Log
export const updateVehicleAccessLog = async (data) => {
  try {
    const response = await axiosInstance.put(endpoints.VehicleAccessLogs.update, data);
    return response.data;
  } catch (error) {
    console.error('Error updating vehicle access log:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// DELETE Vehicle Access Log
export const deleteVehicleAccessLog = async (id) => {
  try {
    await axiosInstance.delete(endpoints.VehicleAccessLogs.delete, {
      data: { ids: [id] },
    });
    return true;
  } catch (error) {
    console.error('Error deleting vehicle access log:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// BULK DELETE Vehicle Access Logs
export const bulkDeleteVehicleAccessLogs = async (ids) => {
  try {
    await axiosInstance.delete(endpoints.VehicleAccessLogs.delete, {
      data: { ids },
    });
    return true;
  } catch (error) {
    console.error('Error bulk deleting vehicle access logs:', error);
    throw error;
  }
};
