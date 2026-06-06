import axiosInstance, { endpoints } from 'src/lib/api';

// ----------------------------------------------------------------------
// GET Magazine Info with pagination
export const getMagazineInfos = async ({
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

    const response = await axiosInstance.get(endpoints.major.list, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching Magazine Info:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// CREATE Magazine Info
export const createMagazineInfo = async (data) => {
  try {
    const response = await axiosInstance.post(endpoints.major.create, data);
    return response.data;
  } catch (error) {
    console.error('Error creating Magazine Info:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// UPDATE Magazine Info
export const updateMagazineInfo = async ({ id, ...data }) => {
  try {
    const response = await axiosInstance.put(`${endpoints.major.update}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating Magazine Info:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// DELETE Magazine Info
export const deleteMagazineInfo = async (id) => {
  try {
    await axiosInstance.delete(endpoints.major.delete, {
      data: { majorIds: [id] },
    });
    return true;
  } catch (error) {
    console.error('Error deleting Magazine Info:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// GET Magazine Info without pagination

export const getMagazineInfosWithoutPagination = async (params = {}) => {
  try {
    const response = await axiosInstance.get(endpoints.major.list, {
      params,
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching Magazine Info (without pagination):', error);
    throw error;
  }
};
