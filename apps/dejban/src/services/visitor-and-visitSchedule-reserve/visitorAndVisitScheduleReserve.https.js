import axiosInstance, { endpoints } from 'src/lib/api';

// ----------------------------------------------------------------------
// GET Visit Schedules List
export const getVisitSchedules = async ({
  page = 1,
  pageSize = 10,
  searchTerm = '',
  sortColumn,
  sortOrder,
} = {}) => {
  try {
    const params = { page, pageSize, searchTerm, sortColumn, sortOrder };
    const response = await axiosInstance.get(endpoints.VisitSchedules.list, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching visit schedules:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// CREATE Visit Schedule
export const createVisitSchedule = async (data) => {
  try {
    const response = await axiosInstance.post(endpoints.VisitSchedules.create, data);
    return response.data;
  } catch (error) {
    console.error('Error creating visit schedule:', error);
    throw error;
  }
};
