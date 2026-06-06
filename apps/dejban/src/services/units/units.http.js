// units.api.js
import axiosInstance, { endpoints } from 'src/lib/api';

// ----------------------------------------------------------------------
// GET Units List
export const getUnits = async ({
  page = 1,
  pageSize = 10,
  searchTerm = '',
  sortColumn,
  sortOrder,
}) => {
  try {
    const params = {
      page,
      pageSize,
      searchTerm,
      sortColumn,
      sortOrder,
    };

    const response = await axiosInstance.get(endpoints.units.list, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching units:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// GET Units Select List (for dropdowns)
export const getUnitsSelectList = async () => {
  try {
    const response = await axiosInstance.get(endpoints.units.getSelectList);
    return response.data;
  } catch (error) {
    console.error('Error fetching units select list:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// GET Unit By ID
export const getUnitById = async (id) => {
  try {
    const response = await axiosInstance.get(endpoints.units.getById(id));
    return response.data;
  } catch (error) {
    console.error('Error fetching unit:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// CREATE Unit
export const createUnit = async (data) => {
  try {
    const response = await axiosInstance.post(endpoints.units.create, data);
    return response.data;
  } catch (error) {
    console.error('Error creating unit:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// UPDATE Unit
export const updateUnit = async ({ id, ...payload }) => {
  try {
    const response = await axiosInstance.put(endpoints.units.update(id), payload);
    return response.data;
  } catch (error) {
    console.error('Error updating unit:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// DELETE Unit
export const deleteUnit = async (id) => {
  try {
    await axiosInstance.delete(endpoints.units.delete(id));
    return true;
  } catch (error) {
    console.error('Error deleting unit:', error);
    throw error;
  }
};

export const getUnitsWithoutPagination = async (params = {}) => {
  try {
    const response = await axiosInstance.get(endpoints.units.list, {
      params,
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching units (without pagination):', error);
    throw error;
  }
};
