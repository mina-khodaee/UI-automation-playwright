import axiosInstance, { endpoints } from 'src/lib/api';

// ----------------------------------------------------------------------
// GET Majors with pagination
export const getMajors = async ({
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
    console.error('Error fetching Majors:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// CREATE Majors
export const createMajors = async (data) => {
  try {
    const response = await axiosInstance.post(endpoints.major.create, data);
    return response.data;
  } catch (error) {
    console.error('Error creating Majors:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// UPDATE Majors
export const updateMajors = async ({ id, ...data }) => {
  try {
    const response = await axiosInstance.put(`${endpoints.major.update}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating Majors:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// DELETE Majors
export const deleteMajor = async (id) => {
  try {
    await axiosInstance.delete(endpoints.major.delete, {
      data: { majorIds: [id] },
    });
    return true;
  } catch (error) {
    console.error('Error deleting Majors:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// GET Majors without pagination

export const getMajorsWithoutPagination = async (params = {}) => {
  try {
    const response = await axiosInstance.get(endpoints.major.list, {
      params,
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching Majors (without pagination):', error);
    throw error;
  }
};
