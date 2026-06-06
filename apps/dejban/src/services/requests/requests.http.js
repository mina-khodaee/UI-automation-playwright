import axiosInstance, { endpoints } from 'src/lib/api';

// ----------------------------------------------------------------------
// GET Manager Request List
export const getManagerRequest = async (params) => {
  try {
    const response = await axiosInstance.get(endpoints.requests.managerList, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching Manager Request:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// Approve Request
export const approveRequest = async (data) => {
  try {
    const response = await axiosInstance.post(endpoints.requests.approveRequest, data);
    return response.data;
  } catch (error) {
    console.error('Error Approve Request:', error);
    throw error;
  }
};


// ----------------------------------------------------------------------
// Deny Request
export const denyRequest = async (data) => {
  try {
    const response = await axiosInstance.post(endpoints.requests.denyRequest, data);
    return response.data;
  } catch (error) {
    console.error('Error Deny Request:', error);
    throw error;
  }
};