import axiosInstance, { endpoints } from 'src/lib/api';

// ----------------------------------------------------------------------
// GET Visit AccessGroups
export const getAccessGroupsList = async (params) => {
  try {
    const response = await axiosInstance.get(endpoints.AccessGroups.list, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching visit schedules:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// CREATE AccessGroups
export const createAccessGroups = async (data) => {
  try {
    const response = await axiosInstance.post(endpoints.AccessGroups.create, data);
    return response.data;
  } catch (error) {
    console.error('Error creating visit schedule:', error);
    throw error;
  }
};
