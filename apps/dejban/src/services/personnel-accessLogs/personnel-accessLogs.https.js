import axiosInstance, { endpoints } from 'src/lib/api';

// ----------------------------------------------------------------------
// GET Personnel Access Logs with pagination
export const getPersonnelPairedAccessLogs = async ({
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

    const response = await axiosInstance.get(endpoints.PersonnelAccessLogs.list, {
      params,
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching personnel access logs with pagination:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
// CREATE Personnel Access Log
export const createPersonnelPairedAccessLogs = async (data) => {
  try {
    const response = await axiosInstance.post(endpoints.PersonnelAccessLogs.create, data);
    return response.data;
  } catch (error) {
    console.error('Error creating personnel access log:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// UPDATE Personnel Access Log
export const updatePersonnelPairedAccessLogs = async (data) => {
  try {
    const response = await axiosInstance.put(endpoints.PersonnelAccessLogs.update, data);
    return response.data;
  } catch (error) {
    console.error('Error updating personnel access log:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// DELETE Personnel Access Log
export const deletePersonnelPairedAccessLogs = async (tagId) => {
  try {
    await axiosInstance.delete(endpoints.PersonnelAccessLogs.delete, {
      data: { tagIds: [tagId] },
    });
    return true;
  } catch (error) {
    console.error('Error deleting personnel access log:', error);
    throw error;
  }
};
