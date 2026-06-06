import axiosInstance, { endpoints } from 'src/lib/api';

// ----------------------------------------------------------------------
// GET VisitReason List
export const getVisitReason = async () => {
  try {
    const response = await axiosInstance.get(endpoints.visitReason.list);
    return response.data;
  } catch (error) {
    console.error('Error fetching visitor types:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// CREATE VisitReason
export const createVisitReason = async (data) => {
  try {
    const response = await axiosInstance.post(endpoints.visitReason.create, data);
    return response.data;
  } catch (error) {
    console.error('Error creating visitor type:', error);
    throw error;
  }
};
