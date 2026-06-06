import axiosInstance, { endpoints } from 'src/lib/api';

// ----------------------------------------------------------------------
// GET Vehicles with pagination
export const getVehicles = async ({
  page = 1,
  pageSize = 10,
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

    const response = await axiosInstance.get(endpoints.Vehicle.list, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching Vehicles:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// CREATE Vehicles
export const createVehicles = async (data) => {
  try {
    const response = await axiosInstance.post(endpoints.Vehicle.create, data);
    return response.data;
  } catch (error) {
    console.error('Error creating Vehicles:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// UPDATE Vehicles
export const updateVehicles = async (data) => {
  try {
    const response = await axiosInstance.put(`${endpoints.Vehicle.update}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating Vehicles:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// DELETE Vehicles
export const deleteVehicle = async (id) => {
  try {
    await axiosInstance.delete(endpoints.Vehicle.delete, {
      data: { VehicleId: id },
    });
    return true;
  } catch (error) {
    console.error('Error deleting Vehicles:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// GET Vehicles without pagination

export const getVehiclesWithoutPagination = async (params = {}) => {
  try {
    const response = await axiosInstance.get(endpoints.Vehicle.list, {
      params,
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching Vehicles (without pagination):', error);
    throw error;
  }
};
