import axiosInstance, { endpoints } from 'src/lib/api';

// ----------------------------------------------------------------------
// GET Degrees with pagination
export const getDegrees = async ({
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

    const response = await axiosInstance.get(endpoints.degree.list, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching Degrees:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// CREATE Degrees
export const createDegrees = async (data) => {
  try {
    const response = await axiosInstance.post(endpoints.degree.create, data);
    return response.data;
  } catch (error) {
    console.error('Error creating Degrees:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// UPDATE Degrees With Id In Url
export const updateDegrees = async ({ id, ...data }) => {
  try {
    const response = await axiosInstance.put(`${endpoints.degree.update}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating Degrees:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// DELETE Degrees
export const deleteDegree = async (id) => {
  try {
    await axiosInstance.delete(endpoints.degree.delete, {
      data: { degreeIds: [id] },
    });
    return true;
  } catch (error) {
    console.error('Error deleting Degrees:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// GET Degrees without pagination

export const getDegreesWithoutPagination = async (params = {}) => {
  try {
    const response = await axiosInstance.get(endpoints.degree.list, {
      params,
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching Degrees (without pagination):', error);
    throw error;
  }
};
