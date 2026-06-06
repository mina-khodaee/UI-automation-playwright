import axiosInstance, { endpoints } from 'src/lib/api';

// ----------------------------------------------------------------------
// GET Personnel List
export const getPersonnelsList = async ({
  page = 1,
  pageSize = 10,
  searchTerm = '',
  sortColumn,
  sortOrder,
} = {}) => {
  try {
    const params = { page, pageSize, searchTerm, sortColumn, sortOrder };

    const response = await axiosInstance.get(endpoints.personnels.list, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching personnels:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// GET Personnel By ID
export const getPersonnelById = async (personnelId) => {
  try {
    const response = await axiosInstance.get(endpoints.personnels.getById(personnelId));
    return response.data;
  } catch (error) {
    console.error('Error fetching personnel:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// CREATE Personnel
export const createPersonnel = async (data) => {
  try {
    const response = await axiosInstance.post(endpoints.personnels.create, data);
    return response.data;
  } catch (error) {
    console.error('Error creating personnel:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// UPDATE Personnel
export const updatePersonnel = async ({ personnelId, ...payload }) => {
  try {
    const response = await axiosInstance.put(endpoints.personnels.update(personnelId), payload);
    return response.data;
  } catch (error) {
    console.error('Error updating personnel:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// DELETE Personnel
export const deletePersonnels = async (ids) => {
  try {
    await axiosInstance.delete(endpoints.personnels.delete, { data: { ids } });
    return true;
  } catch (error) {
    console.error('Error deleting personnels:', error);
    throw error;
  }
};
